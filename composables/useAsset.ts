import { useQueries } from '@tanstack/vue-query'
import { hexToAscii, stripHexPrefix, toNumber } from 'web3-utils'

import type { Asset, LSP4DigitalAssetMetadata } from '@/types/asset'
import type { QFQueryOptions } from '@/utils/queryFunctions'

export function useAsset() {
  return (address?: Address, tokenId?: string) => {
    if (!address) {
      return ref()
    }

    const connectedProfile = useProfile().connectedProfile()
    const profileAddress = computed(() => connectedProfile.value?.address)
    const { currentNetwork } = storeToRefs(useAppStore())
    const queries: ComputedRef<QFQueryOptions[]> = computed(() => {
      const chainId = currentNetwork.value?.chainId || ''
      const queries: QFQueryOptions[] = [
        queryGetData({
          // 0
          chainId,
          address,
          keyName: 'LSP4Metadata',
          isBig: true,
        }),
        queryGetData({
          // 1
          chainId,
          address,
          keyName: 'LSP4TokenName',
        }),
        queryGetData({
          // 2
          chainId,
          address,
          keyName: 'LSP4TokenSymbol',
        }),
        queryGetData({
          // 3
          chainId,
          address,
          keyName: 'LSP4TokenType',
        }),
        queryGetData({
          // 4
          chainId,
          address,
          keyName: 'LSP8TokenMetadataBaseURI',
        }),
        queryGetData({
          // 5
          chainId,
          address,
          keyName: 'LSP8TokenIdFormat',
        }),
        queryCallContract({
          // 6
          chainId,
          address,
          method: 'totalSupply()',
        }),
        ...(profileAddress.value
          ? [
              queryCallContract({
                // 7
                chainId,
                address,
                method: 'balanceOf(address)',
                args: [profileAddress.value],
                staleTime: 0,
              }),
            ]
          : []),
        ...interfacesToCheck.map(({ interfaceId }) => {
          return queryCallContract({
            // 8 / 9
            chainId,
            address,
            method: 'supportsInterface(bytes4)',
            args: [interfaceId],
          })
        }),
      ] as QFQueryOptions[]
      return queries
      // Trick to keep the right receivedAssetCount and allAddresses attached
      // to the current queries list.
    })
    return useQueries({
      queries: queries,
      combine: results => {
        const prefixLength = queries.value.findIndex(
          ({ queryKey: [type, , , call] }) =>
            type === 'call' && call === 'supportsInterface(bytes4)'
        )
        const isLoading = results.some(result => result.isLoading)
        const assetData = results[0].data as any
        const tokenName = results[1].data as string
        const tokenSymbol = results[2].data as string
        const tokenType = results[3].data as number
        const baseURI = results[4].data as any
        const tokenIdFormat = results[5].data as number
        const totalSupply = results[6].data as string
        const { supportsInterfaces, standard } = interfacesToCheck.reduce(
          (
            { supportsInterfaces, standard },
            { interfaceId, standard: _standard },
            index
          ) => {
            const supports = results[index + prefixLength].data as boolean
            supportsInterfaces[interfaceId] = supports
            if (supports) {
              standard = _standard
            }
            return { supportsInterfaces, standard }
          },
          { supportsInterfaces: {}, standard: null } as {
            supportsInterfaces: Record<string, boolean>
            standard: string | null
          }
        )
        const balance = profileAddress.value
          ? (results[7].data as string)
          : null
        let resolvedMetadata: LSP4DigitalAssetMetadata | undefined
        if (assetData) {
          resolvedMetadata = prepareMetadata(assetData)
        }
        if (tokenId) {
          let tokenURI = undefined
          let tokenDataURL = undefined
          try {
            switch (tokenIdFormat) {
              case 0:
                tokenURI = toNumber(tokenId).toString()
                break
              case 1:
                tokenURI = encodeURI(hexToAscii(tokenId).replace(/\0/g, ''))
                break
              case 2:
                tokenURI = tokenId.toLowerCase()
                break
              case 3:
              case 4:
                tokenURI = stripHexPrefix(tokenId).toLowerCase()
                break
            }
          } catch {
            // Ignore
          }
          if (baseURI && tokenURI) {
            tokenDataURL = `${baseURI.url}${tokenURI}`.replace(
              'ipfs://',
              'https://api.universalprofile.cloud/ipfs/'
            )
          }
          return {
            isLoading,
            address,
            tokenURI,
            tokenIdFormat,
            baseURI,
            tokenDataURL,
            totalSupply,
            tokenId,
            balance,
            standard,
            tokenName,
            tokenSymbol,
            tokenType,
            supportsInterfaces,
            rawMetadata: {
              assetData,
            },
            resolvedMetadata,
          } as Asset
        }

        return {
          isLoading,
          address,
          assetData,
          tokenIdFormat,
          totalSupply,
          baseURI,
          balance,
          standard,
          tokenName,
          tokenSymbol,
          tokenType,
          supportsInterfaces,
          rawMetadata: {
            assetData,
          },
          resolvedMetadata,
        } as Asset
      },
    })
  }
}
