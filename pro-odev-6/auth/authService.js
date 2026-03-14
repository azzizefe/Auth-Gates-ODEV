const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET || 'rbac-secret-key-999';

class AuthService {
    static generateToken(payload) {
        return jwt.sign(payload, SECRET, { expiresIn: '1h' });
    }

    static verifyToken(token) {
        try {
            return jwt.verify(token, SECRET);
        } catch (err) {
            return null;
        }
    }
}

module.exports = { AuthService };
