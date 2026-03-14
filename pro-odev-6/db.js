const bcrypt = require('bcryptjs');

// In-Memory Data Store
const store = {
    users: [],
    audit_logs: [],
    content: []
};

/**
 * Initialize the in-memory data
 */
function initDB() {
    // Seed Users
    store.users = [
        { id: 1, username: 'admin', password: bcrypt.hashSync('admin123', 10), role: 'Admin' },
        { id: 2, username: 'editor', password: bcrypt.hashSync('edit123', 10), role: 'Editor' },
        { id: 3, username: 'viewer', password: bcrypt.hashSync('view123', 10), role: 'Viewer' },
        { id: 4, username: 'userA', password: bcrypt.hashSync('userA123', 10), role: 'Viewer' },
        { id: 5, username: 'userB', password: bcrypt.hashSync('userB123', 10), role: 'Viewer' }
    ];

    // Seed Content
    store.content = [
        { id: 1, title: 'Admin Insight', body: 'Secret admin data', owner_id: 1 },
        { id: 2, title: 'User A Blog', body: 'Hello from User A', owner_id: 4 },
        { id: 3, title: 'User B Journal', body: 'Private thoughts of B', owner_id: 5 }
    ];

    console.log('✅ In-Memory Data Store initialized');
}

// Simple Query Interface
const db = {
    prepare: (query) => {
        return {
            get: (...args) => {
                if (query.includes('SELECT * FROM users WHERE username = ?')) {
                    return store.users.find(u => u.username === args[0]);
                }
                if (query.includes('SELECT owner_id FROM content WHERE id = ?')) {
                    return store.content.find(c => c.id == args[0]);
                }
                return null;
            },
            run: (...args) => {
                if (query.includes('INSERT INTO audit_logs')) {
                    const [user_id, username, action, resource, status, ip] = args;
                    store.audit_logs.push({ 
                        id: store.audit_logs.length + 1, 
                        user_id, username, action, resource, status, ip, 
                        timestamp: new Date().toISOString() 
                    });
                }
                if (query.includes('INSERT INTO content')) {
                    const [title, body, owner_id] = args;
                    store.content.push({ id: store.content.length + 1, title, body, owner_id });
                }
                return { lastInsertRowid: store.audit_logs.length };
            },
            all: () => {
                if (query.includes('FROM users')) return store.users.map(u => ({ id: u.id, username: u.username, role: u.role }));
                if (query.includes('FROM content')) return store.content;
                if (query.includes('FROM audit_logs')) return [...store.audit_logs].reverse();
                return [];
            }
        };
    }
};

module.exports = { db, initDB };
