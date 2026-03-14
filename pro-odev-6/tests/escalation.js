const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000/api';

const auditResults = [];

async function runTests() {
    console.log('\n🚀 Starting RBAC Escalation Security Audit\n');
    console.log('══════════════════════════════════════════════════');

    try {
        const adminToken = await login('admin', 'admin123');
        const viewerToken = await login('viewer', 'view123');
        const userAToken = await login('userA', 'userA123');
        const userBToken = await login('userB', 'userB123');

        console.log('\n[SCENARIO 1] Vertical Escalation Test');
        await testEndpoint('Viewer accessing Admin User List', viewerToken, 'GET', '/users', 403, 'VERTICAL');
        await testEndpoint('Viewer accessing Settings', viewerToken, 'POST', '/settings', 403, 'VERTICAL');

        console.log('\n[SCENARIO 2] Horizontal Escalation Test');
        await testEndpoint('UserA accessing UserB Content (Put)', userAToken, 'PUT', '/content/3', 403, 'HORIZONTAL');
        await testEndpoint('UserA deleting UserB Content', userAToken, 'DELETE', '/content/3', 403, 'HORIZONTAL');

        console.log('\n[SCENARIO 3] Token Manipulation Test');
        const tamperedToken = viewerToken + 'x';
        await testEndpoint('Tampered Signature Access', tamperedToken, 'GET', '/content', 401, 'TAMPERING');

        console.log('\n[SCENARIO 4] Admin Full Access Test');
        await testEndpoint('Admin accessing everything', adminToken, 'GET', '/users', 200, 'ADMIN_BYPASS');
        await testEndpoint('Admin overriding ownership', adminToken, 'PUT', '/content/3', 200, 'ADMIN_BYPASS');

        const reportPath = path.join(__dirname, 'escalation_report.json');
        fs.writeFileSync(reportPath, JSON.stringify({
            timestamp: new Date().toISOString(),
            totalTests: auditResults.length,
            results: auditResults
        }, null, 2));

        console.log('\n══════════════════════════════════════════════════');
        console.log(`🎉 AUDIT COMPLETE. Report saved to: ${reportPath}`);
        console.log('══════════════════════════════════════════════════\n');

    } catch (err) {
        console.error('❌ Audit interrupted:', err.message);
        console.log('Make sure the server is running on http://localhost:3000');
    }
}

async function login(username, pass) {
    const res = await axios.post(`${BASE_URL}/auth/login`, { username, password: pass });
    return res.data.token;
}

async function testEndpoint(label, token, method, path, expectedStatus, scenario) {
    process.stdout.write(`- ${label.padEnd(40)}... `);
    const start = Date.now();
    try {
        const res = await axios({
            method,
            url: `${BASE_URL}${path}`,
            headers: { Authorization: `Bearer ${token}` },
            validateStatus: () => true
        });

        const passed = res.status === expectedStatus;
        const result = {
            scenario,
            test: label,
            method,
            path,
            expectedStatus,
            actualStatus: res.status,
            passed,
            responseTime: Date.now() - start
        };
        auditResults.push(result);

        if (passed) {
            console.log(`[PASS] (${res.status})`);
        } else {
            console.log(`[FAIL] (Expected ${expectedStatus}, got ${res.status})`);
        }
    } catch (err) {
        console.log(`[ERROR]`);
    }
}

if (require.main === module) {
    runTests();
}
