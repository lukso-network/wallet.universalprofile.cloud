import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import { describe, expect, test, vi } from 'vitest'
import { useDataProvider } from '../useDataProvider'

describe('useDataProvider', () => {
  test('should return isRpc as true when dataProvider is "rpc"', () => {
    // Arrange
    vi.spyOn(localStorage, 'getItem').mockReturnValue(null)
    vi.spyOn(
      useRuntimeConfig().public,
      'FETCH_DATA_PROVIDER',
      'get'
    ).mockReturnValue('rpc')

    // Act
    const result = useDataProvider()

    // Assert
    expect(result.isRpc).toBe(true)
    expect(result.isGraph).toBe(false)
  })

  test('should return isGraph as true when dataProvider is "graph"', () => {
    // Arrange
    vi.spyOn(localStorage, 'getItem').mockReturnValue(null)
    vi.spyOn(
      useRuntimeConfig().public,
      'FETCH_DATA_PROVIDER',
      'get'
    ).mockReturnValue('graph')

    // Act
    const result = useDataProvider()

    // Assert
    expect(result.isRpc).toBe(false)
    expect(result.isGraph).toBe(true)
  })

  test('should return isRpc as true when fetch-data-provider is "rpc" in local storage', () => {
    // Arrange
    vi.spyOn(localStorage, 'getItem').mockReturnValue('rpc')
    vi.spyOn(
      useRuntimeConfig().public,
      'FETCH_DATA_PROVIDER',
      'get'
    ).mockReturnValue('graph')

    // Act
    const result = useDataProvider()

    // Assert
    expect(result.isRpc).toBe(true)
    expect(result.isGraph).toBe(false)
  })

  test('should return isGraph as true when fetch-data-provider is "graph" in local storage', () => {
    // Arrange
    vi.spyOn(localStorage, 'getItem').mockReturnValue('graph')
    vi.spyOn(
      useRuntimeConfig().public,
      'FETCH_DATA_PROVIDER',
      'get'
    ).mockReturnValue('rpc')

    // Act
    const result = useDataProvider()

    // Assert
    expect(result.isRpc).toBe(false)
    expect(result.isGraph).toBe(true)
  })
})
