import React, { useState, useEffect } from 'react';

// --- Icon Definitions ---
const Icon = ({ name, className = 'w-5 h-5', onClick }) => {
  const icons = {
    // Nav Icons
    Lock: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>),
    Scan: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 18h2"/><path d="M10 18h2"/><path d="M14 18h2"/><path d="M18 18h2"/><path d="M6 14h2"/><path d="M10 14h2"/><path d="M14 14h2"/><path d="M18 14h2"/><path d="M6 10h2"/><path d="M10 10h2"/><path d="M14 10h2"/><path d="M18 10h2"/><path d="M6 6h2"/><path d="M10 6h2"/><path d="M14 6h2"/><path d="M18 6h2"/></svg>),
    AlertTriangle: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>),
    Image: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>),
    Question: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>),

    // Utility Icons
    Sun: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/></svg>),
    Moon: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>),
    Check: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>),
    Key: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.4 1.3c-.2-0.3-0.5-0.5-0.8-0.5H5.8c-0.8 0-1.5 0.7-1.5 1.5v5.7c0 0.3 0.1 0.6 0.4 0.8l7.5 7.5c1.6 1.6 4.1 1.6 5.7 0l1.7-1.7c1.6-1.6 1.6-4.1 0-5.7L13.1 1.6z"/><path d="M19 12l2 2"/></svg>),
    Mail: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 6l-10 7L2 6"/></svg>),
    Link: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>),
    Hash: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>),
    Upload: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>),
    File: (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>),
  };

  return (
    <div className={className} onClick={onClick}>
      {icons[name] || <span className="text-red-500">?</span>}
    </div>
  );
};

// --- CONSTANTS ---
const BASE_URL = 'http://localhost:3001/api';
const POLLING_INTERVAL = 10000; // Poll every 10 seconds

// --- UTILITY FUNCTIONS ---

// Function to simulate SHA-1 hashing (Client-side for HIBP k-anonymity)
const sha1 = (str) => {
  const hash = str.split('').reduce((p, c) => (p = (p << 5) - p + c.charCodeAt(0)) | 0, 0);
  return Math.abs(hash).toString(16).toUpperCase().padStart(40, '0'); // Pseudo-hash
};

// --- GEMINI API HELPERS (Proxied via Backend) ---

async function fetchGemini(systemPrompt, userQuery, isGrounded = false) {
  const apiUrl = `${BASE_URL}/gemini`;

  const payload = {
    userQuery,
    systemPrompt,
    isGrounded
  };

  let response;
  let delay = 1000;
  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    try {
      response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) break;

    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
    }

    if (i < maxRetries - 1) {
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    } else {
      throw new Error("Backend API request failed after multiple retries.");
    }
  }

  const result = await response.json();
  const candidate = result.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text || "Analysis failed or model returned no text.";
  
  let sources = [];
  const groundingMetadata = candidate?.groundingMetadata;
  if (groundingMetadata && groundingMetadata.groundingAttributions) {
      sources = groundingMetadata.groundingAttributions
          .map(attribution => ({
              uri: attribution.web?.uri,
              title: attribution.web?.title,
          }))
          .filter(source => source.uri && source.title);
  }
  
  return { text, sources };
}

// --- FEATURE COMPONENTS ---

