import type {
  AttributeMetadata,
  LSP4_TOKEN_TYPES,
  LSP8_TOKEN_ID_FORMAT,
  LinkMetadata,
} from '@lukso/lsp-smart-contracts'

// TODO use type from lsp package when it's released
export type LSP4DigitalAssetMetadata = {
  images?: Image[][]
  icon?: Image[]
  description?: string
  assets?: AssetMetadata[]
  attributes?: AttributeMetadata[]
  links?: LinkMetadata[]
  name?: string
}

export type LSP4DigitalAssetMetadataJSON = {
  LSP4Metadata: LSP4DigitalAssetMetadata
}

export type ReferenceContract = {
  address: Address
  tokenId: string
}

export type Asset = {
  address?: Address
  balance?: string
  decimals?: number
  standard?: string
  supportsInterfaces?: Record<string, boolean>
  referenceContract?: ReferenceContract
  rootReferenceContract?: ReferenceContract
  baseURI?: any
  owner?: Address
  tokenIdFormat?: number
  tokenName?: string
  tokenSymbol?: string
  tokenType?: number
  tokenDataURL?: string
  tokenId?: `0x${string}`
  tokenIdIsContract?: boolean
  tokenIdsOf?: string[]
  tokenURI?: string
  tokenCreators?: Address[]
  totalSupply?: string
  tokenIdsData?: Asset[]
  resolvedMetadata?: LSP4DigitalAssetMetadata
  rawMetadata?: {
    lsp7Data?: LSP4DigitalAssetMetadata
    baseURIData?: LSP4DigitalAssetMetadata
    forTokenData?: LSP4DigitalAssetMetadata
    tokenMetadata?: LSP4DigitalAssetMetadata
  }
  tokenIdCreatorCount?: number
  lsp7Creators?: Address[]
  isNativeToken?: boolean
  isOwned?: boolean
  isIssued?: boolean
  isLoading?: boolean
  isAssetLoading?: boolean
  isMetadataLoading?: boolean
}

export type TokenType = keyof typeof LSP4_TOKEN_TYPES
export type TokenIdFormatKey = keyof typeof LSP8_TOKEN_ID_FORMAT
export type TokenIdFormatValue = (typeof LSP8_TOKEN_ID_FORMAT)[TokenIdFormatKey]

export type SendQueryParams = {
  asset?: Address
  tokenId?: string
  amount?: string
}

export type ImageVerifiedStatus = 'verified' | 'invalid' | 'unverified'
