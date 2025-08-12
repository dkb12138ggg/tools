export function toBase64(bytes: Uint8Array): string {
  let binary = ''
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

export function fromBase64(b64: string): Uint8Array {
  const binary = atob(b64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

export function toBase64Url(b64: string, noPadding = false): string {
  let s = b64.replace(/\+/g, '-').replace(/\//g, '_')
  if (noPadding) s = s.replace(/=+$/g, '')
  return s
}

export function fromBase64Url(b64url: string): string {
  let s = b64url.replace(/-/g, '+').replace(/_/g, '/')
  const pad = s.length % 4
  if (pad) s = s + '='.repeat(4 - pad)
  return s
}

export function encodeTextBase64(text: string, urlSafe = false, noPadding = false): string {
  const bytes = new TextEncoder().encode(text)
  const b64 = toBase64(bytes)
  return urlSafe ? toBase64Url(b64, noPadding) : b64
}

export function decodeTextBase64(b64OrUrl: string): string {
  const std = /^[A-Za-z0-9+/]+={0,2}$/.test(b64OrUrl) ? b64OrUrl : fromBase64Url(b64OrUrl)
  const bytes = fromBase64(std)
  return new TextDecoder().decode(bytes)
}

