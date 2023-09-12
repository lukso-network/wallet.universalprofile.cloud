import { LSP3Profile } from '@lukso/lsp-factory.js'

declare global {
  type Address = `0x${string}`

  type Profile = LSP3Profile & {
    backgroundImageUrl?: string
    profileImageUrl?: string
    address?: Address
    balance: string
  }

  type Creator = Partial<Pick<Profile, 'address' | 'profileImageUrl' | 'name'>>

  type NetworkId = string
  type ChainIdHex = `0x${string}`

  interface NetworkInfo {
    id: NetworkId
    name: string
    rpcHttp: string
    chainId: ChainIdHex
    storeUrls?: { [key in BrowserName]: string }
    token: string
  }

  interface Window {
    lukso: any
    ethereum: any
  }

  interface Modal {
    title?: string
    message?: string
    isOpen?: boolean
    confirmButtonText?: string
    icon?: string
    template?: string
    onConfirm?: () => void
  }

  type NavigatorExtended = Navigator & {
    brave?: { isBrave: () => Promise<boolean> }
  }

  type BrowserName =
    | 'chrome'
    | 'safari'
    | 'firefox'
    | 'edge'
    | 'opera'
    | 'brave'

  type DeviceExtended = Device & { isBrave: boolean; isOpera: boolean }

  type BrowserInfo = {
    id: BrowserName
    name: string
    icon: string
    storeLink: string
  }
}

export {}
