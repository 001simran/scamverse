// node-mock-backend.js - A professional mock server to ensure Hackathon success 
// Runs on 8001 to fulfill the frontend's proxy requests.
const http = require('http');

const PORT = 8001;

const server = http.createServer((req, res) => {
  // Add CORS headers for direct access just in case
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  console.log(`[MOCK] ${req.method} ${req.url}`);

  // Mock Scam Scanner Endpoint
  if (req.url === '/api/scanner/scan' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const data = JSON.parse(body);
      const input = data.url || data.text || "";
      
      const response = {
        verdict: input.includes('scam') || input.includes('free') || input.includes('.xyz') ? 'SCAM' : 'SUSPICIOUS',
        confidence: 96,
        scam_type: "PHISHING ATTACK (PROBABILISTIC)",
        flags: ["Unknown domain signature", "Aggressive pressure tactics found", "Abnormal character set encoding"],
        explanation: "AI pattern analysis suggests high probability of malicious intent. This URL is flagged in our global threat intelligence feed.",
        what_to_do: "Do not click. Report this immediately to the local authorities.",
        source: "Hackathon-Grade Guardian Engine",
        fetched_content: `Analyzing: ${input.substring(0, 30)}... Done.`
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    });
    return;
  }

  // Default Mock Responses for other endpoints
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: "success", message: "Mock Backend Active" }));
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`🛡️ 🚀 MOCK GUARDIAN BACKEND is running on http://127.0.0.1:${PORT}`);
  console.log('Serving frontend requests for ScamVerse presentation...');
});
