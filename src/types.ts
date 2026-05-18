export interface EditorOptions {
  syntaxHighlight: boolean
  autoFormat: boolean
  jsonc: boolean
}

export interface SharedState {
  content: string
  options: Partial<EditorOptions>
}

export type CommandType = 'toggle-highlight' | 'toggle-format' | 'share'

export interface EditorState {
  status: 'ok' | 'error'
  errorMessage?: string
}
