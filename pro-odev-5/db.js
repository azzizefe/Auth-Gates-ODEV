const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(':memory:'); // Using in-memory for the lab

/**
 * Database setup and seeding
 */
function initDB() {
    db.exec(`
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            role TEXT,
            token_version INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    const insert = db.prepare('INSERT INTO users (username, role) VALUES (?, ?)');
    
    // Seed 100 fake users
    for (let i = 1; i <= 100; i++) {
        const role = i % 10 === 0 ? 'admin' : (i % 5 === 0 ? 'editor' : 'user');
        insert.run(`user_${i}`, role);
    }

    console.log('✅ SQLite DB initialized with 100 users');
}

module.exports = { db, initDB };
