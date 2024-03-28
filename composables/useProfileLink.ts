import { toChecksumAddress } from 'web3-utils'
import { isAddress } from 'web3-validator'

export async function resolveProfile(_address: string): Promise<{
  resolved: string
  link: string
  address: Address
  checksummed: Address
}> {
  try {
    const { resolved, link, address, checksummed } = (await fetcher({
      url: `https://m.profile.link/${_address}/resolve`,
      method: 'GET',
    })) as {
      resolved: string
      link: string
      address: Address
      checksummed: Address
    }
    return { address, checksummed, resolved, link }
  } catch {
    if (!isAddress(_address)) throw new Error('Invalid address')
    const checksummed = toChecksumAddress(_address) as Address
    return {
      address: _address as Address,
      checksummed: checksummed,
      resolved: _address as string,
      link: `https://m.profile.link/${checksummed}`,
    }
  }
}

export function useProfileLink(_address: Address) {
  return useAsyncData(() => resolveProfile(_address))
}
