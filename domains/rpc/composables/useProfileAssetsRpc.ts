import { useQueries } from '@tanstack/vue-query'
import { hexToAscii, stripHexPrefix, toNumber } from 'web3-utils'

import type { Asset, ReferenceContract } from '@/types/asset'
import type { QFQueryOptions } from '@/utils/queryFunctions'

type AdditionalQueryOptions = {
  receivedAssetCount: number
  allAddresses: Address[]
}

export function useProfileAssetsRpc() {
  return (profileAddress?: MaybeRef<Address | null>) => {
    const { selectedChainId: chainId } = useAppStore()
    const profile = useProfile().getProfile(profileAddress as MaybeRef<Address>)
    const queries: ComputedRef<Array<QFQueryOptions> & AdditionalQueryOptions> =
      computed(() => {
        const receivedAssetCount = profile?.value?.receivedAssets?.length || 0
        const allAddresses = ([] as `0x${string}`[]).concat(
          profile?.value?.receivedAssets || [],
          profile?.value?.issuedAssets || []
        )
        const queries: Array<QFQueryOptions> & AdditionalQueryOptions =
          allAddresses.flatMap((address: Address) => {
            return [
              queryCallContract({
                // 0
                chainId,
                address,
                method: 'tokenIdsOf(address)',
                args: [profile.value?.address],
                refetchInterval: 120000,
                staleTime: 250,
              }),
              queryCallContract({
                // 1
                chainId,
                address,
                method: 'balanceOf(address)',
                args: [profile.value?.address],
                refetchInterval: 120000,
                staleTime: 250,
              }),
              queryGetData({
                // 2
                chainId,
                address,
                keyName: 'LSP4TokenName',
              }),
              queryGetData({
                // 3
                chainId,
                address,
                keyName: 'LSP4TokenSymbol',
              }),
              queryGetData({
                // 4
                chainId,
                address,
                keyName: 'LSP4TokenType',
              }),
              queryGetData({
                // 5
                chainId,
                address,
                keyName: 'LSP8TokenMetadataBaseURI',
              }),
              queryGetData({
                // 6
                chainId,
                address,
                keyName: 'LSP8TokenIdFormat',
              }),
              queryCallContract({
                // 7
                chainId,
                address,
                method: 'decimals()',
              }),
              queryGetData({
                // 8
                chainId,
                address,
                keyName: 'LSP8ReferenceContract',
              }),
              ...interfacesToCheck.map(({ interfaceId }) => {
                return queryCallContract({
                  // 9+
                  chainId,
                  address,
                  method: 'supportsInterface(bytes4)',
                  args: [interfaceId],
                })
              }),
            ]
          }) as Array<QFQueryOptions> & AdditionalQueryOptions
        // Trick to keep additional query options attached to the current queries list.
        queries.receivedAssetCount = receivedAssetCount
        queries.allAddresses = allAddresses
        return queries as Array<QFQueryOptions> & AdditionalQueryOptions
      })
    return useQueries({
      queries,
      combine: results => {
        if (!profile.value?.address) {
          return
        }
        const prefixLength = queries.value.findIndex(
          ({ queryKey: [type, , , call] }) =>
            type === 'call' && call === 'supportsInterface(bytes4)'
        )

        return (queries.value.allAddresses.flatMap((address, _assetIndex) => {
          const assetIndex =
            _assetIndex * (prefixLength + interfacesToCheck.length)
          const isIssued = _assetIndex >= queries.value.receivedAssetCount
          const tokenIds = results[assetIndex + 0].data as string[]
          const balance = results[assetIndex + 1].data as string
          const tokenName = results[assetIndex + 2].data as string
          const tokenSymbol = results[assetIndex + 3].data as string
          const tokenType = results[assetIndex + 4].data as number
          const baseURI = results[assetIndex + 5].data as any
          const tokenIdFormat = results[assetIndex + 6].data as number
          const decimals = (results[assetIndex + 7].data as number) || 0
          const rootReferenceContract = results[assetIndex + 8]
            .data as ReferenceContract
          const { supportsInterfaces, standard } = interfacesToCheck.reduce(
            (
              { supportsInterfaces, standard },
              { interfaceId, standard: _standard },
              index
            ) => {
              const supports = results[assetIndex + index + prefixLength]
                .data as boolean
              supportsInterfaces[interfaceId] = supports
              if (supports) {
                standard = _standard
              }
              return { supportsInterfaces, standard }
            },
            { supportsInterfaces: {}, standard: null } as {
              supportsInterfaces: Record<string, boolean>
              standard: Standard | null
            }
          )
          const isLoading = results.some(result => result.isLoading)
          let tokenIdsData: Asset[] | undefined

          if (tokenIds && tokenIds.length > 0) {
            tokenIdsData = tokenIds.map(tokenId => {
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
                  `${LUKSO_PROXY_API}/ipfs/`
                )
              }
              const asset = {
                isLoading,
                isOwned: !isIssued,
                isIssued,
                address,
                tokenURI,
                tokenIdFormat,
                rootReferenceContract,
                baseURI: toRaw(baseURI),
                tokenDataURL,
                decimals,
                tokenId,
                balance:
                  // for LSP8 we show balance as 1 not counting all tokenIds
                  standard && isLsp8({ standard }) && balance !== '0'
                    ? '1'
                    : balance,
                standard,
                tokenName,
                tokenSymbol,
                tokenType,
                supportsInterfaces,
              } as Asset
              if (!isLoading && assetLog.enabled) {
                assetLog('profile-asset', asset)
              }
              return asset
            })

            // when there is only 1 token id we just show it
            if (tokenIds.length === 1) {
              return tokenIdsData
            }
          }

          const asset = {
            isLoading,
            isOwned: !isIssued,
            isIssued,
            address,
            tokenIdFormat,
            rootReferenceContract,
            baseURI: toRaw(baseURI),
            balance:
              // for LSP8 we show balance as 1 not counting all tokenIds
              standard && isLsp8({ standard }) && balance !== '0'
                ? '1'
                : balance,
            standard,
            tokenName,
            tokenSymbol,
            tokenType,
            supportsInterfaces,
            decimals,
            tokenIdsData,
          } as Asset

          if (!isLoading && assetLog.enabled) {
            assetLog('profile-asset', asset)
          }

          return asset
        }) || []) as Asset[]
      },
    })
  }
}
