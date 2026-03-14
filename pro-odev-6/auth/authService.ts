import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET || 'rbac-secret-key-999';

export class AuthService {
    static generateToken(payload: { id: number; username: string; role: string }): string {
        return jwt.sign(payload, SECRET, { expiresIn: '1h' });
    }

    static verifyToken(token: string): { id: number; username: string; role: string } | null {
        try {
            return jwt.verify(token, SECRET) as any;
        } catch (err) {
            return null;
        }
    }
}
