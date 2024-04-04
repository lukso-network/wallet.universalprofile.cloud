import { ERC725, type ERC725JSONSchema } from '@erc725/erc725.js'

const getInstance = (address: string, schema: ERC725JSONSchema[]) => {
  const config = {
    ipfsGateway: IPFS_URL
  }
  const { getWeb3 } = useWeb3(PROVIDERS.RPC)
  const erc725 = new ERC725(schema, address, getWeb3(), config)

  return erc725
}

const useErc725 = () => {
  return {
    getInstance
  }
}

export default useErc725
