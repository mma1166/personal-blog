/**
 * Hashes a password using SHA-256 via the browser's built-in Web Crypto API.
 * The raw password is NEVER stored — only the hex digest.
 */
export async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Compares a plain-text password attempt against a stored SHA-256 hash.
 */
export async function verifyPassword(attempt: string, storedHash: string): Promise<boolean> {
    const hash = await hashPassword(attempt);
    return hash === storedHash;
}

// Pre-computed SHA-256 of the default password 'admin123'
// Used as the default when no profile is stored yet.
export const DEFAULT_PASSWORD_HASH = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a';
