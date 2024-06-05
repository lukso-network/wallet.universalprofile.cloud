import Web3, {
  Contract,
  type ContractAbi,
  type ContractInitOptions,
  type Transaction,
} from 'web3'

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
    contract: <T extends ContractAbi>(
      jsonInterface: T,
      address?: string,
      options?: ContractInitOptions
    ) => {
      const contract = new Contract<T>(jsonInterface, address, options)
      contract.setProvider(getWeb3().currentProvider)

      return contract
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
    sendTransaction: async (transaction: Transaction) => {
      return await getWeb3()
        .eth.sendTransaction(transaction)
        .on('receipt', (receipt: any) => {
          console.log(receipt)
        })
        .once('sending', payload => {
          console.log(JSON.stringify(payload, null, 2))
        })
    },
    getChainId: async () => {
      return await getWeb3().eth.getChainId()
    },
    getProvider: () => {
      return getWeb3().currentProvider
    },
  }
}
