import { describe, expect, test } from 'vitest'

import { toChecksumAddress } from '../toChecksumAddress'

describe('toChecksumAddress', () => {
  test('converts a valid address', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678'
    const checksummedAddress = '0x1234567890AbcdEF1234567890aBcdef12345678'
    expect(toChecksumAddress(address)).toBe(checksummedAddress)
  })

  test('handles uppercase letters', () => {
    const address = '0X1234567890ABCDEF1234567890ABCDEF12345678'
    const checksummedAddress = '0x1234567890AbcdEF1234567890aBcdef12345678'
    expect(toChecksumAddress(address)).toBe(checksummedAddress)
  })

  test('handles lowercase letters', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678'
    const checksummedAddress = '0x1234567890AbcdEF1234567890aBcdef12345678'
    expect(toChecksumAddress(address)).toBe(checksummedAddress)
  })

  test('handles an empty string', () => {
    const address = ''
    const checksummedAddress = ''
    expect(toChecksumAddress(address)).toBe(checksummedAddress)
  })

  test('handles an invalid address', () => {
    const address = '0x1234567890abcdef1234567890abcdef1234567'
    const checksummedAddress = ''
    expect(toChecksumAddress(address)).toBe(checksummedAddress)
  })
})
