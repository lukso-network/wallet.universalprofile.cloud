import {
  LSP4_TOKEN_TYPES,
  LSP8_TOKEN_ID_FORMAT,
  type LinkMetadata,
} from '@lukso/lsp-smart-contracts'

export const createAssetObject = (
  receivedAsset: any,
  _rawMetadata?: any,
  tokenIdsData: Asset[] = [],
  balance?: string
) => {
  let rawMetadata = receivedAsset

  if (_rawMetadata) {
    rawMetadata = _rawMetadata
  }

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

  // TODO due to duplicate creator bug we need to add additional filter, remove this after indexer is fixed
  const creators: Creator[] =
    receivedAsset?.lsp4Creators?.filter(
      (creator: any) => creator?.interfaceId
    ) || []

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
    tokenCreators: creators.map((creator: any) => creator?.profile?.id),
    tokenCreatorsData: creators.map((creator: any) => {
      return {
        address: creator?.profile?.id,
        name: creator?.profile?.name,
        profileImage: prepareImages(creator?.profile?.profileImages),
        issuedAssets: receivedAsset?.owner?.lsp12IssuedAssets?.map(
          (asset: any) => asset?.asset?.id
        ),
      }
    }),
    tokenId: rawMetadata?.tokenId,
    tokenIdsData,
  } as Asset

  return asset
}
