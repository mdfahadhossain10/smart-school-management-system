// Edge-compatible JWT encoding and decoding using native Web Crypto API
export interface AuthSession {
  id: string;
  userId: string;
  email: string;
  name: string;
  role:
    | 'SUPER_ADMIN'
    | 'SCHOOL_ADMIN'
    | 'PRINCIPAL'
    | 'TEACHER'
    | 'STUDENT'
    | 'PARENT'
    | 'ACCOUNTANT'
    | 'LIBRARIAN';
  avatar?: string | null;
}

const SECRET = process.env.JWT_SECRET || 'smart_school_jwt_super_secret_key_production_grade_2026';

function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

async function getHmacKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    enc.encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function createSessionToken(payload: AuthSession): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // 7 days
  const tokenPayload = { ...payload, exp };
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload));
  const data = new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`);

  const key = await getHmacKey();
  const signature = await crypto.subtle.sign('HMAC', key, data);

  let binarySig = '';
  const sigBytes = new Uint8Array(signature);
  for (let i = 0; i < sigBytes.byteLength; i++) {
    binarySig += String.fromCharCode(sigBytes[i]);
  }
  const encodedSignature = btoa(binarySig).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

export async function verifySessionToken(token: string): Promise<AuthSession | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const data = new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`);

    // Decode signature
    let base64Sig = encodedSignature.replace(/-/g, '+').replace(/_/g, '/');
    while (base64Sig.length % 4) base64Sig += '=';
    const binarySig = atob(base64Sig);
    const sigBytes = new Uint8Array(binarySig.length);
    for (let i = 0; i < binarySig.length; i++) {
      sigBytes[i] = binarySig.charCodeAt(i);
    }

    const key = await getHmacKey();
    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, data);
    if (!isValid) return null;

    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return {
      id: payload.id || payload.userId,
      userId: payload.userId || payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      avatar: payload.avatar,
    };
  } catch {
    return null;
  }
}
