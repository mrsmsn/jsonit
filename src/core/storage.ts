import type { SharedState } from '../types'
import { deflate, inflate } from '../utils/compress'

/**
 * シェアードステートを URI フラグメントに圧縮してエンコードする
 * @param state - 保存するエディタの状態
 * @returns URL フラグメント（例: `#abc123...`）
 */
export function encodeToFragment(state: SharedState): string {
  const json = JSON.stringify(state)
  const compressed = deflate(json)
  // ブラウザ環境で Base64 エンコード
  let binary = ''
  for (let i = 0; i < compressed.byteLength; i++) {
    binary += String.fromCharCode(compressed[i])
  }
  const b64 = btoa(binary)
  // URL-safe に変換
  const urlSafe = b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return '#' + urlSafe
}

/**
 * URI フラグメントから状態をデコードする
 * @param hash - 処理するハッシュ文字列（`#` 付き）
 * @returns デコードされた SharedState、または null（デコード失敗時）
 */
export function decodeFromFragment(hash: string): SharedState | null {
  if (!hash.startsWith('#')) {
    return null
  }

  const urlSafe = hash.slice(1)
  // URL-safe Base64 を通常の Base64 に戻す
  const b64 = urlSafe.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - urlSafe.length % 4) % 4)

  try {
    const binary = atob(b64)
    const compressed = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      compressed[i] = binary.charCodeAt(i)
    }
    const decompressed = inflate(compressed)
    const json = new TextDecoder().decode(decompressed)
    const state: SharedState = JSON.parse(json)

    // バリデーション
    if (typeof state.content !== 'string') {
      return null
    }
    if (state.options && typeof state.options !== 'object') {
      return null
    }

    return state
  } catch {
    return null
  }
}

/**
 * URI フラグメントから直接デコードする（window.location.hash 用）
 */
export function decodeCurrentFragment(): SharedState {
  const hash = window.location.hash
  const state = decodeFromFragment(hash)
  return state || { content: '', options: {} }
}
