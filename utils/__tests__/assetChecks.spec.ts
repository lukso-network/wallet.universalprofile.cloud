import { describe, expect, test } from 'vitest'

import { LSP4_TOKEN_TYPES } from '@lukso/lsp-smart-contracts'
import {
  hasTokenId,
  isCollectible,
  isLsp7,
  isLsp8,
  isLyx,
  isToken
} from '../assetChecks'

describe('isLyx', () => {
  test('should return true if the asset is a LYX', async () => {
    expect(
      isLyx({
        tokenSymbol: 'LYX',
        isNativeToken: true
      } as Asset)
    ).toBe(true)
  })

  test('should return false if the asset is not a LYX', async () => {
    expect(
      isLyx({
        tokenSymbol: 'Some asset'
      } as Asset)
    ).toBe(false)
    expect(isLyx({} as Asset)).toBe(false)
  })
})

describe('isCollectible', () => {
  test('should return true if the asset is collectible', async () => {
    expect(
      isCollectible({
        tokenType: LSP4_TOKEN_TYPES.NFT
      } as Asset)
    ).toBe(true)
    expect(
      isCollectible({
        tokenType: LSP4_TOKEN_TYPES.COLLECTION
      } as Asset)
    ).toBe(true)
  })

  test('should return false if the asset is not collectible', async () => {
    expect(
      isCollectible({
        tokenType: LSP4_TOKEN_TYPES.TOKEN
      } as Asset)
    ).toBe(false)
    expect(isCollectible({} as Asset)).toBe(false)
  })
})

describe('isToken', () => {
  test('should return true if the asset is token', async () => {
    expect(
      isToken({
        tokenType: LSP4_TOKEN_TYPES.TOKEN
      } as Asset)
    ).toBe(true)
    expect(
      isToken({
        isNativeToken: true
      } as Asset)
    ).toBe(true)
  })

  test('should return false if the asset is not token', async () => {
    expect(
      isToken({
        tokenType: LSP4_TOKEN_TYPES.NFT
      } as Asset)
    ).toBe(false)
    expect(
      isToken({
        tokenType: LSP4_TOKEN_TYPES.COLLECTION
      } as Asset)
    ).toBe(false)
    expect(isToken({} as Asset)).toBe(false)
  })
})

describe('isLsp7', () => {
  test('should return true if the asset is LSP7', async () => {
    expect(
      isLsp7({
        standard: STANDARDS.LSP7
      } as Asset)
    ).toBe(true)
  })

  test('should return false if the asset is not LSP7', async () => {
    expect(
      isLsp7({
        standard: STANDARDS.LSP8
      } as Asset)
    ).toBe(false)
    expect(
      isLsp7({
        standard: STANDARDS.EOA
      } as Asset)
    ).toBe(false)
    expect(isLsp7({} as Asset)).toBe(false)
  })
})

describe('isLsp8', () => {
  test('should return true if the asset is LSP8', async () => {
    expect(
      isLsp8({
        standard: STANDARDS.LSP8
      } as Asset)
    ).toBe(true)
  })

  test('should return false if the asset is not LSP8', async () => {
    expect(
      isLsp8({
        standard: STANDARDS.LSP7
      } as Asset)
    ).toBe(false)
    expect(
      isLsp8({
        standard: STANDARDS.EOA
      } as Asset)
    ).toBe(false)
    expect(isLsp8({} as Asset)).toBe(false)
  })
})

describe('hasTokenId', () => {
  test('should return true if the asset has token Id', async () => {
    expect(
      hasTokenId({
        tokenId: '0x123'
      } as unknown as Asset)
    ).toBe(true)
  })

  test('should return false if the asset has no token Id', async () => {
    expect(
      hasTokenId({
        tokenId: '0x'
      } as unknown as Asset)
    ).toBe(false)
    expect(
      hasTokenId({
        tokenId: ''
      } as unknown as Asset)
    ).toBe(false)
    expect(hasTokenId({} as Asset)).toBe(false)
  })
})

describe('isAsset', () => {
  test('should return true if the asset is LSP7 or LSP8', async () => {
    expect(
      isAsset({
        standard: STANDARDS.LSP7
      } as Asset)
    ).toBe(true)
    expect(
      isAsset({
        standard: STANDARDS.LSP8
      } as Asset)
    ).toBe(true)
  })

  test('should return false if the asset is other smart contract', async () => {
    expect(
      isAsset({
        standard: STANDARDS.EOA
      } as Asset)
    ).toBe(false)
    expect(
      isAsset({
        standard: STANDARDS.LSP3
      } as Asset)
    ).toBe(false)
    expect(hasTokenId({} as Asset)).toBe(false)
  })
})
