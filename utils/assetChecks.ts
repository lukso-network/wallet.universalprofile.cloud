import { LSP4_TOKEN_TYPES } from '@lukso/lsp4-contracts'

/**
 * Check if passed asset is LYX token
 * @param asset
 * @returns
 */
export const isLyx = (asset?: Asset | null) => !!asset?.isNativeToken

/**
 * Check if passed asset is collectible
 *
 * @param asset
 * @returns
 */
export const isCollectible = (asset?: Asset | null) =>
  asset?.tokenType === LSP4_TOKEN_TYPES.NFT ||
  asset?.tokenType === LSP4_TOKEN_TYPES.COLLECTION

/**
 * Check if passed asset is token
 *
 * @param asset
 * @returns
 */
export const isToken = (asset?: Asset | null) =>
  asset?.tokenType === LSP4_TOKEN_TYPES.TOKEN || isLyx(asset)

/**
 * Check if passed asset is LSP7 token
 *
 * @param asset
 * @returns
 */
export const isLsp7 = (asset?: Asset | null) =>
  asset?.standard === STANDARDS.LSP7

/**
 * Check if passed asset is LSP8 token
 *
 * @param asset
 * @returns
 */
export const isLsp8 = (asset?: Asset | null) =>
  asset?.standard === STANDARDS.LSP8

/**
 * Check if passed asset has a token id
 *
 * @param asset
 * @returns
 */
export const hasTokenId = (asset?: Asset | null) =>
  !!asset?.tokenId && asset?.tokenId !== '0x'

/**
 * Check if passed asset is LSP7 or LSP8
 *
 * @param asset
 * @returns
 */
export const isAsset = (asset?: Asset | null) =>
  asset?.standard === STANDARDS.LSP7 || asset?.standard === STANDARDS.LSP8
