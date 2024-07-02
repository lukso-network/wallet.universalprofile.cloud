const FETCH_DATA_PROVIDERS = ['rpc', 'graph']
type FetchDataProvider = (typeof FETCH_DATA_PROVIDERS)[number]

const getDataProvider = () => {
  const { getItem } = useLocalStorage()
  let fetchDataProvider: FetchDataProvider = 'graph'

  // check in environment
  const {
    public: { FETCH_DATA_PROVIDER: fetchDataProviderEnvironment = 'graph' },
  } = useRuntimeConfig()

  if (
    fetchDataProviderEnvironment &&
    FETCH_DATA_PROVIDERS.includes(fetchDataProviderEnvironment)
  ) {
    fetchDataProvider = fetchDataProviderEnvironment as FetchDataProvider
  }

  // check in local storage
  const fetchDataProviderLocalStorage = getItem('fetch-data-provider') as
    | FetchDataProvider
    | null
    | undefined

  if (
    fetchDataProviderLocalStorage &&
    FETCH_DATA_PROVIDERS.includes(fetchDataProviderLocalStorage)
  ) {
    fetchDataProvider = fetchDataProviderLocalStorage
  }

  return fetchDataProvider
}

export const useDataProvider = () => {
  const { isTestnet } = storeToRefs(useAppStore())
  const dataProvider = isTestnet.value ? 'rpc' : getDataProvider() // Testnet currently works only in RPC mode

  const isRpc = dataProvider === 'rpc'
  const isGraph = dataProvider === 'graph'

  return {
    isRpc,
    isGraph,
  }
}
