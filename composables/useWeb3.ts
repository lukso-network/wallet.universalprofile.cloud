import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { ContractOptions } from 'web3-eth-contract'

export default function useWeb3(providerName: string) {
  const web3Store = useWeb3Store()

  const getWeb3 = () => {
    const web3 = web3Store.getWeb3(providerName)

    if (!web3) {
      return new Web3()
    }

    return web3
  }

  return {
    getWeb3,
    contract: (
      jsonInterface: AbiItem[],
      address?: string,
      options?: ContractOptions
    ) => {
      const web3 = getWeb3()
      return new web3.eth.Contract(jsonInterface, address, options)
    },
    requestAccounts: async (): Promise<Address[]> => {
      const addresses = await getWeb3().eth.requestAccounts()
      try {
        assertAddresses(addresses, 'profile')
        return addresses
      } catch {
        return []
      }
    },
    accounts: async () => {
      const [account] = await getWeb3().eth.getAccounts()
      try {
        assertAddress(account, 'profile')
        return account
      } catch {
        return
      }
    },
    isEoA: async (address: string) => {
      const result = await getWeb3().eth.getCode(address)

      return result === '0x'
    },
    getBalance: async (address: Address) => {
      return await getWeb3().eth.getBalance(address)
    },
  }
}