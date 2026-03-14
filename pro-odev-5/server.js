const express = require('express');
const cors = require('cors');
const path = require('path');
const TokenService = require('./tokenService');
const BenchmarkService = require('./benchmarkService');
const SecurityChecker = require('./securityChecker');
const { initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Services
initDB();
BenchmarkService.preWarmCache();

/**
 * TOKEN FORGE
 */
app.post('/api/token/create', (req, res) => {
    const { sub, role, expiresIn, algorithm, customClaims = {} } = req.body;
    const payload = { sub, role, ...customClaims };
    const result = TokenService.createToken(payload, { algorithm, expiresIn });
    res.json(result);
});

/**
 * LIVE DECODER
 */
app.post('/api/token/decode', (req, res) => {
    const { token } = req.body;
    const result = TokenService.decodeToken(token);
    res.json(result);
});

/**
 * BATTLE BENCH (SSE Stream)
 */
app.get('/api/benchmark/run', async (req, res) => {
    const { userId = 1, iterations = 100 } = req.query;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const results = { db: [], cache: [] };

    for (let i = 0; i < iterations; i++) {
        const result = await BenchmarkService.runIteration(userId);
        results.db.push(result.db);
        results.cache.push(result.cache);

        res.write(`data: ${JSON.stringify({ iteration: i + 1, ...result })}\n\n`);
    }

    const calc = (arr) => {
        const sorted = [...arr].sort((a, b) => a - b);
        const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
        return {
            avg: avg.toFixed(3),
            min: sorted[0].toFixed(3),
            max: sorted[sorted.length - 1].toFixed(3),
            p95: sorted[Math.floor(sorted.length * 0.95)].toFixed(3),
            p99: sorted[Math.floor(sorted.length * 0.99)].toFixed(3)
        };
    };

    const dbStats = calc(results.db);
    const cacheStats = calc(results.cache);
    const speedup = (dbStats.avg / cacheStats.avg).toFixed(1);

    res.write(`data: ${JSON.stringify({ 
        done: true, 
        db: dbStats, 
        cache: cacheStats, 
        speedup 
    })}\n\n`);
    res.end();
});

/**
 * SECURITY AUDIT
 */
app.post('/api/security/audit', async (req, res) => {
    const { token } = req.body;
    const result = await SecurityChecker.runAudit(token);
    res.json(result);
});

/**
 * HEALTH CHECK
 */
app.get('/api/health', (req, res) => {
    const stats = BenchmarkService.getCacheStats();
    res.json({
        status: 'online',
        timestamp: new Date().toISOString(),
        tokenCount: stats.keys,
        cacheHitRate: stats.hits > 0 ? ((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(1) + '%' : '0%'
    });
});

app.listen(PORT, () => {
    console.log(`\n\n🔐 JWT Lab running → http://localhost:${PORT}\n\n`);
});
