import { expect, test } from '@playwright/test'
import {
  assertAddress,
  assertAddresses,
  assertString,
} from '../../../utils/validators'

test.describe('assertAddress', () => {
  test('throw when address is invalid', async ({ page }) => {
    try {
      assertAddress('0x0', 'profile')
    } catch (error) {
      expect((error as unknown as Error).message).toBe(
        `0x0 is not an profile address`
      )
    }
  })

  test('throw when address is missing', async ({ page }) => {
    try {
      assertAddress()
    } catch (error) {
      expect((error as unknown as Error).message).toBe(`missing  address`)
    }
  })

  test('pass when address is valid', async ({ page }) => {
    expect(
      assertAddress('0x4440a406E00ECfe15a833119D20B848a31c80116')
    ).toBeUndefined()
  })
})

test.describe('assertAddresses', () => {
  test('throw when address is invalid', async ({ page }) => {
    try {
      assertAddresses(
        ['0x4440a406E00ECfe15a833119D20B848a31c80116', '0x0'],
        'profile'
      )
    } catch (error) {
      expect((error as unknown as Error).message).toBe(
        `0x0 is not an profile address`
      )
    }
  })

  test('throw when address is missing', async ({ page }) => {
    try {
      assertAddresses()
    } catch (error) {
      expect((error as unknown as Error).message).toBe(`missing addresses`)
    }
  })

  test('pass when array of addresses is valid', async ({ page }) => {
    expect(
      assertAddresses([
        '0x4440a406E00ECfe15a833119D20B848a31c80116',
        '0x463306b7D641FDff5D3E30947aC96074b705d4E8',
      ])
    ).toBeUndefined()
  })
})

test.describe('assertString', () => {
  test('throw when value is a number', async ({ page }) => {
    try {
      assertString(123)
    } catch (error) {
      expect((error as unknown as Error).message).toBe(`123 is not a string`)
    }
  })

  test('throw when value is an array', async ({ page }) => {
    try {
      assertString([123, 'asdf'])
    } catch (error) {
      expect((error as unknown as Error).message).toBe(
        `123,asdf is not a string`
      )
    }
  })

  test('pass when value is a string', async ({ page }) => {
    expect(assertString('asdf')).toBeUndefined()
  })
})
