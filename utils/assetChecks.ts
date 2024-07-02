import { LSP4_TOKEN_TYPES } from '@lukso/lsp-smart-contracts'

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

/**
 * Check if passed asset is LSP8 collection
 *
 * @param asset
 * @returns
 */
export const isCollection = (asset?: Asset | null) =>
  isLsp8(asset) && !!asset?.tokenIdsData?.length

/**
 * Check if passed asset has balance
 *
 * @param asset
 * @returns
 */
export const hasBalance = (asset?: Asset | Profile | null) =>
  !!asset?.balance && asset?.balance !== '0'

/**
 * Get asset balance
 *
 * @param asset
 * @returns
 */
export const getBalance = (asset?: Asset | Profile | null) =>
  asset?.balance || '0'

/**
 * Check if passed asset is supported
 * Currently supported assets are: LSP7, LSP8 and LYX (native)
 *
 * @param asset
 * @returns
 */
export const isSupportedAsset = (asset?: Asset | null) =>
  isLsp7(asset) || isLsp8(asset) || isLyx(asset)
