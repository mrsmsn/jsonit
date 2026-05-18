import { gzip, ungzip } from 'pako'

/**
 * テキストを gzip 圧縮する
 */
export function deflate(text: string): Uint8Array {
  const bytes = new TextEncoder().encode(text)
  const compressed = gzip(bytes)
  return compressed
}

/**
 * gzip 圧縮されたデータを展開する
 */
export function inflate(compressed: Uint8Array): Uint8Array {
  return ungzip(compressed)
}
