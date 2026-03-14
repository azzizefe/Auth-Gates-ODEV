export interface BypassScenario {
    id: string;
    title: string;
    severity: 'High' | 'Medium' | 'Low';
    description: string;
    mitigation: string;
}

export const securityScenarios: BypassScenario[] = [
    {
        id: 'phishing',
        title: 'Real-time Phishing (Evilginx)',
        severity: 'High',
        description: 'Attacker acts as a proxy between victim and real site, capturing the TOTP code and session cookie in real-time.',
        mitigation: 'Use FIDO2/WebAuthn (Passkeys) instead of TOTP, which are cryptographically bound to the domain.'
    },
    {
        id: 'simswap',
        title: 'SMS SIM Swap / SS7',
        severity: 'High',
        description: 'Attacker takes control of victim\'s phone number by tricking the carrier. SMS OTPs are intercepted.',
        mitigation: 'Prefer TOTP apps or hardware keys over SMS-based 2FA.'
    },
    {
        id: 'bruteforce',
        title: 'Brute Force Attack',
        severity: 'Low',
        description: 'An attacker tries all 1M possibilities (000000-999999) before the code expires.',
        mitigation: 'Implement rate limiting and account lockout after multiple failed 2FA attempts.'
    },
    {
        id: 'timesync',
        title: 'Time Sync (NTP) Attack',
        severity: 'Medium',
        description: 'Manipulating the system clock of the server or client to make old tokens appear valid.',
        mitigation: 'Use secure NTP servers and monitor for large time drifts.'
    },
    {
        id: 'malware',
        title: 'Token Theft via Malware',
        severity: 'High',
        description: 'Infostealers capture screenshots or read the secret seed from the device\'s storage.',
        mitigation: 'Use hardware-backed storage for seeds (TPM/Secure Enclave) and keep device OS updated.'
    },
    {
        id: 'social',
        title: 'Social Engineering',
        severity: 'Medium',
        description: 'Tricking a help desk agent into disabling 2FA or providing a recovery code.',
        mitigation: 'Strict identity verification protocols for recovery and multi-step approval for 2FA resets.'
    }
];
