import { ASSET_TYPES } from '@/shared/enums'

/**
 * Check if passed asset is LYX token
 * @param asset
 * @returns
 */
export const isLyx = (asset?: Asset) => !!asset?.isNativeToken

/**
 * Check if passed asset is collectible
 *
 * @param asset
 * @returns
 */
export const isCollectible = (asset?: Asset) =>
  asset?.tokenType === 'NFT' || asset?.tokenType === 'COLLECTION'

/**
 * Check if passed asset is token
 *
 * @param asset
 * @returns
 */
export const isToken = (asset?: Asset) =>
  asset?.tokenType === 'TOKEN' || isLyx(asset)

/**
 * Check if passed asset is LSP7 token
 *
 * @param asset
 * @returns
 */
export const isLsp7 = (asset?: Asset) => asset?.standard === ASSET_TYPES.LSP7

/**
 * Check if passed asset is LSP8 token
 *
 * @param asset
 * @returns
 */
export const isLsp8 = (asset?: Asset) => asset?.standard === ASSET_TYPES.LSP8

/**
 * Check if passed asset has a token id
 *
 * @param asset
 * @returns
 */
export const hasTokenId = (asset?: Asset) =>
  !!asset?.tokenId?.length && asset?.tokenId !== '0x'
