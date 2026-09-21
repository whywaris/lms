/**
 * Web Crypto HMAC-SHA256 Unsubscribe Token Generator and Verifier
 * Edge / Cloudflare compatible — uses crypto.subtle and standard Web APIs.
 */

function getSecretKey(): string {
  const secret = process.env.UNSUBSCRIBE_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.warn('[email/unsubscribe] UNSUBSCRIBE_SECRET is not set; falling back to temporary default.')
    }
    return 'pandacourses-unsubscribe-fallback-secret-2026'
  }
  return secret
}

// Convert ArrayBuffer to URL-safe Base64 string
function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

// Convert URL-safe Base64 string to Uint8Array
function base64UrlToUint8Array(base64Url: string): Uint8Array {
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4 !== 0) {
    base64 += '='
  }
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

// String to URL-safe Base64
function stringToBase64Url(str: string): string {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(str)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

// URL-safe Base64 to string
function base64UrlToString(base64Url: string): string {
  const bytes = base64UrlToUint8Array(base64Url)
  const decoder = new TextDecoder()
  return decoder.decode(bytes)
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

/**
 * Creates an unsubscribe token for a given user ID.
 * Token format: base64url(userId).base64url(signature)
 */
export async function createUnsubscribeToken(userId: string): Promise<string> {
  const secret = getSecretKey()
  const key = await getHmacKey(secret)
  const encoder = new TextEncoder()
  const data = encoder.encode(userId)

  const signature = await crypto.subtle.sign('HMAC', key, data)

  const encodedUserId = stringToBase64Url(userId)
  const encodedSignature = bufferToBase64Url(signature)

  return `${encodedUserId}.${encodedSignature}`
}

/**
 * Verifies an unsubscribe token and returns whether it is valid and the user ID.
 */
export async function verifyUnsubscribeToken(token: string): Promise<{ valid: boolean; userId?: string }> {
  if (!token || typeof token !== 'string') {
    return { valid: false }
  }

  const parts = token.split('.')
  if (parts.length !== 2) {
    return { valid: false }
  }

  const [encodedUserId, encodedSignature] = parts

  try {
    const userId = base64UrlToString(encodedUserId)
    if (!userId) return { valid: false }

    const signatureBytes = base64UrlToUint8Array(encodedSignature)
    const secret = getSecretKey()
    const key = await getHmacKey(secret)
    const encoder = new TextEncoder()
    const data = encoder.encode(userId)

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as unknown as BufferSource,
      data
    )

    if (isValid) {
      return { valid: true, userId }
    }
    return { valid: false }
  } catch (err) {
    console.error('[email/unsubscribe] Verification failed:', err)
    return { valid: false }
  }
}

/**
 * Returns the full unsubscribe URL for a given user ID.
 */
export async function unsubscribeUrl(userId: string): Promise<string> {
  const token = await createUnsubscribeToken(userId)
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://pandacourses.com').replace(/\/+$/, '')
  return `${siteUrl}/unsubscribe?token=${encodeURIComponent(token)}`
}
