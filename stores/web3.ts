import Web3 from 'web3'

import type { provider as Provider } from 'web3-core'
import type { HttpProviderOptions } from 'web3-core-helpers'

export const useWeb3Store = defineStore('web3', () => {
  const web3Instances = ref<Record<string, Web3>>({})

  // getters
  const getWeb3 = (providerName: string): Web3 | undefined => {
    return web3Instances.value[providerName]
  }

  // actions
  const addWeb3 = (
    providerName: string,
    provider: Provider,
    options?: HttpProviderOptions
  ) => {
    if (!provider) {
      return
    }

    let web3: Web3

    if (typeof provider === 'string') {
      const httpProvider = new Web3.providers.HttpProvider(provider, options)
      web3 = new Web3(httpProvider)
    } else {
      web3 = new Web3(provider)
    }

    web3Instances.value = {
      ...web3Instances.value,
      [providerName]: markRaw(web3) // web3 instances must be stored as raw objects to prevent reactivity issues
    }
  }

  return {
    web3Instances,
    getWeb3,
    addWeb3
  }
})
