import Web3, { type EIP1193Provider, type Web3APISpec } from 'web3'

export const useWeb3Store = defineStore('web3', () => {
  const web3Instances = ref<Record<string, Web3>>({})

  // getters
  const getWeb3 = (providerName: string): Web3 | undefined => {
    return web3Instances.value[providerName]
  }

  // actions
  const addWeb3 = (
    providerName: string,
    provider: EIP1193Provider<Web3APISpec>,
    _options?: any
  ) => {
    if (!provider) {
      return
    }

    let web3: Web3

    if (typeof provider === 'string') {
      const httpProvider = new Web3.providers.HttpProvider(provider) // TODO add options support
      web3 = new Web3(httpProvider)
    } else {
      web3 = new Web3(provider)
    }

    web3Instances.value = {
      ...web3Instances.value,
      [providerName]: markRaw(web3), // web3 instances must be stored as raw objects to prevent reactivity issues
    }
  }

  return {
    web3Instances,
    getWeb3,
    addWeb3,
  }
})
