import { EditorView } from '@codemirror/view'
import { EditorState, Prec } from '@codemirror/state'
import { json } from '@codemirror/lang-json'
import { basicSetup } from 'codemirror'
import { decodeFromFragment, encodeToFragment } from './core/storage'
import type { SharedState } from './types'

// Default JSON shown when no shared state is present
// Contains multiple types (string, number, array, nested object) so users can immediately see the editor in action.
// TODO: localize dynamically based on user language preference
const defaultJson = `{
  "hello": "world",
  "users": [
    {
      "id": 1,
      "name": "Alice",
      "email": "alice@example.com"
    },
    {
      "id": 2,
      "name": "Bob",
      "email": "bob@example.com"
    }
  ],
  "settings": {
    "theme": "dark",
    "language": "ja"
  }
}`

// URIフラグメントから復元
const sharedState = decodeFromFragment(window.location.hash)
const initialContent = sharedState?.content || defaultJson

const root = document.getElementById('root')!

// ステータスバー
const statusEl = document.createElement('div')
statusEl.style.cssText = 'position: fixed; top: 8px; right: 12px; padding: 6px 14px; background: #323232; color: #fff; border-radius: 6px; z-index: 1000; font-size: 13px; pointer-events: none; opacity: 0; transition: opacity 0.3s;'
document.body.appendChild(statusEl)

let hideTimer: ReturnType<typeof setTimeout> | null = null
function showStatus(text: string): void {
  statusEl.textContent = text
  statusEl.style.opacity = '1'
  if (hideTimer) clearTimeout(hideTimer)
  hideTimer = setTimeout(() => { statusEl.style.opacity = '0' }, 2000)
}

// 共有ボタン
const shareBtn = document.createElement('button')
shareBtn.textContent = '🔗 Share'
shareBtn.style.cssText = 'position: fixed; top: 8px; right: 12px; padding: 8px 16px; background: #1976d2; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; z-index: 999; transition: background 0.2s;'
shareBtn.onmouseover = () => { shareBtn.style.background = '#1565c0' }
shareBtn.onmouseout = () => { shareBtn.style.background = '#1976d2' }
shareBtn.onclick = () => {
  const currentContent = view.state.doc.toString()
  const newState: SharedState = {
    content: currentContent,
    options: {},
  }
  const fragment = encodeToFragment(newState)
  if (!fragment) {
    showStatus('Share failed — duplicate keys found.')
    return
  }
  const shareUrl = window.location.origin + window.location.pathname + fragment.slice(1)

  navigator.clipboard.writeText(shareUrl)
    .then(() => showStatus('Copied to clipboard!'))
    .catch(() => showStatus('Copy failed — check URL!'))

  window.history.replaceState({}, '', fragment.slice(1))
}
document.body.appendChild(shareBtn)

const state = EditorState.create({
  doc: initialContent,
  extensions: [
    basicSetup,
    json(),
    EditorView.updateListener.of((v) => {
      if (v.docChanged) {
        try {
          const doc = v.state.doc.toString()
          if (doc.trim().length === 0) {
            root.style.borderTop = '3px solid #f44336'
          } else {
            const keys = doc.match(/"([^"]+)"\s*:/g) || []
            const keyNames = keys.map((k) => k.replace(/"/g, '').replace(/\s*:/, ''))
            const hasDuplicate = new Set(keyNames).size !== keyNames.length
            if (hasDuplicate) {
              root.style.borderTop = '3px solid #f44336'
            } else {
              JSON.parse(doc)
              root.style.borderTop = ''
              showStatus('✓ Valid JSON')
            }
          }
        } catch {
          root.style.borderTop = '3px solid #ff9800'
        }
      }
    }),
    // Ctrl+Shift+S でも共有
    Prec.highest(EditorView.domEventHandlers({
      keydown: (event, view) => {
        if (event.ctrlKey && event.shiftKey && event.key === 'S') {
          event.preventDefault()
          shareBtn.click()
          return true
        }
        return false
      }
    })),
  ],
})

const view = new EditorView({
  state,
  parent: root,
})
