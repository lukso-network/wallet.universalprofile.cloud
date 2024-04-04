import { LSP8_TOKEN_ID_FORMAT } from '@lukso/lsp-smart-contracts'
import { sliceAddress } from '@lukso/web-components/tools'
import { hexToNumber, hexToUtf8 } from 'web3-utils'

/**
 * Parse token ID based on the format
 *
 * @param tokenId
 * @param tokenIdFormat
 * @returns
 */
export const parseTokenId = (
  tokenId?: string,
  tokenIdFormat?: TokenIdFormatValue
) => {
  if (!tokenId) {
    return ''
  }

  switch (tokenIdFormat) {
    case LSP8_TOKEN_ID_FORMAT.STRING:
      // decode hex value to string
      return encodeURI(hexToUtf8(tokenId))
    case LSP8_TOKEN_ID_FORMAT.NUMBER:
      // convert hex value to number
      return hexToNumber(tokenId).toString()
    case LSP8_TOKEN_ID_FORMAT.ADDRESS:
      // address needs to be lowercase
      return paddedToAddress(tokenId.toLowerCase())
    case LSP8_TOKEN_ID_FORMAT.UNIQUE_ID:
    case LSP8_TOKEN_ID_FORMAT.HASH:
      // remove 0x from uid/hash token ids
      // also hex value need to be lowercase
      return tokenId.slice(2).toLowerCase()
    default:
      return tokenId
  }
}

/**
 * Add prefix to parsed token id based on the format
 * Also shorten if max length is set
 *
 * @param tokenId
 * @param tokenIdFormat
 * @returns
 */
export const prefixedTokenId = (
  tokenId?: string,
  tokenIdFormat?: TokenIdFormatValue,
  maxLength?: number
) => {
  let parsedTokenId = parseTokenId(tokenId, tokenIdFormat)

  // no prefix for hex token ids
  if (!parsedTokenId?.startsWith('0x')) {
    parsedTokenId = `#${parsedTokenId}`
  }

  if (!maxLength || parsedTokenId.length <= maxLength) {
    return parsedTokenId
  }

  // for string and number we add ... at the end
  // for other (hex) types we add ... in the middle
  if (isStringFormat(tokenIdFormat) || isNumberFormat(tokenIdFormat)) {
    return `${parsedTokenId.substring(0, maxLength - 3)}...`
  }
  return sliceAddress(parsedTokenId, Math.ceil((maxLength - 5) / 2))
}

/**
 * Check if token id format is string
 *
 * @param tokenIdFormat
 * @returns
 */
export const isStringFormat = (tokenIdFormat?: TokenIdFormatValue) =>
  tokenIdFormat === LSP8_TOKEN_ID_FORMAT.STRING

/**
 * Check if token id format is number
 *
 * @param tokenIdFormat
 * @returns
 */
export const isNumberFormat = (tokenIdFormat?: TokenIdFormatValue) =>
  tokenIdFormat === LSP8_TOKEN_ID_FORMAT.NUMBER
