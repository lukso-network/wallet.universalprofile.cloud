import Web3 from 'web3'

/**
 * Select first working RPC node from the list
 *
 * @returns
 */
export const selectRpcNode = async () => {
  const { getNetworkByChainId } = useAppStore()
  const { selectedChainId } = storeToRefs(useAppStore())
  const rpcNodes = getNetworkByChainId(selectedChainId.value).rpcNodes

  for (const rpcNode of rpcNodes) {
    const { host } = rpcNode || {}

    try {
      const provider = new Web3.providers.HttpProvider(host) // TODO add headers support
      const web3 = new Web3(provider)
      const blockNumber = await web3.eth.getBlockNumber()
      if (genericLog.enabled) {
        genericLog(
          `Connected to RPC node: ${host}. Block number: ${blockNumber}`
        )
      }
      return rpcNode
    } catch (error) {
      console.error(`Couldn't connect to RPC node: ${host}. Error: ${error}`)
    }
  }
}
