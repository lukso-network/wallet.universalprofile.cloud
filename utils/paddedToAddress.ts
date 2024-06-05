import { isAddress } from 'web3-validator'

/**
 * Remove padding from address
 *
 * @param address
 * @returns
 */
export const paddedToAddress = (address?: string) => {
  if (!address || address.length < 42) {
    return ''
  }

  let paddedAddress = ''

  // remove 0x
  if (address.startsWith('0x')) {
    paddedAddress = address.slice(2)
  }

  // remove padding
  while (paddedAddress.slice(0, 2) === '00' && !isAddress(paddedAddress)) {
    paddedAddress = paddedAddress.slice(2)
  }

  return `0x${paddedAddress}`
}
