import type { BrowserInfo, DeviceExtended } from '@/types/device'

const detectBrowser = (): BrowserInfo | undefined => {
  const { isChrome, isBrave, isFirefox, isSafari, isEdge, isOpera } =
    useDevice() as DeviceExtended

  if (isBrave) {
    return {
      id: 'brave',
      name: 'Brave',
      icon: 'logo-brave',
      storeLink: EXTENSION_STORE_LINKS.brave
    }
  }

  if (isEdge) {
    return {
      id: 'edge',
      name: 'Edge',
      icon: 'logo-edge',
      storeLink: EXTENSION_STORE_LINKS.edge
    }
  }

  if (isOpera) {
    return {
      id: 'opera',
      name: 'Opera',
      icon: 'logo-opera',
      storeLink: EXTENSION_STORE_LINKS.opera
    }
  }

  if (isChrome) {
    return {
      id: 'chrome',
      name: 'Chrome',
      icon: 'logo-chrome',
      storeLink: EXTENSION_STORE_LINKS.chrome
    }
  }

  if (isFirefox) {
    return {
      id: 'firefox',
      name: 'Firefox',
      icon: 'logo-firefox',
      storeLink: EXTENSION_STORE_LINKS.firefox
    }
  }

  if (isSafari) {
    return {
      id: 'safari',
      name: 'Safari',
      icon: 'logo-safari',
      storeLink: EXTENSION_STORE_LINKS.safari
    }
  }
}

/**
 * Expose browser info to the app
 */
export const browserInfo = (): BrowserInfo => {
  const browserInfoDefaults = {
    id: 'chrome',
    name: '',
    icon: ''
  } as BrowserInfo
  const browserInfo = { ...browserInfoDefaults, ...detectBrowser() }

  return browserInfo
}
