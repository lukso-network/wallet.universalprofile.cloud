declare module '#app' {
  interface NuxtApp {
    $formatMessage(key: string, options?: Record<string, string>): string
    $formatNumber(value: string | number): string
    $formatDate(date?: string | number | Date): string
    $formatTime(date?: string | number | Date): string
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $formatMessage(key: string, options?: Record<string, string>): string
    $formatNumber(value: string | number): string
    $formatDate(date?: string | number | Date): string
    $formatTime(date?: string | number | Date): string
  }
}

export {}
