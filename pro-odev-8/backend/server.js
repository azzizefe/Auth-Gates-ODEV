const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

// In-memory logs storage
let requestLogs = [];

// Middleware to capture all requests
app.use((req, res, next) => {
    // Skip internal log fetching and clearing from being logged themselves to avoid noise
    if (req.path === '/api/logs') return next();

    const logEntry = {
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.originalUrl,
        userAgent: req.headers['user-agent'],
        referer: req.headers['referer'] || 'None',
        ip: req.ip || req.connection.remoteAddress
    };

    requestLogs.push(logEntry);
    
    // Keep only last 50 logs
    if (requestLogs.length > 50) {
        requestLogs.shift();
    }
    
    next();
});

app.use(cors());
app.use(bodyParser.json());

// --- AUTH ENDPOINTS ---

app.post('/api/auth/login', (req, res) => {
    // Mock authentication - always returns a token
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTY3ODg4NjQwMH0.mock-signature-' + Math.random().toString(36).substr(2, 5);
    res.json({ token: mockToken, username: 'admin' });
});

// --- DASHBOARD ENDPOINT ---

app.get('/api/dashboard', (req, res) => {
    const token = req.query.token;
    if (!token) {
        return res.status(401).json({ error: 'Token missing in query params' });
    }
    res.json({ 
        message: 'Welcome to the Secure Dashboard',
        user: { id: 1, username: 'admin', role: 'admin' },
        tokenReceived: token
    });
});

// --- LOGGING ENDPOINTS ---

app.get('/api/logs', (req, res) => {
    res.json(requestLogs);
});

app.post('/api/logs/clear', (req, res) => {
    requestLogs = [];
    res.json({ message: 'Logs cleared' });
});

// --- REFERER / EXTERNAL ENDPOINTS ---

app.get('/api/referer', (req, res) => {
    res.json({ referer: req.headers['referer'] || 'None' });
});

app.get('/api/external', (req, res) => {
    // This simulates an external page receiving a hit from the dashboard
    res.send(`
        <html>
            <body style="background: #111; color: #eee; font-family: sans-serif; padding: 20px;">
                <h1>Simulated External Site</h1>
                <p>This page just received a visit from: <br/> 
                   <code style="background: #222; padding: 5px; color: #f87171;">${req.headers['referer'] || 'None'}</code>
                </p>
                <p style="color: #fb923c;">Note how the token leaked in the Referer header above!</p>
                <button onclick="window.history.back()">Back to Demo</button>
            </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
    console.log(`📋 Logging middleware active`);
});
