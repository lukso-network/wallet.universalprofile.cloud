import { toChecksumAddress as toChecksumAddressWeb3 } from 'web3-utils'

/**
 * Wrap function into try catch block to not break app when it fails
 *
 * @param value
 * @returns
 */
export const toChecksumAddress = (value: string) => {
  try {
    return toChecksumAddressWeb3(value)
  } catch (error) {
    console.error(error)
    return ''
  }
}
