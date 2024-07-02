import { describe, expect, it } from 'vitest'
import {
  fromTokenUnitWithDecimals,
  toTokenUnitWithDecimals,
} from '../tokenConversionWithDecimals'

describe('fromTokenUnitWithDecimals', () => {
  it('should convert from wei with 18 decimals', () => {
    const value = '1000000000000000000'
    const expected = '1'
    const result = fromTokenUnitWithDecimals(value)
    expect(result).toEqual(expected)
  })

  it('should convert from wei with 0 decimals', () => {
    const value = '1'
    const expected = '1'
    const result = fromTokenUnitWithDecimals(value, 0)
    expect(result).toEqual(expected)
  })

  it('should convert from wei with 2 decimals', () => {
    const value = '100'
    const expected = '1'
    const result = fromTokenUnitWithDecimals(value, 2)
    expect(result).toEqual(expected)
  })

  it('should return 0 when no value is invalid', () => {
    expect(fromTokenUnitWithDecimals()).toEqual('0')
    // @ts-expect-error
    expect(fromTokenUnitWithDecimals(null)).toEqual('0')
    // @ts-expect-error
    expect(fromTokenUnitWithDecimals({})).toEqual('0')
  })
})

describe('toTokenUnitWithDecimals', () => {
  it('should convert to wei with 18 decimals', () => {
    const value = '1'
    const expected = '1000000000000000000'
    const result = toTokenUnitWithDecimals(value)
    expect(result).toEqual(expected)
  })

  it('should convert to wei with 0 decimals', () => {
    const value = '1'
    const expected = '1'
    const result = toTokenUnitWithDecimals(value, 0)
    expect(result).toEqual(expected)
  })

  it('should convert to wei with 2 decimals', () => {
    const value = '1'
    const expected = '100'
    const result = toTokenUnitWithDecimals(value, 2)
    expect(result).toEqual(expected)
  })
})
