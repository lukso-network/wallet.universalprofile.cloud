import type { FormatNumberOptions } from '@formatjs/intl'

export interface NuxtApp {
  $formatMessage(key: string, options?: Record<string, string>): string
  $formatNumber(value: string | number, options?: FormatNumberOptions): string
  $formatDate(date?: string | number | Date): string
  $formatTime(date?: string | number | Date): string
  $formatCurrency(value: string, symbol: string): string
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $formatMessage(key: string, options?: Record<string, string>): string
    $formatNumber(value: string | number, options?: FormatNumberOptions): string
    $formatDate(date?: string | number | Date): string
    $formatTime(date?: string | number | Date): string
    $formatCurrency(value: string, symbol: string): string
  }
}
