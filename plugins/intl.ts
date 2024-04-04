import type { FormatNumberOptions } from '@formatjs/intl'

/**
 * Expose intl based functions to the app so they can be used without importing
 *
 * e.g. $formatMessage('example_key')
 */
export default defineNuxtPlugin(() => {
  const {
    formatMessage,
    formatNumber,
    formatDate,
    formatTime,
    formatCurrency
  } = useIntl()

  return {
    provide: {
      formatMessage: (key: string, options?: Record<string, string>) =>
        formatMessage(key, options),
      formatNumber: (value: number, options?: FormatNumberOptions) =>
        formatNumber(value, options),
      formatDate: (date?: string | number | Date) => formatDate(date),
      formatTime: (date?: string | number | Date) => formatTime(date),
      formatCurrency: (value: string, symbol: string) =>
        formatCurrency(value, symbol)
    }
  }
})
