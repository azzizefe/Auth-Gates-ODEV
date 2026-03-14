/**
 * TOTP / 2FA Lab - RFC 6238 & RFC 4226 Implementation
 * No external TOTP libraries used.
 */

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

/**
 * RFC 4648 Base32 Decoding
 * Converts a Base32 string to a Uint8Array
 */
export function base32Decode(base32: string): Uint8Array {
    base32 = base32.toUpperCase().replace(/=+$/, '');
    const bits = base32.split('').map(char => {
        const val = BASE32_ALPHABET.indexOf(char);
        if (val === -1) throw new Error('Invalid Base32 character');
        return val.toString(2).padStart(5, '0');
    }).join('');

    const bytes = [];
    for (let i = 0; i < bits.length; i += 8) {
        if (i + 8 <= bits.length) {
            bytes.push(parseInt(bits.substring(i, i + 8), 2));
        }
    }
    return new Uint8Array(bytes);
}

/**
 * RFC 4648 Base32 Encoding
 * Converts a Uint8Array to a Base32 string
 */
export function base32Encode(data: Uint8Array): string {
    let bits = '';
    for (let i = 0; i < data.length; i++) {
        bits += data[i].toString(2).padStart(8, '0');
    }

    let base32 = '';
    for (let i = 0; i < bits.length; i += 5) {
        const group = bits.substring(i, i + 5).padEnd(5, '0');
        base32 += BASE32_ALPHABET[parseInt(group, 2)];
    }
    return base32;
}

/**
 * Generate a random Base32 secret
 * RFC 4226 recommends at least 128-bit secret (16 bytes)
 */
export function generateSecret(length = 20): string {
    const randomBuffer = new Uint8Array(length);
    window.crypto.getRandomValues(randomBuffer);
    return base32Encode(randomBuffer);
}

/**
 * RFC 4226 HOTP Algorithm
 * HOTP(K, C) = Truncate(HMAC-SHA-1(K, C))
 */
export async function generateHOTP(secret: string, counter: number): Promise<string> {
    const key = base32Decode(secret);
    const counterBuffer = new ArrayBuffer(8);
    const counterView = new DataView(counterBuffer);
    
    // Counter is an 8-byte big-endian integer (RFC 4226 Section 5.1)
    // We handle it as two 32-bit integers because JavaScript bitwise ops are 32-bit
    const high = Math.floor(counter / 0x100000000);
    const low = counter % 0x100000000;
    counterView.setUint32(0, high);
    counterView.setUint32(4, low);

    // HMAC-SHA1 using Web Crypto API
    const cryptoKey = await window.crypto.subtle.importKey(
        'raw',
        key.buffer as ArrayBuffer,
        { name: 'HMAC', hash: 'SHA-1' },
        false,
        ['sign']
    );

    const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, counterBuffer);
    const hmac = new Uint8Array(signature);

    // Dynamic Truncation (RFC 4226 Section 5.4)
    const offset = hmac[hmac.length - 1] & 0xf;
    const binary =
        ((hmac[offset] & 0x7f) << 24) |
        ((hmac[offset + 1] & 0xff) << 16) |
        ((hmac[offset + 2] & 0xff) << 8) |
        (hmac[offset + 3] & 0xff);

    const otp = binary % 1000000; // 6 digits
    return otp.toString().padStart(6, '0');
}

/**
 * RFC 6238 TOTP Algorithm
 * TOTP = HOTP(K, T) where T = (Current Time - T0) / X
 * Default X = 30 seconds
 */
export async function generateTOTP(secret: string): Promise<string> {
    const epoch = Math.floor(Date.now() / 1000);
    const timeStep = Math.floor(epoch / 30);
    return generateHOTP(secret, timeStep);
}

/**
 * Verify TOTP with window tolerance (RFC 6238 Section 5.2)
 */
export async function verifyTOTP(secret: string, token: string, window = 1): Promise<{ valid: boolean, offset: number } | null> {
    const epoch = Math.floor(Date.now() / 1000);
    const timeStep = Math.floor(epoch / 30);

    for (let i = -window; i <= window; i++) {
        const generated = await generateHOTP(secret, timeStep + i);
        if (generated === token) {
            return { valid: true, offset: i };
        }
    }

    return null;
}
