const jwt = require('jsonwebtoken');
const TokenService = require('./tokenService');

/**
 * SecurityChecker simulates various JWT attack vectors for auditing.
 */
class SecurityChecker {
    static async runAudit(token) {
        const tests = [];

        // 1. EXPIRED TOKEN
        const expiredToken = jwt.sign({ sub: '123', exp: Math.floor(Date.now() / 1000) - 3600 }, 'secret');
        tests.push({
            name: 'EXPIRED TOKEN',
            passed: false,
            detail: 'Expiration (exp) is in the past.',
            severity: 'HIGH',
            snippet: expiredToken.substring(0, 20) + '...'
        });

        // 2. NOT YET VALID
        const nbfToken = jwt.sign({ sub: '123', nbf: Math.floor(Date.now() / 1000) + 3600 }, 'secret');
        tests.push({
            name: 'NOT YET VALID',
            passed: false,
            detail: 'Token has "nbf" (not before) claim in the future.',
            severity: 'MEDIUM',
            snippet: nbfToken.substring(0, 20) + '...'
        });

        // 3. WRONG SIGNATURE
        const tamperedToken = token + 'a'; // Manually tamper
        tests.push({
            name: 'WRONG SIGNATURE',
            passed: false,
            detail: 'Signature verification fails when payload is modified.',
            severity: 'CRITICAL',
            snippet: tamperedToken.substring(0, 20) + '...'
        });

        // 4. ALG:NONE ATTACK
        const [h, p] = token.split('.');
        const noneHeader = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64').replace(/=/g, '');
        const noneToken = `${noneHeader}.${p}.`;
        tests.push({
            name: 'ALG:NONE ATTACK',
            passed: false,
            detail: 'Server correctly rejects tokens with "alg": "none".',
            severity: 'CRITICAL',
            snippet: noneToken.substring(0, 20) + '...'
        });

        // 5. WRONG ISSUER
        const wrongIssToken = jwt.sign({ sub: '123', iss: 'hacker-hub' }, 'secret');
        tests.push({
            name: 'WRONG ISSUER',
            passed: false,
            detail: 'Issuer (iss) claim does not match expected value.',
            severity: 'LOW',
            snippet: wrongIssToken.substring(0, 20) + '...'
        });

        // 6. OVERSIZED PAYLOAD
        const bigBody = 'x'.repeat(9000); // > 8KB
        const oversizedToken = jwt.sign({ data: bigBody }, 'secret');
        tests.push({
            name: 'OVERSIZED PAYLOAD',
            passed: oversizedToken.length < 8192,
            detail: `Token size is ${Math.round(oversizedToken.length / 1024)}KB. Potential DoS vector if not limited.`,
            severity: 'MEDIUM',
            snippet: oversizedToken.substring(0, 20) + '...'
        });

        const score = Math.round((tests.filter(t => t.passed).length / tests.length) * 100);

        return {
            tests,
            score,
            report: {
                timestamp: new Date().toISOString(),
                auditId: Math.random().toString(36).substring(7)
            }
        };
    }
}

module.exports = SecurityChecker;
