import LSP7DigitalAsset from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json'
import { LSP4DigitalAssetJSON } from '@lukso/lsp-factory.js/build/main/src/lib/interfaces/lsp4-digital-asset'

import { PROVIDERS } from '@/types/enums'
import { LSP7Asset } from '@/types/assets'
import { ASSET_ICON_PLACEHOLDER_URL } from '@/shared/config'

const fetchLSP7Assets = async (
  assetAddress: Address,
  profileAddress: Address
): Promise<LSP7Asset | undefined> => {
  const { fetchLSP4Metadata } = useErc725()
  const lsp4Metadata = await fetchLSP4Metadata(assetAddress)

  // fetch amount of tokens received
  const tokenBalance = await fetchLSP7Balance(assetAddress, profileAddress)

  const lsp7Object = createLSP7Object(lsp4Metadata, tokenBalance, assetAddress)
  return lsp7Object
}

const fetchLSP7Balance = async (
  contractAddress: Address,
  profileAddress: Address
): Promise<number> => {
  const { contract } = useWeb3(PROVIDERS.RPC)
  const lsp7Contract = contract(LSP7DigitalAsset.abi as any, contractAddress)
  const balance = await lsp7Contract.methods.balanceOf(profileAddress).call()

  return balance
}

const createLSP7Object = (
  lsp4DigitalAssetJSON: [string, string, LSP4DigitalAssetJSON],
  tokenBalance: number,
  assetAddress: Address
): LSP7Asset => {
  const [name, symbol, lsp4MetadataJSON] = lsp4DigitalAssetJSON
  const lsp7AssetObject = {
    name,
    symbol,
    amount: tokenBalance.toString(),
    icon: lsp4MetadataJSON.LSP4Metadata.icon[0]?.url
      ? lsp4MetadataJSON.LSP4Metadata.icon[0]?.url
      : ASSET_ICON_PLACEHOLDER_URL,
    address: assetAddress,
    links: lsp4MetadataJSON.LSP4Metadata.links,
    description: lsp4MetadataJSON.LSP4Metadata.description,
    images: lsp4MetadataJSON.LSP4Metadata.images,
  }
  return lsp7AssetObject
}

export default fetchLSP7Assets
