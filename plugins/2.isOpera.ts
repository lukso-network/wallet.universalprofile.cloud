import type { DeviceExtended } from '@/types/device'
import type { NuxtApp } from 'nuxt/app'

type OperaWindow = Window & {
  opera?: { addons?: unknown }
  opr?: { addons?: unknown }
}

/**
 * Detects if the browser is Opera
 *
 * @param nuxtApp - nuxt app instance
 */

export default defineNuxtPlugin(async (nuxtApp: NuxtApp) => {
  const operaWindow = globalThis.window as OperaWindow

  if (nuxtApp?.$device) {
    ;(nuxtApp.$device as DeviceExtended).isOpera =
      (!!operaWindow?.opr && !!operaWindow?.opr?.addons) ||
      !!operaWindow?.opera ||
      globalThis?.navigator?.userAgent.indexOf(' OPR/') >= 0
  }
})
