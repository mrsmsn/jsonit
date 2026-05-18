import { describe, it, expect } from 'vitest'
import { encodeToFragment } from '../core/storage'

describe('encodeToFragment', () => {
  it('should return null when duplicate key exists', () => {
    const state = { content: '{"a":1,"a":2}', options: {} }
    const result = encodeToFragment(state)
    expect(result).toBe(null)
  })
})
