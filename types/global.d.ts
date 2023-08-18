import { LSP3Profile } from '@lukso/lsp-factory.js'

declare global {
  type Address = `0x${string}`

  interface Lsp7AssetType {
    name: string
    symbol: string
    amount: string
    icon: string
    address: string
  }

  interface Lsp8AssetType {
    image: string
    icon: string
    tokenId: string
    description: string
    collectionName: string
    collectionDescription: string
    collectionImage: string
    collectionIcon: string
    collectionAddress: string
  }

  type Profile = LSP3Profile & {
    backgroundImageUrl?: string
    profileImageUrl?: string
    address?: Address
  }

  type NetworkId = string
  type ChainIdHex = `0x${string}`

  interface NetworkInfo {
    id: NetworkId
    name: string
    rpcHttp: string
    chainId: ChainIdHex
    ipfsUrl: string
    storeUrls?: { [key in BrowserName]: string }
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
  }
}

export {}
