import {
  type FormatNumberOptions,
  type IntlConfig,
  type IntlShape,
  createIntl
} from '@formatjs/intl'
import { fromWei } from 'web3-utils'

import defaultMessages from '@/translations/en_US.json'

const intl = ref<IntlShape>()
const messages = defaultMessages as unknown as Record<string, string>

// For more options check https://github.com/formatjs/formatjs/blob/main/packages/ecma402-abstract/types/number.ts#L38-L45
const formatNumberDefaultOptions = {
  maximumFractionDigits: 18
}

export const defaultConfig: IntlConfig = {
  locale: 'en-US',
  messages
}

/**
 * Initialize intl instance
 *
 * @param config - intl config
 */
const setupIntl = (config: IntlConfig) => {
  if (intl.value) {
    return
  }
  intl.value = createIntl({ ...config, defaultLocale: 'en-US' })
}

/**
 * Translate a string based on the key
 *
 * @param key - translation key
 * @param options - options for formatMessage
 * @returns - translated string
 */
const formatMessage = (key: string, options?: Record<string, string>) => {
  if (options) {
    return intl.value?.formatMessage({ id: key }, options) || ''
  }
  return intl.value?.formatMessage({ id: key }) || ''
}

/**
 * Number formatting based on the locale
 *
 * @param value - number to format
 * @param options - options for formatNumber, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#parameters
 * @returns - formatted number
 */
const formatNumber = (value: number, options: FormatNumberOptions = {}) => {
  if (value === null || value === undefined) {
    return '0'
  }

  const mergedOptions = {
    ...formatNumberDefaultOptions,
    ...options
  }

  return intl.value?.formatNumber(value, mergedOptions) || ''
}

/**
 * Date formatting based on the locale
 *
 * @param date - date to format
 * @returns - formatted date
 */
const formatDate = (date?: string | number | Date) => {
  return intl.value?.formatDate(date)
}

/**
 * Time formatting based on the locale
 *
 * @param date - date to format
 * @returns - formatted time
 */
const formatTime = (date?: string | number | Date) => {
  return intl.value?.formatTime(date)
}

/**
 * Currency formatting based on the locale
 *
 * @param value - number to format
 * @param symbol - currency symbol
 * @returns - formatted string
 */
const formatCurrency = (value: string, symbol: string) => {
  const { getCurrencyMultiplier, currentCurrencySymbol } = useCurrencyStore()
  const currencyMultiplier = getCurrencyMultiplier()(symbol)

  if (!value || !currencyMultiplier) {
    return ''
  }

  const currencyValue = Number.parseFloat(fromWei(value)) * currencyMultiplier

  return formatNumber(currencyValue, {
    maximumFractionDigits: 2,
    style: 'currency',
    currency: currentCurrencySymbol
  })
}

export const useIntl = () => {
  return {
    setupIntl,
    formatMessage,
    formatNumber,
    formatDate,
    formatTime,
    formatCurrency
  }
}