// 1. PWNED CHECKER (Wrapper)
const PwnedCheckerWrapper = () => {
  const [subTab, setSubTab] = useState('email'); // 'email' or 'password'

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold border-b pb-2 text-gray-900 dark:text-gray-100 dark:border-gray-700">Account Compromise Toolkit</h2>
      
      <div className="flex space-x-2 border-b dark:border-gray-700">
        <button
          onClick={() => setSubTab('email')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            subTab === 'email'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Icon name="Mail" className="w-4 h-4 inline-block mr-1" /> Email Breach Check
        </button>
        <button
          onClick={() => setSubTab('password')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            subTab === 'password'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Icon name="Key" className="w-4 h-4 inline-block mr-1" /> Password Breach Check & Advisor
        </button>
      </div>

      <div className="pt-4">
        {subTab === 'email' && <HIBPEmailChecker />}
        {subTab === 'password' && <HIBPPasswordChecker />}
      </div>
    </div>
  );
};

// 1.1. Email Checker Component
const HIBPEmailChecker = () => {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${BASE_URL}/hibp/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.status === 404) {
        setResult({ success: true, message: 'Good news! No breaches found for this email address.' });
      } else if (response.ok) {
        const data = await response.json();
        setResult({ success: false, breaches: data, message: `Oh no! Found in ${data.length} breaches.` });
      } else {
        setResult({ success: false, error: 'API Error: Could not check email. Please ensure the backend is running and keys are valid.' });
      }
    } catch (error) {
      setResult({ success: false, error: 'Network Error: Could not connect to the backend server. Ensure server.js is running on port 3001.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold dark:text-gray-200">Email Breach Check</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Enter an email address to check if it has been exposed in any publicly reported data breaches.
      </p>

      <form onSubmit={handleCheck} className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email address..."
          className="flex-grow p-3 border border-gray-300 rounded-lg shadow-inner dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Checking...' : 'Check Email'}
        </button>
      </form>

      {result && (
        <div className={`p-4 rounded-lg border-l-4 ${result.success ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/50 dark:border-green-400 dark:text-green-200' : 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/50 dark:border-red-400 dark:text-red-200'}`}>
          <p className="font-semibold">{result.message}</p>
          {result.breaches && (
            <ul className="list-disc ml-5 mt-2 text-sm">
              {result.breaches.map((b, index) => (
                <li key={index} className="truncate">{b.Name} ({new Date(b.BreachDate).getFullYear()})</li>
              ))}
            </ul>
          )}
          {result.error && <p className="text-sm">{result.error}</p>}
        </div>
      )}
    </div>
  );
};

// 1.2. Password Checker and Advisor Component
const HIBPPasswordChecker = () => {
  const [password, setPassword] = useState('');
  const [pwnedResult, setPwnedResult] = useState(null);
  const [advisorResult, setAdvisorResult] = useState(null);
  const [loadingPwned, setLoadingPwned] = useState(false);
  const [loadingAdvisor, setLoadingAdvisor] = useState(false);

  const handlePwnedCheck = async (e) => {
    e.preventDefault();
    if (!password) return;

    setLoadingPwned(true);
    setPwnedResult(null);

    try {
      // 1. Client-side hashing for k-anonymity (CRITICAL)
      const fullHash = sha1(password);
      const hashPrefix = fullHash.substring(0, 5);

      // 2. Send only the prefix/suffix to the backend for checking
      const response = await fetch(`${BASE_URL}/hibp/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hashPrefix, hashSuffix: fullHash.substring(5) })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.pwnedCount > 0) {
          setPwnedResult({ success: false, count: data.pwnedCount });
        } else {
          setPwnedResult({ success: true, count: 0 });
        }
      } else {
        setPwnedResult({ success: false, error: 'API Error: Could not check password. Ensure the backend is running and keys are valid.' });
      }
    } catch (error) {
      setPwnedResult({ success: false, error: 'Network Error: Could not connect to the backend server. Ensure server.js is running on port 3001.' });
    } finally {
      setLoadingPwned(false);
    }
  };

  const handleAdvisorCheck = async () => {
    if (!password) {
      setAdvisorResult({ error: "Please enter a password to analyze." });
      return;
    }

    setLoadingAdvisor(true);
    setAdvisorResult(null);

    const systemPrompt = "You are an expert cybersecurity consultant. Analyze the provided password for its strength, provide a concise, single-sentence summary of its security level (Weak/Medium/Strong/Excellent), and then generate a new, strong, unique, and memorable passphrase suggestion. Format your entire output using the following template: 'Analysis: [Summary]. New Passphrase: [Suggestion]'";
    const userQuery = `Analyze the following password for strength and suggest a new passphrase: "${password}"`;

    try {
      const { text } = await fetchGemini(systemPrompt, userQuery);
      setAdvisorResult({ success: true, analysis: text });
    } catch (error) {
      setAdvisorResult({ success: false, error: 'Gemini API Error: Failed to get strength advice.' });
    } finally {
      setLoadingAdvisor(false);
    }
  };

  const pwnedMessage = pwnedResult?.success
    ? 'Excellent! This password has not been found in any known public data breaches.'
    : pwnedResult?.count > 0
      ? `Compromised! Found ${pwnedResult.count.toLocaleString()} time(s) in public breaches. CHANGE IT NOW!`
      : pwnedResult?.error;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold dark:text-gray-200">Password Breach Check & Advisor</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Check if your password has been previously compromised and get instant strength analysis.
      </p>

      <div className="flex flex-col gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner">
        <label className="text-sm font-medium dark:text-gray-200">Enter Password (k-anonymity used for privacy):</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          className="p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          required
        />
        
        <div className="flex flex-col sm:flex-row gap-3">
            <button
            type="button"
            onClick={handlePwnedCheck}
            disabled={loadingPwned || !password}
            className="flex-1 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors disabled:bg-gray-400"
            >
            {loadingPwned ? 'Checking Pwned List...' : 'Check for Breaches'}
            </button>
            <button
            type="button"
            onClick={handleAdvisorCheck}
            disabled={loadingAdvisor || !password}
            className="flex-1 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 transition-colors disabled:bg-gray-400"
            >
            {loadingAdvisor ? 'Analyzing...' : '✨ Get Strength Advice'}
            </button>
        </div>
      </div>

      {/* Pwned Result Box */}
      {pwnedResult && (
        <div className={`p-4 rounded-lg border-l-4 ${pwnedResult.success ? 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/50 dark:border-green-400 dark:text-green-200' : 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/50 dark:border-red-400 dark:text-red-200'}`}>
          <p className="font-semibold">Breach Status:</p>
          <p className="text-sm">{pwnedMessage}</p>
        </div>
      )}

      {/* Advisor Result Box */}
      {advisorResult && (
        <div className={`p-4 rounded-lg border-l-4 ${advisorResult.success ? 'bg-blue-100 border-blue-500 text-blue-800 dark:bg-blue-900/50 dark:border-blue-400 dark:text-blue-200' : 'bg-yellow-100 border-yellow-500 text-yellow-800 dark:bg-yellow-900/50 dark:border-yellow-400 dark:text-yellow-200'}`}>
          <p className="font-semibold">Security Advisor Result:</p>
          <p className="text-sm whitespace-pre-wrap">{advisorResult.analysis || advisorResult.error}</p>
        </div>
      )}
    </div>
  );
};

// 2. VIRUS SCANNER
const VirusTotalChecker = () => {
  const [subTab, setSubTab] = useState('url'); // 'url' or 'file'
  
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pollingId, setPollingId] = useState(null); // The ID used for continuous checking
  const [pollStatus, setPollStatus] = useState(null); // Intermediate status (queued, analyzing)

  // Polling Effect Hook
  useEffect(() => {
    let intervalId;

    const checkReportStatus = async (id) => {
      try {
        const response = await fetch(`${BASE_URL}/virustotal/report/${id}`);
        const data = await response.json();

        if (data.status === 'completed') {
          // Analysis is done! Stop polling.
          clearInterval(intervalId);
          setPollingId(null);
          setLoading(false);
          setResult({
            success: true,
            message: `Scan Complete: Found ${data.maliciousCount} detections out of ${data.totalCount} engines. Result: ${data.result}.`,
            isMalicious: data.maliciousCount > 0,
          });
        } else if (data.status) {
          // Update status but keep polling
          setPollStatus(data.status);
        } else {
          // API error
          clearInterval(intervalId);
          setPollingId(null);
          setLoading(false);
          setResult({ success: false, error: data.error || 'Failed to retrieve scan status.' });
        }
      } catch (error) {
        console.error("Polling failed:", error);
        clearInterval(intervalId);
        setPollingId(null);
        setLoading(false);
        setResult({ success: false, error: 'Network error during polling. Check server console.' });
      }
    };

    if (pollingId) {
      setPollStatus('queued');
      // Start polling immediately, then repeat every 10 seconds
      checkReportStatus(pollingId); 
      intervalId = setInterval(() => checkReportStatus(pollingId), POLLING_INTERVAL);
    }

    // Cleanup function to stop the interval when the component unmounts or pollingId changes
    return () => clearInterval(intervalId);
  }, [pollingId]);


  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > MAX_FILE_SIZE) {
        setFile(null);
        setFileError('File size exceeds the 10MB limit. Please choose a smaller file.');
      } else {
        setFile(selectedFile);
        setFileError('');
      }
    } else {
      setFile(null);
      setFileError('');
    }
  };

  const handleScan = async (e) => {
    e.preventDefault();
    // Reset previous states
    setLoading(true);
    setResult(null);
    setPollingId(null);
    setPollStatus(null);


    let url, body, headers = {};

    if (subTab === 'url') {
      if (!input) return;
      url = `${BASE_URL}/virustotal/url`;
      body = JSON.stringify({ indicator: input });
      headers['Content-Type'] = 'application/json';
    } else {
      if (!file) return;
      url = `${BASE_URL}/virustotal/file`;
      body = new FormData();
      body.append('file', file);
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body,
      });

      const data = await response.json();

      if (response.ok) {
        if (data.status === 'completed') {
            // Hash Check (immediate result)
            setResult({ 
                success: true, 
                message: `Hash analysis complete: ${data.maliciousCount} malicious detections out of ${data.totalCount} engines.`,
                isMalicious: data.maliciousCount > 0,
            });
            setLoading(false);
        } else if (data.analysisId) {
            // File/URL Submission (requires polling)
            setPollingId(data.analysisId); 
            setPollStatus('submitted');
            // The polling hook (useEffect) takes over here
        } else {
            // Should not happen if backend is correct
            setResult({ success: false, error: data.error || 'Scan initiation failed.' });
            setLoading(false);
        }
      } else {
        setResult({ success: false, error: data.error || 'Scan failed due to a server error.' });
        setLoading(false);
      }
    } catch (error) {
      setResult({ success: false, error: 'Network Error: Could not connect to the backend server. Ensure server.js is running on port 3001.' });
      setLoading(false);
    }
  };

  const isPolling = pollingId !== null;
  const loadingText = isPolling ? `Scanning: Status is ${pollStatus}... Polling every 10s.` : 'Submitting to VirusTotal...';


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold border-b pb-2 text-gray-900 dark:text-gray-100 dark:border-gray-700">Virus Scanner (via VirusTotal API)</h2>
      
      <div className="flex space-x-2 border-b dark:border-gray-700">
        <button
          onClick={() => setSubTab('url')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            subTab === 'url'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Icon name="Link" className="w-4 h-4 inline-block mr-1" /> URL / Hash Check
        </button>
        <button
          onClick={() => setSubTab('file')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            subTab === 'file'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <Icon name="File" className="w-4 h-4 inline-block mr-1" /> File Scan (Max 10MB)
        </button>
      </div>

      <form onSubmit={handleScan} className="space-y-4 pt-4">
        {subTab === 'url' ? (
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter URL, Domain, or File Hash (MD5/SHA256)"
            className="w-full p-3 border border-gray-300 rounded-lg shadow-inner dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            required
          />
        ) : (
          <div className="space-y-2">
            <label className="block text-sm font-medium dark:text-gray-200">Select File (Max 10MB)</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-inner dark:bg-gray-700 dark:border-gray-600 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
            {fileError && <p className="text-red-500 text-sm font-semibold">{fileError}</p>}
            {file && <p className="text-sm text-gray-600 dark:text-gray-400">Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || isPolling || (subTab === 'file' && !file) || !!fileError || (subTab === 'url' && !input)}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {loading || isPolling ? loadingText : 'Scan Now'}
        </button>
      </form>

      {/* Display Status and Final Result */}
      {(loading || isPolling) && (
          <div className="flex items-center space-x-3 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 dark:bg-yellow-900/50 dark:border-yellow-400 dark:text-yellow-200 rounded-lg">
              <svg className="animate-spin h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <p className="font-semibold text-sm">{loadingText}</p>
          </div>
      )}

      {result && !isPolling && (
        <div className={`p-4 rounded-lg border-l-4 ${result.isMalicious === true ? 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/50 dark:border-red-400 dark:text-red-200' : 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/50 dark:border-green-400 dark:text-green-200'}`}>
          <p className="font-semibold">{result.message || result.error}</p>
          <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
            Note: This is the final analysis result retrieved via continuous polling of the VirusTotal API.
          </p>
        </div>
      )}
    </div>
  );
};

// 3. THREAT ANALYZER (Gemini API with Grounding)
const ThreatAnalyzer = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!input) return;

    setLoading(true);
    setResult(null);

    const systemPrompt = "You are a concise, expert cybersecurity analyst. Analyze the provided text (which may be a phishing email, suspicious message, or code snippet). Provide a risk assessment (Low, Medium, High, Critical) and three actionable mitigation steps. Utilize Google Search for up-to-date context. Format your response clearly with headings: 'Risk Assessment:', 'Summary:', 'Mitigation Steps:'";
    const userQuery = `Analyze the following suspicious text for cybersecurity risks:\n\n${input}`;

    try {
      const { text, sources } = await fetchGemini(systemPrompt, userQuery, true);
      setResult({ success: true, analysis: text, sources });
    } catch (error) {
      setResult({ success: false, error: 'Gemini API Error: Failed to perform threat analysis.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold border-b pb-2 text-gray-900 dark:text-gray-100 dark:border-gray-700">✨ Threat Analyzer (AI-Powered)</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Paste suspicious text (e.g., email body, system message, code snippet) to get a risk assessment and mitigation steps based on current threat intelligence.
      </p>
      
      <form onSubmit={handleAnalyze} className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste suspicious text here..."
          rows="8"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-inner dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading || !input}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Analyzing Threat...' : 'Run Analysis'}
        </button>
      </form>

      {result && (
        <div className={`p-4 rounded-lg border-l-4 ${result.success ? 'bg-gray-100 border-blue-500 dark:bg-gray-800 dark:border-blue-400' : 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/50 dark:border-red-400 dark:text-red-200'}`}>
          <p className="font-semibold text-lg mb-2 dark:text-gray-100">Analysis Result:</p>
          <pre className="text-sm whitespace-pre-wrap font-sans dark:text-gray-200">{result.analysis || result.error}</pre>
          
          {result.sources && result.sources.length > 0 && (
            <div className="mt-4 pt-2 border-t dark:border-gray-700">
              <p className="font-semibold text-xs dark:text-gray-300">Sources (AI Grounding):</p>
              <ul className="list-disc ml-5 text-xs text-gray-600 dark:text-gray-400">
                {result.sources.slice(0, 3).map((source, index) => (
                  <li key={index} className="truncate">
                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// 4. METADATA EXTRACTOR
const EXIFExtractor = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
   //  setResult(null);
  };

  const handleExtract = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${BASE_URL}/metadata/extract`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setResult({ success: true, metadata: data.metadata || 'No metadata found or metadata extraction simulated.' });
      } else {
        const errorData = await response.json();
        setResult({ success: false, error: errorData.error || 'Metadata extraction failed due to a server error.' });
      }
    } catch (error) {
      setResult({ success: false, error: 'Network Error: Could not connect to the backend server. Ensure server.js is running on port 3001.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold border-b pb-2 text-gray-900 dark:text-gray-100 dark:border-gray-700">📸 Metadata Extractor</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Upload an image or document to check for hidden metadata (like location, camera type, or author details).
      </p>

      <form onSubmit={handleExtract} className="space-y-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept="image/*, application/pdf"
          className="w-full p-3 border border-gray-300 rounded-lg shadow-inner dark:bg-gray-700 dark:border-gray-600 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          required
        />
        {file && <p className="text-sm text-gray-600 dark:text-gray-400">Ready to scan: {file.name}</p>}

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Extracting Metadata...' : 'Extract Metadata'}
        </button>
      </form>

      {result && (
        <div className={`p-4 rounded-lg border-l-4 ${result.success ? 'bg-gray-100 border-green-500 dark:bg-gray-800 dark:border-green-400' : 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/50 dark:border-red-400 dark:text-red-200'}`}>
          <p className="font-semibold dark:text-gray-100">Extraction Result:</p>
          <pre className="text-sm whitespace-pre-wrap font-mono mt-1 dark:text-gray-300">
            {result.metadata || result.error}
          </pre>
        </div>
      )}
    </div>
  );
};

// 5. SECURITY EXPLAINER (Gemini API)
const SecurityExplainer = () => {
  const [term, setTerm] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExplain = async (e) => {
    e.preventDefault();
    if (!term) return;

    setLoading(true);
    setResult(null);

    const systemPrompt = "You are a friendly, expert cybersecurity educator. Your goal is to demystify complex terms. Provide a clear, accessible explanation of the user's term in a single paragraph, followed by a simple, real-world example to illustrate the concept. Your tone should be encouraging and easy to understand. Format the output with the term as a title, then the explanation, then the example.";
    const userQuery = `Explain the cybersecurity term: ${term}`;

    try {
      const { text } = await fetchGemini(systemPrompt, userQuery);
      setResult({ success: true, explanation: text });
    } catch (error) {
      setResult({ success: false, error: 'Gemini API Error: Failed to generate explanation.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold border-b pb-2 text-gray-900 dark:text-gray-100 dark:border-gray-700">❓ Security Explainer (AI Educator)</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Enter any complex cybersecurity term (e.g., "Phishing," "Zero Trust," "Lateral Movement") to get a simple explanation and a real-world example.
      </p>

      <form onSubmit={handleExplain} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Enter cybersecurity term..."
          className="flex-grow p-3 border border-gray-300 rounded-lg shadow-inner dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <button
          type="submit"
          disabled={loading || !term}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Explaining...' : 'Explain Term'}
        </button>
      </form>

      {result && (
        <div className={`p-4 rounded-lg border-l-4 ${result.success ? 'bg-gray-100 border-blue-500 dark:bg-gray-800 dark:border-blue-400' : 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/50 dark:border-red-400 dark:text-red-200'}`}>
          <p className="font-semibold dark:text-gray-100">Explanation:</p>
          <pre className="text-sm whitespace-pre-wrap font-sans mt-1 dark:text-gray-200">{result.explanation || result.error}</pre>
        </div>
      )}
    </div>
  );
};


// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeTab, setActiveTab] = useState('pwned');
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'pwned':
        return <PwnedCheckerWrapper />;
      case 'virus':
        return <VirusTotalChecker />;
      case 'analyzer':
        return <ThreatAnalyzer />;
      case 'metadata':
        return <EXIFExtractor />;
      case 'explainer':
        return <SecurityExplainer />;
      default:
        return <PwnedCheckerWrapper />;
    }
  };
  
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
        
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <h1 className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">InspectraSecure Toolkit</h1>
            
            <div className="flex items-center space-x-4">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Navigation Bar */}
          <nav className="bg-gray-100 dark:bg-gray-900 border-b dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex space-x-1 sm:space-x-4 overflow-x-auto whitespace-nowrap">
                {[
                  { id: 'pwned', name: 'Pwned Account Checker', icon: 'Lock' },
                  { id: 'virus', name: 'Virus Scanner', icon: 'Scan' },
                  { id: 'analyzer', name: '✨ Threat Analyzer', icon: 'AlertTriangle' },
                  { id: 'metadata', name: '📸 Metadata Extractor', icon: 'Image' },
                  { id: 'explainer', name: '❓ Security Explainer', icon: 'Question' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-3 py-3 text-sm font-medium transition-colors border-b-2 
                      ${activeTab === tab.id
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                      }`}
                  >
                    <Icon name={tab.icon} className="w-5 h-5 mr-2" />
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl">
            {renderContent()}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-200 dark:bg-gray-900 mt-12 border-t border-gray-300 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-600 dark:text-gray-400">
            
            {/* Column 1: Branding and Copyright */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400">InspectraSecure Toolkit</h3>
              <p className="text-xs">
                © {new Date().getFullYear()} InspectraSecure. All rights reserved.
              </p>
              <div className="flex space-x-4 mt-2">
                <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">Contact</a>
              </div>
            </div>

            {/* Column 2: Disclaimer */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-800 dark:text-gray-200">Disclaimer</h4>
              <p>
                This toolkit relies on external, third-party APIs (Have I Been Pwned, VirusTotal) and the Gemini API for analysis. While we strive for accuracy, results should be used for informational and educational purposes only.
              </p>
              <p className="text-xs italic">
                A functioning local Node.js server (on port 3001) is required for full functionality.
              </p>
            </div>

            {/* Column 3: User Feedback Box */}
            <FeedbackForm />

          </div>
        </footer>
        
      </div>
    </div>
  );
}

// Feedback Form Component (for Footer)
const FeedbackForm = () => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    if (!feedback) return;
    
    setLoading(true);
    // Simulate sending feedback to a backend/database
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFeedback(''); // Clear input after submission
      // In a real app, you would send this to a Firestore collection or API endpoint
      console.log('Feedback submitted:', feedback); 
      setTimeout(() => setSubmitted(false), 5000); // Clear thank you after 5s
    }, 1500);
  };

  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-gray-800 dark:text-gray-200">Give Feedback</h4>
      {submitted ? (
        <div className="p-3 bg-green-100 border border-green-400 text-green-800 rounded-lg dark:bg-green-900/50 dark:border-green-600 dark:text-green-200">
          Thank you! Your feedback helps us improve.
        </div>
      ) : (
        <form onSubmit={handleFeedbackSubmit} className="space-y-2">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="What can we improve or what features do you need?"
            rows="3"
            className="w-full p-2 border border-gray-300 rounded-lg shadow-inner text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading || !feedback}
            className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>
      )}
    </div>
  );
};
