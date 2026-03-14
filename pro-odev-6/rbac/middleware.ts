import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../auth/authService';
import { hasPermission } from './matrix';
import { db } from '../db';

interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
        username: string;
        role: string;
    };
}

/**
 * Middleware to verify JWT and attach user to request
 */
export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
export const authorize = (permission: string) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) return res.status(401).json({ error: 'Auth context missing' });

        const allowed = hasPermission(req.user.role, permission);

        if (!allowed) {
            // Audit Log for Privilege Escalation Attempt
            db.prepare(`
                INSERT INTO audit_logs (user_id, username, action, resource, status, ip)
                VALUES (?, ?, ?, ?, ?, ?)
            `).run(req.user.id, req.user.username, 'FORBIDDEN_ACCESS', permission, 403, (req as any).ip || 'unknown');

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
export const isOwner = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const contentId = req.params.id;
    const userId = req.user?.id;

    const content = db.prepare('SELECT owner_id FROM content WHERE id = ?').get(contentId) as { owner_id: number } | undefined;

    if (!content) return res.status(404).json({ error: 'Content not found' });

    if (content.owner_id !== userId && req.user?.role !== 'Admin') {
        return res.status(403).json({ error: 'Forbidden: You do not own this resource' });
    }

    next();
};
