const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET || 'super-secret-key-123';

/**
 * TokenService handles all JWT related operations: creation, decoding, and verification.
 */
class TokenService {
    /**
     * Signs a new JWT token
     */
    static createToken(payload, options = {}) {
        const { algorithm = 'HS256', expiresIn = '1h' } = options;
        
        // expiresIn can be '60s', '1h', '24h' or undefined for 'never'
        const signOptions = { algorithm };
        if (expiresIn !== 'never') {
            signOptions.expiresIn = expiresIn;
        }

        const token = jwt.sign(payload, SECRET, signOptions);
        
        // Split token for metadata
        const [headerB64, payloadB64, signatureB64] = token.split('.');
        
        return {
            token,
            header: JSON.parse(Buffer.from(headerB64, 'base64').toString()),
            payload: JSON.parse(Buffer.from(payloadB64, 'base64').toString()),
            metadata: {
                size: Buffer.byteLength(token),
                algorithm
            }
        };
    }

    /**
     * Decodes a token without verification (real-time decoder)
     */
    static decodeToken(token) {
        try {
            const decoded = jwt.decode(token, { complete: true });
            if (!decoded) throw new Error('Invalid format');

            const payload = decoded.payload;
            const timeLeft = payload.exp ? Math.max(0, payload.exp - Math.floor(Date.now() / 1000)) : null;

            return {
                header: decoded.header,
                payload: payload,
                isValid: true, // This is just the "parsable" check
                isExpired: timeLeft === 0,
                timeLeft: timeLeft,
                error: null
            };
        } catch (err) {
            return { error: err.message, isValid: false };
        }
    }

    /**
     * Verifies a token's integrity and expiration
     */
    static verifyToken(token, options = {}) {
        try {
            const decoded = jwt.verify(token, SECRET, options);
            return { valid: true, decoded };
        } catch (err) {
            return { valid: false, error: err.message };
        }
    }
}

module.exports = TokenService;
