import type {
  LSP3ProfileMetadata,
  LinkMetadata
} from '@lukso/lsp-smart-contracts'

export type Profile = {
  address?: Address
  name?: string
  balance?: string
  links?: LinkMetadata[]
  tags?: string[]
  description?: string
  standard?: Standard
  profileImageId?: string
  backgroundImageId?: string
  issuedAssets?: Address[]
  receivedAssets?: Address[]
  profileImage?: Image[]
  backgroundImage?: Image[]
  isLoading?: boolean
  profileLink?: ProfileLink
}

export type IndexedProfile = {
  address: Address
  LSP3Profile?: LSP3ProfileMetadata
  profileImageUrl?: string
  LSPStandard: Standard
  type: Standard // TODO this is legacy type field, we keep it until indexer fully migrate to `LSPStandard`

  // not using now this attributes but some will be useful
  // TODO refactor this later
  hasProfileName?: boolean
  hasProfileDescription?: boolean
  hasProfileLinks?: boolean
  hasProfileTags?: boolean
  hasProfileImage?: boolean
  hasBackgroundImage?: boolean
  updatedAtBlock: number
  chainId: number
  lastUpdatedAt: string
}

export type ProfileLink = {
  resolved: string
  link: string
  address: Address
  checksummed: Address
  isResolved: boolean
}
