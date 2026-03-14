import express, { Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { initDB, db } from './db';
import { AuthService } from './auth/authService';
import { authenticate, authorize, isOwner } from './rbac/middleware';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

initDB();

// --- AUTH ROUTES ---

app.post('/api/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = AuthService.generateToken({
        id: user.id,
        username: user.username,
        role: user.role
    });

    res.json({ token, role: user.role, username: user.username });
});

// --- PROTECTED ROUTES ---

app.get('/api/users', authenticate, authorize('users:read'), (req: Request, res: Response) => {
    const users = db.prepare('SELECT id, username, role FROM users').all();
    res.json(users);
});

app.post('/api/users', authenticate, authorize('users:write'), (req: Request, res: Response) => {
    res.json({ message: 'User created (mock)' });
});

app.delete('/api/users/:id', authenticate, authorize('users:delete'), (req: Request, res: Response) => {
    res.json({ message: 'User deleted (mock)' });
});

app.get('/api/content', authenticate, authorize('content:read'), (req: Request, res: Response) => {
    const items = db.prepare('SELECT * FROM content').all();
    res.json(items);
});

app.post('/api/content', authenticate, authorize('content:write'), (req: Request, res: Response) => {
    const { title, body } = req.body;
    const userId = (req as any).user?.id;
    db.prepare('INSERT INTO content (title, body, owner_id) VALUES (?, ?, ?)').run(title, body, userId);
    res.json({ message: 'Content created' });
});

app.put('/api/content/:id', authenticate, authorize('content:write'), isOwner, (req: Request, res: Response) => {
    res.json({ message: 'Content updated' });
});

app.delete('/api/content/:id', authenticate, authorize('content:delete'), isOwner, (req: Request, res: Response) => {
    res.json({ message: 'Content deleted' });
});

app.get('/api/reports', authenticate, authorize('reports:read'), (req: Request, res: Response) => {
    res.json({ stats: 'Real-time metrics (mock)' });
});

app.get('/api/reports/export', authenticate, authorize('reports:export'), (req: Request, res: Response) => {
    res.json({ message: 'Report exported as CSV' });
});

app.get('/api/settings', authenticate, authorize('settings:read'), (req: Request, res: Response) => {
    res.json({ config: 'System settings' });
});

app.post('/api/settings', authenticate, authorize('settings:write'), (req: Request, res: Response) => {
    res.json({ message: 'Settings updated' });
});

app.get('/api/audit', authenticate, (req: Request, res: Response) => {
    if ((req as any).user?.role !== 'Admin') return res.status(403).json({ error: 'Admin only' });
    const logs = db.prepare('SELECT * FROM audit_logs ORDER BY timestamp DESC').all();
    res.json(logs);
});

app.listen(PORT, () => {
    console.log(`🚀 RBAC Server running at http://localhost:${PORT}`);
    console.log(`🛡️ Admin: admin/admin123 | Editor: editor/edit123 | Viewer: viewer/view123`);
});

export {};
