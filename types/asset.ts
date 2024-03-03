import type { LinkMetadata } from '@lukso/lsp-smart-contracts'

// TODO use type from lsp package when it's released
export type LSP4DigitalAssetMetadata = {
  images?: Image[][]
  icon?: Image[]
  description?: string
  assets?: AssetMetadata[]
  attributes?: AttributeMetadata[]
  links?: LinkMetadata[]
}

export type Asset = {
  isLoading: boolean
  isOwned: boolean
  isIssued: boolean
  address: Address
  assetData: any
  tokenStandard: string
  tokenIdFormat: number
  referenceContract: Address
  balance: string
  decimals: number
  standard: string
  name: string
  symbol: string
  tokenName: string
  tokenSymbol: string
  tokenType: number
  supportsInterfaces: Record<string, boolean>
  isNativeToken?: boolean
  baseURI?: any
  tokenDataURL?: string
  tokenId?: `0x${string}`
  tokenIdIsContract?: boolean
  tokenURI?: string
  owner?: Address
  creator?: Address
  tokenCreators?: Address[]
  tokenSupply?: string
  metadata?: LSP4DigitalAssetMetadata
  tokenMetadata?: LSP4DigitalAssetMetadata
  get resolvedMetadata(): LSP4DigitalAssetMetadata
}