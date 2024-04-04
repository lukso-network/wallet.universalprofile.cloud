// chain id's
export const TESTNET_CHAIN_ID = '0x1069'
export const MAINNET_CHAIN_ID = '0x2a'
export const DEFAULT_NETWORK_CHAIN_ID = MAINNET_CHAIN_ID
export const SUPPORTED_NETWORK_IDS = ['mainnet', 'testnet'] as const

// name of default modal component name
export const MODAL_DEFAULT_TEMPLATE = 'Default'

// connection expiry time
export const CONNECTION_EXPIRY_TIME_MS = 1000 * 60 * 60 * 2 // 2 hours

// interval to check if the user is still connected
export const CONNECTION_EXPIRY_CHECK_INTERVAL_MS = 1000 * 10 // 10 seconds

// placeholder icon if asset icon is not available
export const ASSET_ICON_PLACEHOLDER_URL = '/images/token-default.svg'

// lyx token icon
export const ASSET_LYX_ICON_URL = '/images/lyx-token.svg'

// error image placeholder
export const IMAGE_ERROR_URL = '/images/image-error.svg'

// number of decimal places for LYX token
export const ASSET_LYX_DECIMALS = 18

// the raw proxy URL
export const LUKSO_PROXY_API = 'https://api.universalprofile.cloud'

// the hashed image cache name
export const HASHED_IMAGE_CACHE_NAME = 'hashed-images'
export const VERIFY_IMAGE_CACHE_NAME = 'verify-images'

// url of the ipfs gateway
export const IPFS_URL = `${LUKSO_PROXY_API}/ipfs/`

// Tanstack expirations. This is important because the sw.js has to cache longer than and no longer than the GC_TIME.
export const TANSTACK_GC_TIME = 1000 * 60 * 60 * 24 * 7
export const TANSTACK_DEFAULT_STALE_TIME = 1000 * 60 * 12

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
export const BASE_UP_CLOUD_URL = 'https://universalprofile.cloud'

// base universalprofile address
export const BASE_RELAYER_DAPP_URL = 'https://my.universalprofile.cloud'

// base wallet address
export const BASE_WALLET_URL = 'https://wallet.universalprofile.cloud'

export const BASE_PROFILE_LINK_URL = 'https://profile.link'

// default currency symbol
export const DEFAULT_CURRENCY_SYMBOL = 'USD'

// list of currencies to fetch from the api
export const CURRENCY_API_SYMBOLS = ['USD', 'EUR', 'GBP', 'PLN']

// token to compare
export const CURRENCY_API_LYX_TOKEN_NAME = 'LYX'

// currency cache expiry time in minutes
export const CURRENCY_CACHE_EXPIRY_IN_MINUTES = 60

// link to the testnet faucet
export const TESTNET_FAUCET_URL = 'https://faucet.testnet.lukso.network'

// transak api key, for staging tests you can use 'https://global-stg.transak.com'
export const TRANSAK_HOST = 'https://global.transak.com'
