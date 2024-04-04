import type { CurrencyCache, CurrencyList } from '@/types/currency'

const fetchCurrencies = async () => {
  const cache = await caches.open(CACHE_KEY.CURRENCY_CACHE)
  const compareTokens = [CURRENCY_API_LYX_TOKEN_NAME] // we can add more tokens here if needed
  const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${compareTokens.join(
    ','
  )}&tsyms=${CURRENCY_API_SYMBOLS.join(',')}`
  const cacheData = await cache.match(url)

  if (cacheData) {
    const cacheDataJson: CurrencyCache = await cacheData.json()

    if (cacheDataJson.expires > Date.now()) {
      return cacheDataJson.currencies
    }
    caches.delete(url)
  }

  const currencies = await fetcher<CurrencyList, Record<string, never>>({
    url,
    method: 'GET'
  })
  const cacheObject = {
    currencies,
    expires: Date.now() + 1000 * 60 * CURRENCY_CACHE_EXPIRY_IN_MINUTES
  }
  await cache.put(url, new Response(JSON.stringify(cacheObject)))

  return currencies
}

export const useCurrency = () => {
  return {
    fetchCurrencies
  }
}
