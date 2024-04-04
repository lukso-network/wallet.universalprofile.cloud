import type { CurrencyList, CurrencySymbol } from '@/types/currency'

/**
 * Currency store
 * Keeps the information about currency settings
 * Data is stored in local storage
 *
 */
export const useCurrencyStore = defineStore(
  'currency',
  () => {
    const currencyList = ref<CurrencyList>()
    const currentCurrencySymbol = ref<CurrencySymbol>(DEFAULT_CURRENCY_SYMBOL)

    const getCurrencyMultiplier = () => {
      return (symbol: string) =>
        currencyList.value?.[symbol]?.[currentCurrencySymbol.value]
    }

    return {
      currentCurrencySymbol,
      currencyList,
      getCurrencyMultiplier
    }
  },
  {
    persist: {
      key: STORAGE_KEY.CURRENCY_STORE
    }
  }
)
