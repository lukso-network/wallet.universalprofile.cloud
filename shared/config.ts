import { toWei } from 'web3-utils'

import { NetworkInfo } from '@/types/network'

// chain id's
export const TESTNET_CHAIN_ID = '0x1069'
export const MAINNET_CHAIN_ID = '0x2a'
export const DEFAULT_NETWORK_CHAIN_ID = MAINNET_CHAIN_ID

// list of supported networks
export const NETWORKS: NetworkInfo[] = [
  {
    name: 'LUKSO Testnet',
    chainId: TESTNET_CHAIN_ID,
    rpcHttp: 'https://rpc.testnet.lukso.network',
    token: {
      symbol: 'LYXt',
      supply: toWei('42000000', 'ether'),
      name: 'LUKSO',
    },
    indexName: 'prod_testnet_universal_profiles',
  },
  {
    name: 'LUKSO Mainnet',
    chainId: MAINNET_CHAIN_ID,
    rpcHttp: 'https://rpc.mainnet.lukso.network',
    token: {
      symbol: 'LYX',
      supply: toWei('42000000', 'ether'),
      name: 'LUKSO',
    },
    indexName: 'prod_mainnet_universal_profiles',
  },
]

// name of default modal component name
export const MODAL_DEFAULT_TEMPLATE = 'Default'

// global provider object injected by browser extension
export const INJECTED_PROVIDER = window?.lukso

// connection expiry time
export const CONNECTION_EXPIRY_TIME_MS = 1000 * 60 * 60 * 2 // 2 hours

// interval to check if the user is still connected
export const CONNECTION_EXPIRY_CHECK_INTERVAL_MS = 1000 * 10 // 10 seconds

// placeholder icon if asset icon is not available
export const ASSET_ICON_PLACEHOLDER_URL = '/images/token-default.svg'

// lyx token icon
export const ASSET_LYX_ICON_URL = '/images/lyx-token.svg'

// number of decimal places for LYX token
export const ASSET_LYX_DECIMALS = 18

// url of the ipfs gateway
export const IPFS_URL = 'https://api.universalprofile.cloud/ipfs/'

// extension store links
export const EXTENSION_STORE_LINKS = {
  chrome:
    'https://chrome.google.com/webstore/detail/universal-profiles-testin/abpickdkkbnbcoepogfhkhennhfhehfn',
  brave:
    'https://chrome.google.com/webstore/detail/universal-profiles-testin/abpickdkkbnbcoepogfhkhennhfhehfn',
  edge: '',
  opera: '',
  safari: '',
  firefox: '',
}

// search params
export const SEARCH_RESULTS_LIMIT = 100

// base universalprofile address
export const BASE_UP_CLOUD_URL = 'https://universalprofile.cloud/'

// default currency symbol
export const DEFAULT_CURRENCY_SYMBOL = 'USD'

// list of currencies to fetch from the api
export const CURRENCY_API_SYMBOLS = ['USD', 'EUR', 'GBP', 'PLN']

// atm cryptocompare only supports LYXE token, swap to LYX when got avail
export const CURRENCY_API_LYX_TOKEN_NAME = 'LYXE'

// currency cache expiry time in minutes
export const CURRENCY_CACHE_EXPIRY_IN_MINUTES = 60
