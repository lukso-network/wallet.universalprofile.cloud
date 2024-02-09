import LSP7DigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json'

import type { AbiItem } from 'web3-utils'
import type { LSP7DigitalAsset as LSP7DigitalAssetInterface } from '@/types/contracts'

export const createLsp7Object = async (
  address: Address,
  indexedAsset?: IndexedAsset,
  profileAddress?: Address
): Promise<Asset> => {
  const { contract } = useWeb3(PROVIDERS.RPC)
  const lsp7Contract = contract<LSP7DigitalAssetInterface>(
    LSP7DigitalAsset.abi as AbiItem[],
    address
  )
  const {
    LSP4TokenName: name,
    description,
    LSP4TokenSymbol: symbol,
    LSP4Metadata: metadata,
    LSP4TokenType: tokenType,
    LSP4Creators: creators,
    assetImageUrl,
  } = indexedAsset || {}
  const { links } = metadata || {}

  // get profile balance for the asset
  const balance = await fetchLsp7Balance(address, profileAddress)

  // get `tokenSupply` and `decimals` for the asset
  // TODO get this data from index when it's added
  const tokenSupply = await lsp7Contract.methods.totalSupply().call()
  const decimals = Number(await lsp7Contract.methods.decimals().call())

  // get best image from collection based on height criteria
  const icon = metadata?.icon && createImageObject(metadata.icon, 56)

  // create image identifier so they can be linked in Pinia ORM
  const iconId = getHash(icon?.url)

  const images: ImageMetadataWithRelationships[] = []
  const imageIds: string[] = []

  if (metadata?.images) {
    // get best image from collection based on height criteria
    for await (const image of metadata.images) {
      const convertedImage = createImageObject(image, 100)
      if (convertedImage) {
        images.push(convertedImage)
      }
    }

    // create array of image identifiers so they can be linked in Pinia ORM
    images.forEach(image => {
      const id = getHash(image.url)
      id && imageIds.push(id)
    })
  }

  // get contract owner
  const owner = await lsp7Contract.methods.owner().call() // TODO fetch from Algolia when it's supported
  assertAddress(owner)

  return {
    address,
    name,
    symbol,
    balance,
    decimals,
    tokenSupply,
    links,
    description,
    standard: ASSET_TYPES.LSP7,
    icon,
    iconId,
    images,
    imageIds,
    creators,
    tokenId: '0x',
    owner: profileAddress,
    tokenType: tokenType || 'TOKEN', // we set default just in case it's missing from indexer
    assetImageUrl,
    contractOwner: owner,
  }
}

export const fetchLsp7Balance = async (
  assetAddress?: Address,
  profileAddress?: Address
) => {
  if (!profileAddress || !assetAddress) {
    return '0'
  }

  const { contract } = useWeb3(PROVIDERS.RPC)
  const lsp7Contract = contract<LSP7DigitalAssetInterface>(
    LSP7DigitalAsset.abi as AbiItem[],
    assetAddress
  )

  return await lsp7Contract.methods.balanceOf(profileAddress).call()
}
