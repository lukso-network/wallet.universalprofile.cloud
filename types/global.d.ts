declare global {
  type Address = `0x${string}`

  type Base64EncodedImage = `data:image/jpeg;base64${string}`

  interface Window {
    lukso: any
    ethereum: any
    web3: any
  }

  // TODO remove when LSP package is released
  type AttributeMetadata = {
    key: string
    value: string
    type: string | number | boolean
  }

  type AssetMetadata = FileAsset | ContractAsset

  type FileAsset = {
    verification?: Verification
    url: string
    fileType: string
  }

  type ContractAsset = {
    address: string
    tokenId?: string
  }
}
