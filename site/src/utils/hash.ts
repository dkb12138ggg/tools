import CryptoJS from 'crypto-js'

export type HashAlgo = 'MD5' | 'SHA1' | 'SHA256'

export function hashText(text: string, algo: HashAlgo): string {
  const wa = CryptoJS.enc.Utf8.parse(text)
  switch (algo) {
    case 'MD5':
      return CryptoJS.MD5(wa).toString()
    case 'SHA1':
      return CryptoJS.SHA1(wa).toString()
    case 'SHA256':
      return CryptoJS.SHA256(wa).toString()
  }
}

export async function hashFile(
  file: File,
  algo: HashAlgo,
  onProgress?: (progress: number) => void
): Promise<string> {
  const chunkSize = 4 * 1024 * 1024 // 4MB
  const total = file.size

  let hasher: CryptoJS.lib.Hasher
  switch (algo) {
    case 'MD5':
      hasher = CryptoJS.algo.MD5.create()
      break
    case 'SHA1':
      hasher = CryptoJS.algo.SHA1.create()
      break
    case 'SHA256':
      hasher = CryptoJS.algo.SHA256.create()
      break
  }

  let offset = 0
  while (offset < total) {
    const slice = file.slice(offset, Math.min(offset + chunkSize, total))
    const buf = await slice.arrayBuffer()
    const words = CryptoJS.lib.WordArray.create(buf as any)
    hasher.update(words)
    offset += chunkSize
    onProgress?.(Math.min(100, Math.round((offset / total) * 100)))
    await new Promise((r) => setTimeout(r)) // allow UI to update
  }
  return hasher.finalize().toString()
}

