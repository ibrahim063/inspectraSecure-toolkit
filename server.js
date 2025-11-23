const express = require('express');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// ---------------------------------------------------------------------------
// 🔑 API KEY CONFIGURATION
// ---------------------------------------------------------------------------
const HIBP_API_KEY = "YOUR_HIBP_API_KEY_GOES_HERE"; 
const VIRUSTOTAL_API_KEY = "5bcda12760a4d5f73336472737a02e7d93ff13ba517854b50ba01598e5574e55"; 
const GEMINI_API_KEY = "AIzaSyAaFKISU-yrz6wo0iRpGgiyGKFGDcKTANw";
// ---------------------------------------------------------------------------

// Check for missing keys on startup
if (HIBP_API_KEY.includes("GOES_HERE") || VIRUSTOTAL_API_KEY.includes("GOES_HERE") || GEMINI_API_KEY.includes("GOES_HERE")) {
    console.warn("\n⚠️  WARNING: One or more API keys are still set to placeholders in server.js!");
    console.warn("⚠️  Please update server.js with your actual keys for full functionality.\n");
}

// --- MIDDLEWARE ---
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    methods: 'GET,POST',
}));
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: MAX_FILE_SIZE }
});

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Max size is 10MB.' });
    }
    next(err);
});

// --- GEMINI API ---
app.post('/api/gemini', async (req, res) => {
    const { userQuery, systemPrompt, isGrounded } = req.body;
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const tools = isGrounded ? [{ "google_search": {} }] : [];
    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        tools: tools,
        systemInstruction: { parts: [{ text: systemPrompt || "You are a helpful assistant." }] },
    };

    try {
        const response = await axios.post(apiUrl, payload, {
            headers: { 'Content-Type': 'application/json' }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Gemini API Communication Error:', error.response?.status, error.response?.statusText || error.message);
        res.status(500).json({ error: 'Failed to communicate with Gemini API. Check console for details.' });
    }
});

// --- HIBP API ---
app.post('/api/hibp/email', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required.' });
    try {
        const response = await axios.get(`https://haveibeenpwned.com/api/v3/breachedaccount/${email}`, {
            headers: { 'hibp-api-key': HIBP_API_KEY, 'User-Agent': 'InspectraSecure' },
            validateStatus: (status) => status === 200 || status === 404
        });
        if (response.status === 404) return res.status(404).json({ message: 'No breaches found.' });
        res.json(response.data);
    } catch (error) {
        console.error('HIBP Email Error:', error.message);
        res.status(500).json({ error: "Failed to query HIBP." });
    }
});

app.post('/api/hibp/password', async (req, res) => {
    const { hashPrefix, hashSuffix } = req.body;
    if (!hashPrefix || !hashSuffix) return res.status(400).json({ error: 'Invalid hash.' });
    try {
        const response = await axios.get(`https://api.pwnedpasswords.com/range/${hashPrefix}`, {
            headers: { 'User-Agent': 'InspectraSecure' }
        });
        const matches = response.data.split('\r\n');
        let pwnedCount = 0;
        for (const line of matches) {
            const [suffix, count] = line.split(':');
            if (suffix === hashSuffix) {
                pwnedCount = parseInt(count);
                break;
            }
        }
        res.json({ pwnedCount });
    } catch (error) {
        console.error('HIBP Password Error:', error.message);
        res.status(500).json({ error: 'Failed to query Pwned Passwords API.' });
    }
});

// --- VIRUSTOTAL API ---

