import { describe, expect, it } from 'vitest'
import { truncate } from '../truncate'

describe('truncate', () => {
  it('should truncate a string to the specified length', () => {
    expect(truncate('Hello world', 10)).toBe('Hello wor...')
  })

  it('should not truncate a string that is shorter than the specified length', () => {
    expect(truncate('Hello', 10)).toBe('Hello')
  })

  it('should return an empty string if the specified length is less than or equal to 0', () => {
    expect(truncate('Hello world', 0)).toBe('')
    expect(truncate('Hello world', -1)).toBe('')
  })

  it('should return original string if no length provided', () => {
    expect(truncate('Hello world')).toBe('Hello world')
  })
})
