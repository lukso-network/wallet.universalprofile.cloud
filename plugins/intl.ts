/**
 * Expose intl based functions to the app so they can be used without importing
 *
 * e.g. $formatMessage('example_key')
 */
export default defineNuxtPlugin(() => {
  const { formatMessage, formatNumber, formatDate, formatTime } = useIntl()

  return {
    provide: {
      formatMessage: (key: string, options?: Record<string, string>) =>
        formatMessage(key, options),
      formatNumber: (value: string | number) => formatNumber(value),
      formatDate: (date: string | number) => formatDate(date),
      formatTime: (date: string | number) => formatTime(date),
    },
  }
})