app.get('/api/virustotal/report/:id', async (req, res) => {
    const analysisId = req.params.id;
    const url = `https://www.virustotal.com/api/v3/analyses/${analysisId}`;

    try {
        const response = await axios.get(url, {
            headers: { 'x-apikey': VIRUSTOTAL_API_KEY },
        });

        const attributes = response.data.data.attributes;
        const status = attributes.status;

        if (status === 'completed') {
            const stats = attributes.stats;
            const maliciousCount = stats.malicious;
            const totalCount = stats.harmless + stats.malicious + stats.suspicious + stats.undetected + stats.timeout;
            
            res.json({
                status: 'completed',
                maliciousCount: maliciousCount,
                totalCount: totalCount,
                result: maliciousCount > 0 ? 'Malicious' : 'Clean',
            });
        } else {
            res.json({ status: status });
        }

    } catch (error) {
        console.error('VirusTotal Report Error:', error.message);
        res.status(500).json({ error: 'Failed to retrieve VirusTotal report.' });
    }
});

app.post('/api/virustotal/url', async (req, res) => {
    const { indicator } = req.body;
    let endpoint = '/urls';
    let payload = `url=${encodeURIComponent(indicator)}`;
    
    const isHash = /^[a-fA-F0-9]{32}$|^[a-fA-F0-9]{40}$|^[a-fA-F0-9]{64}$/.test(indicator);
    if (isHash) { 
        endpoint = `/files/${indicator}`;
    }

    try {
        let response;
        if (isHash) {
             response = await axios.get(`https://www.virustotal.com/api/v3${endpoint}`, {
                headers: { 'x-apikey': VIRUSTOTAL_API_KEY }
            });
            
            const data = response.data.data;
            const stats = data.attributes.last_analysis_stats;
            res.json({ 
                success: true,
                status: 'completed',
                maliciousCount: stats.malicious,
                totalCount: stats.harmless + stats.malicious + stats.suspicious + stats.undetected + stats.timeout,
                message: `Hash analysis complete (${stats.malicious} detections).`
            });

        } else {
             response = await axios.post(`https://www.virustotal.com/api/v3${endpoint}`, payload, {
                headers: { 
                    'x-apikey': VIRUSTOTAL_API_KEY,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            const analysisId = response.data.data.id;
            res.json({ 
                success: true, 
                analysisId: analysisId,
                message: `Scan submitted. Status polling started on ID: ${analysisId}`
            });
        }
    } catch (error) {
        console.error('VirusTotal URL/Hash Error:', error.message);
        res.status(500).json({ error: 'VirusTotal request failed. Check server logs.' });
    }
});

app.post('/api/virustotal/file', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

    try {
        const form = new FormData();
        form.append('file', req.file.buffer, req.file.originalname);
        
        const response = await axios.post('https://www.virustotal.com/api/v3/files', form, {
            headers: {
                'x-apikey': VIRUSTOTAL_API_KEY,
                ...form.getHeaders()
            }
        });
        
        const analysisId = response.data.data.id;
        res.json({ 
            success: true, 
            analysisId: analysisId,
            message: `File uploaded. Scan submitted. Status polling started on ID: ${analysisId}` 
        });

    } catch (error) {
        console.error('VirusTotal Upload Error:', error.response?.data || error.message);
        res.status(500).json({ error: 'File upload failed. Check server logs.' });
    }
});

// --- METADATA EXTRACTOR (FIXED FOR ROBUST SIMULATION) ---
app.post('/api/metadata/extract', upload.single('file'), (req, res) => {
    if (!req.file) {
        console.error('Metadata Error: No file received.');
        return res.status(400).json({ error: 'No file provided for extraction.' });
    }

    // SIMULATED METADATA EXTRACTION
    const metadataObject = {
        'File Name': req.file.originalname,
        'File Size': `${(req.file.size / 1024).toFixed(2)} KB`,
        'MIME Type': req.file.mimetype,
        'Creation Date': '2025-01-20T10:00:00Z',
        'Author': 'Unknown/Redacted',
        'Geo-Location': 'Simulated - None Found',
        'Note': 'Actual EXIF data would be extracted here using a library like exiftool-vendored.',
    };

    // Format the object into a clean, readable string for the frontend <pre> tag
    const formattedMetadata = Object.entries(metadataObject)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

    res.json({ metadata: formattedMetadata });
});

app.listen(PORT, () => {
    console.log(`InspectraSecure Backend running on http://localhost:${PORT}`);
});
