const { AuthService } = require('../auth/authService');
const { hasPermission } = require('./matrix');
const { db } = require('../db');

/**
 * Middleware to verify JWT and attach user to request
 */
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    const token = authHeader.split(' ')[1];
    const user = AuthService.verifyToken(token);

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }

    req.user = user;
    next();
};

/**
 * Higher-order middleware to check if user has a specific permission
 */
const authorize = (permission) => {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ error: 'Auth context missing' });

        const allowed = hasPermission(req.user.role, permission);

        if (!allowed) {
            // Audit Log for Privilege Escalation Attempt
            db.prepare(`
                INSERT INTO audit_logs (user_id, username, action, resource, status, ip)
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(req.user.id, req.user.username, 'FORBIDDEN_ACCESS', permission, 403, req.ip);

            return res.status(403).json({ 
                error: 'Forbidden: Insufficient permissions',
                required: permission,
                role: req.user.role
            });
        }

        next();
    };
};

/**
 * Ownership check middleware
 */
const isOwner = (req, res, next) => {
    const contentId = req.params.id;
    const userId = req.user?.id;

    const content = db.prepare('SELECT owner_id FROM content WHERE id = ?').get(contentId);

    if (!content) return res.status(404).json({ error: 'Content not found' });

    if (content.owner_id !== userId && req.user?.role !== 'Admin') {
        return res.status(403).json({ error: 'Forbidden: You do not own this resource' });
    }

    next();
};

module.exports = { authenticate, authorize, isOwner };
