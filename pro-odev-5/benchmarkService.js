const { db } = require('./db');
const NodeCache = require('node-cache');

const cache = new NodeCache();
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * BenchmarkService simulates realistic latency differences between DB and Cache.
 */
class BenchmarkService {
    /**
     * Pre-warms 50% of the cache
     */
    static preWarmCache() {
        const users = db.prepare('SELECT * FROM users LIMIT 50').all();
        users.forEach(user => {
            cache.set(`user_${user.id}`, user);
        });
        console.log('🔥 Cache pre-warmed with 50 users');
    }

    /**
     * Simulates a single lookup iteration
     */
    static async runIteration(userId) {
        const startDb = process.hrtime.bigint();
        
        // Artificial DB Latency: 15-25ms + random 80ms spikes
        let dbDelay = 15 + Math.random() * 10;
        if (Math.random() < 0.05) dbDelay = 80;
        
        await sleep(dbDelay);
        const dbUser = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
        const endDb = process.hrtime.bigint();
        const dbLatency = Number(endDb - startDb) / 1000000;

        const startCache = process.hrtime.bigint();
        // Artificial Cache Latency: 0.1-0.5ms
        const cacheDelay = 0.1 + Math.random() * 0.4;
        await sleep(cacheDelay);
        
        let cacheUser = cache.get(`user_${userId}`);
        if (!cacheUser && dbUser) {
            // Cache miss (5% chance simulated or real miss)
            cache.set(`user_${userId}`, dbUser);
            cacheUser = dbUser;
        }
        
        const endCache = process.hrtime.bigint();
        const cacheLatency = Number(endCache - startCache) / 1000000;

        return {
            db: dbLatency,
            cache: cacheLatency,
            miss: !cacheUser
        };
    }

    static getCacheStats() {
        return {
            keys: cache.keys().length,
            hits: cache.getStats().hits,
            misses: cache.getStats().misses
        };
    }
}

module.exports = BenchmarkService;
