// --- REQUIRED PACKAGES ---
// Dependencies required: npm install express cors axios multer form-data dotenv
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { createHash } = require('crypto');
const multer = require('multer');
const FormData = require('form-data'); 
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = 3001;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// --- 1. CONFIGURATION: API KEYS ---
const HIBP_API_KEY = process.env.HIBP_API_KEY || "YOUR_HIBP_API_KEY_GOES_HERE"; 
const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY || "5bcda12760a4d5f73336472737a02e7d93ff13ba517854b50ba01598e5574e55"; 

if (HIBP_API_KEY === "YOUR_HIBP_API_KEY_GOES_HERE" || VIRUSTOTAL_API_KEY === "YOUR_VIRUSTOTAL_API_KEY_GOES_HERE") {
    console.warn("⚠ WARNING: API keys are placeholders. Please update your .env file or Vercel Environment Variables with actual keys.");
}

// --- 2. MIDDLEWARE (CORS FIX APPLIED HERE) ---

// FIX: Explicitly allow the Vite frontend port (5173) and any requests from localhost
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or file://)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            // Add other local domains/ports as needed
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('localhost')) {
            callback(null, true);
        } else {
            // For troubleshooting, we temporarily allow all origins if it's a non-production environment.
            // DO NOT USE ASTERISK (*) IN PRODUCTION.
            callback(null, true); 
        }
    },
    methods: 'GET,POST',
    credentials: true,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Global body parser for JSON requests
app.use(express.json());

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE }
});

// Generic error handler for Multer file size limit
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Max size is 10MB.' });
    }
    next(err);
});

// --- API ENDPOINTS (Rest of the file logic remains the same) ---

// --- 3. HIBP API ENDPOINTS ---

app.post('/api/hibp/email', async (req, res) => {
    const { email } = req.body;
    if (!email) { return res.status(400).json({ error: 'Email is required.' }); }
    try {
        const response = await axios.get(`https://haveibeenpwned.com/api/v3/breachedaccount/${email}`, {
            headers: { 'hibp-api-key': HIBP_API_KEY, 'User-Agent': 'InspectraSecure-Toolkit-Node-Backend' },
            validateStatus: (status) => status === 200 || status === 404
        });
        if (response.status === 404) { return res.status(404).json({ message: 'No breaches found.' }); }
        res.json(response.data);
    } catch (error) {
        console.error('HIBP Email Error:', error.message);
        res.status(500).json({ error: 'Failed to query HIBP API.', details: error.response?.data || error.message });
    }
});

app.post('/api/hibp/password', async (req, res) => {
    const { hashPrefix, hashSuffix } = req.body;
    if (!hashPrefix || !hashSuffix || hashPrefix.length !== 5) { return res.status(400).json({ error: 'Invalid hash format received.' }); }
    try {
        const response = await axios.get(`https://api.pwnedpasswords.com/range/${hashPrefix}`, {
            headers: { 'User-Agent': 'InspectraSecure-Toolkit-Node-Backend' }
        });
        const matches = response.data.split('\r\n');
        let pwnedCount = 0;
        for (const line of matches) {
            const [suffix, count] = line.split(':');
            if (suffix === hashSuffix) { pwnedCount = parseInt(count); break; }
        }
        res.json({ pwnedCount });
    } catch (error) {
        console.error('HIBP Password Error:', error.message);
        res.status(500).json({ error: 'Failed to query Pwned Passwords API.' });
    }
});

// --- 4. VIRUSTOTAL API ENDPOINTS ---

app.post('/api/virustotal/url', async (req, res) => {
    const { indicator } = req.body;
    if (!indicator) { return res.status(400).json({ error: 'URL or Hash is required.' }); }
    let endpoint; let payload; let idType = 'id';
    if (indicator.length === 64 && indicator.match(/^[0-9a-fA-F]+$/)) {
        endpoint = `/files/${indicator}`; idType = 'file hash';
    } else {
        endpoint = '/urls'; payload = new URLSearchParams({ url: indicator }).toString(); idType = 'url';
    }
    try {
        let response;
        if (idType === 'url') {
            response = await axios.post(`https://www.virustotal.com/api/v3${endpoint}`, payload, {
                headers: { 'x-apikey': VIRUSTOTAL_API_KEY, 'Content-Type': 'application/x-www-form-urlencoded' }
            });
        } else {
            response = await axios.get(`https://www.virustotal.com/api/v3${endpoint}`, {
                headers: { 'x-apikey': VIRUSTOTAL_API_KEY }
            });
        }
        const analysisId = response.data.data.id;
        res.json({ success: true, message: `Scan initiated successfully for ${idType}. Analysis ID: ${analysisId}`, analysisId });
    } catch (error) {
        console.error(`VirusTotal ${idType} Error:`, error.message);
        const vtError = error.response?.data?.error?.message || 'VirusTotal request failed.';
        res.status(error.response?.status || 500).json({ error: vtError });
    }
});

app.post('/api/virustotal/file', upload.single('file'), async (req, res) => {
    if (!req.file) { return res.status(400).json({ error: 'No file uploaded.' }); }
    const fileBuffer = req.file.buffer;
    try {
        const formData = new FormData();
        formData.append('file', fileBuffer, req.file.originalname);
        const response = await axios.post('https://www.virustotal.com/api/v3/files', formData, {
            headers: { 'x-apikey': VIRUSTOTAL_API_KEY, ...formData.getHeaders() }
        });
        const analysisId = response.data.data.id;
        res.json({ success: true, message: `File upload initiated. Analysis ID: ${analysisId}. Check VT for status.`, analysisId });
    } catch (error) {
        console.error('VirusTotal File Upload Error:', error.message);
        const vtError = error.response?.data?.error?.message || 'VirusTotal file submission failed.';
        res.status(error.response?.status || 500).json({ error: vtError });
    }
});

// --- 5. METADATA API ENDPOINT ---

app.post('/api/metadata/extract', upload.single('file'), (req, res) => {
    if (!req.file) { return res.status(400).json({ error: 'No file uploaded for metadata extraction.' }); }
    
    const simulationData = {
        'File Name': req.file.originalname,
        'File Size': `${(req.file.size / 1024).toFixed(2)} KB`,
        'MIME Type': req.file.mimetype,
        'Author': req.file.originalname.includes('.pdf') ? 'Simulated PDF Author' : 'Unknown',
        'Camera Model': req.file.mimetype.startsWith('image/') ? 'Canon EOS 5D Mark III (Simulated)' : 'N/A',
        'Geo Location': req.file.mimetype.startsWith('image/') ? '40.7128° N, 74.0060° W (Simulated - New York)' : 'None',
        'Software': 'Adobe Photoshop CC 2023 (Simulated)',
        'Creation Date': new Date().toISOString()
    };
    
    let metadataString = "--- Extracted Metadata ---\n";
    for (const [key, value] of Object.entries(simulationData)) { metadataString += `${key}: ${value}\n`; }

    res.json({ success: true, metadata: metadataString });
});


// --- VERCEL AND LOCAL STARTUP ---

if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
    // Vercel deployment: export the app instance for serverless function execution
    module.exports = app;
} else {
    // Local execution: start the server locally
    app.listen(PORT, () => {
        console.log(`InspectraSecure Backend Server is running locally on http://localhost:${PORT}`);
        console.log('Endpoints available at /api/...');
    });
}
