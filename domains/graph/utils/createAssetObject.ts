import {
  LSP4_TOKEN_TYPES,
  LSP8_TOKEN_ID_FORMAT,
  type LinkMetadata,
} from '@lukso/lsp-smart-contracts'

export const createAssetObject = (
  receivedAsset: any,
  rawMetadata: any,
  tokenIdsData: Asset[],
  balance: string,
  tokenId?: string
) => {
  const metadata = prepareMetadata({
    LSP4Metadata: {
      images: unflatArray(rawMetadata?.images as Image[][]),
      icon: rawMetadata?.icons as Image[],
      description: rawMetadata?.description as string,
      assets: rawMetadata?.assets as AssetMetadata[],
      attributes: rawMetadata?.attributes as AttributeMetadata[],
      links: rawMetadata?.links as LinkMetadata[],
    },
  })

  const asset = {
    address: receivedAsset?.id,
    balance,
    standard: receivedAsset?.standard,
    owner: receivedAsset?.owner?.id,
    ownerData: {
      address: receivedAsset?.owner?.id,
      name: receivedAsset?.owner?.name,
      profileImage: prepareImages(receivedAsset?.owner?.profileImages),
      issuedAssets: receivedAsset?.owner?.lsp12IssuedAssets?.map(
        (asset: any) => asset?.asset?.id
      ),
    },
    resolvedMetadata: metadata,
    decimals: receivedAsset?.decimals,
    totalSupply: receivedAsset?.totalSupply,
    tokenName: receivedAsset?.lsp4TokenName,
    tokenSymbol: receivedAsset?.lsp4TokenSymbol,
    tokenType: receivedAsset?.lsp4TokenType || LSP4_TOKEN_TYPES.TOKEN,
    tokenIdFormat:
      receivedAsset?.lsp8TokenIdFormat || LSP8_TOKEN_ID_FORMAT.NUMBER,
    tokenCreators: receivedAsset?.lsp4Creators.map(
      (creator: any) => creator?.profile?.id
    ),
    tokenCreatorsData: receivedAsset?.lsp4Creators.map((creator: any) => {
      return {
        address: creator?.profile?.id,
        name: creator?.profile?.name,
        profileImage: prepareImages(creator?.profile?.profileImages),
        issuedAssets: receivedAsset?.owner?.lsp12IssuedAssets?.map(
          (asset: any) => asset?.asset?.id
        ),
      }
    }),
    tokenId,
    tokenIdsData,
  } as Asset

  return asset
}