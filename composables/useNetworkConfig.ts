import { toWei } from 'web3-utils'

export const useNetworkConfig = (): NetworkInfo[] => {
  return [
    {
      id: 'testnet',
      name: 'LUKSO Testnet',
      chainId: TESTNET_CHAIN_ID,
      rpcNodes: [
        {
          host: 'https://4201.rpc.thirdweb.com'
        }
      ],
      token: {
        symbol: 'LYXt',
        supply: toWei('42000000', 'ether'),
        name: 'LUKSO'
      },
      indexName: 'prod_testnet_universal_profiles',
      explorerUrl: 'https://explorer.execution.testnet.lukso.network',
      customLSP2ContractAddress: '0x1690c1A6f5dc385d20139222567476F0A185f77a'
    },
    {
      id: 'mainnet',
      name: 'LUKSO Mainnet',
      chainId: MAINNET_CHAIN_ID,
      rpcNodes: [
        {
          host: 'https://rpc1.mainnet.lukso.dev'
        },
        {
          host: 'https://42.rpc.thirdweb.com'
        }
      ],
      token: {
        symbol: 'LYX',
        supply: toWei('42000000', 'ether'),
        name: 'LUKSO'
      },
      indexName: 'prod_mainnet_universal_profiles',
      explorerUrl: 'https://explorer.execution.mainnet.lukso.network',
      customLSP2ContractAddress: '0x51c602b249a5bc0ff437fbed4607448d8bc66dad'
    }
  ]
}
