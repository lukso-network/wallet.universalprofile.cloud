import LSP5ReceivedAssets from '@erc725/erc725.js/schemas/LSP5ReceivedAssets.json'
import { numberToHex, padLeft } from 'web3-utils'

/**
 * Generate key/value pair for adding received asset
 *
 * @param assetAddress
 * @param interfaceId
 * @param profileAddress
 * @param receivedAssets
 * @returns
 */
export const generateAddReceivedAssetKeys = (
  assetAddress: Address,
  interfaceId: string,
  profileAddress?: Address,
  receivedAssets?: Address[]
) => {
  assertAddress(profileAddress)
  const { getInstance } = useErc725()
  const erc725 = getInstance(profileAddress, LSP5ReceivedAssets)
  const receivedAssetsLength = receivedAssets?.length || 0

  return erc725.encodeData([
    {
      keyName: 'LSP5ReceivedAssets[]',
      value: [assetAddress],
      // @ts-ignore
      startingIndex: receivedAssetsLength,
      totalArrayLength: receivedAssetsLength + 1,
    },
    {
      keyName: 'LSP5ReceivedAssetsMap:<address>',
      dynamicKeyParts: assetAddress,
      value: [
        interfaceId,
        `${padLeft(numberToHex(receivedAssetsLength), 32).substring(2)}`,
      ], // TODO update when erc725js encodeValueType bug is fixed
    },
  ])
}
