import { ImageMetadata, LinkMetadata } from '@lukso/lsp-factory.js'
import { INTERFACE_IDS } from '@lukso/lsp-smart-contracts'

export type InterfaceId = keyof typeof INTERFACE_IDS
export type SupportedStandards = keyof AssetApi
export type SupportedAssets = Asset<SupportedStandards>

export const tokenStandards: InterfaceId[] = ['LSP7DigitalAsset', 'ERC20']
export const nftStandards: InterfaceId[] = ['LSP8IdentifiableDigitalAsset']

export const StandardsAbbreviations: { [K in InterfaceId]?: string } = {
  LSP7DigitalAsset: 'LSP7',
  ERC20: 'ERC20',
  LSP8IdentifiableDigitalAsset: 'LSP8',
}

export interface Asset<T extends keyof AssetApi> {
  address: Address
  standard?: InterfaceId
  data: AssetApi[T]
}

export interface TokenApi {
  LSP7DigitalAsset: LSP7Asset
  ERC20: ERC20Asset
}

export type SupportedTokens = keyof TokenApi
export type SupportedNfts = keyof NftApi
export type Token = Asset<Partial<SupportedTokens>>
export type Nft = Asset<Partial<SupportedNfts>>

export interface NativeToken {
  name: string
  symbol: string
  icon: string
  amount: string
}

export interface NftApi {
  LSP8IdentifiableDigitalAsset: LSP8Asset
}

export type AssetApi = TokenApi & NftApi

export interface LSP7Asset {
  name: string
  symbol: string
  amount: string
  icon: string
  address: string
  links: LinkMetadata[]
  description: string
  images: ImageMetadata[][]
}

export interface ERC20Asset {
  name: string
  symbol: string
  amount: string
  address: string
}

export interface LSP8Asset {
  image: string
  icon: string
  tokenId: string
  description: string
  collectionName: string
  collectionDescription: string
  collectionImages: ImageMetadata[][]
  collectionIcon: string
  collectionAddress: string
  collectionSymbol: string
  collectionLinks: LinkMetadata[]
  creatorName?: string
  creatorAddress?: Address
  creatorProfileImage?: string
}

export enum AssetFilter {
  owned = 'owned',
  created = 'created',
}

export enum TokenIdType {
  address = '1',
  number = '2',
  bytes32 = '3',
}

export type SendAsset = {
  name?: string
  amount?: string
  symbol?: string
  icon?: string
}
