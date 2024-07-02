import { useQueries } from '@tanstack/vue-query'

import type { AssetQuery } from '@/.nuxt/gql/default'

type QueryResult = AssetQuery

export function useAssetGraph() {
  return (
    _assetAddress?: MaybeRef<Address | undefined>,
    _tokenId?: MaybeRef<string | undefined>
  ) => {
    const connectedProfile = useProfile().connectedProfile()
    const { selectedChainId: chainId } = useAppStore()

    const queries = computed(() => {
      const assetAddress = unref(_assetAddress) || ''
      const profileAddress = connectedProfile.value?.address || ''
      const tokenId: string = unref(_tokenId) || ''

      const queries = assetAddress
        ? [
            {
              // 0
              queryKey: [
                'asset-graph',
                assetAddress,
                chainId,
                tokenId,
                profileAddress,
              ],
              queryFn: async () => {
                const queryResult: QueryResult = await GqlAsset({
                  assetAddress,
                  profileAddress,
                  tokenId,
                })

                if (graphLog.enabled) {
                  graphLog('asset-raw', queryResult)
                }

                return queryResult
              },
              refetchInterval: 120_000,
              staleTime: 250,
            },
          ]
        : []
      return queries
    })
    return useQueries({
      queries,
      combine: results => {
        const data = results[0]?.data as QueryResult | undefined
        const assetData = data?.asset?.[0]
        const tokenData = data?.token?.[0]
        const holdData = data?.hold?.[0]
        const isLoading = results.some(result => result.isLoading)

        const asset = {
          ...createAssetObject(assetData, tokenData, [], getBalance(holdData)),
          isLoading,
          isMetadataLoading: isLoading,
        }

        if (assetLog.enabled) {
          assetLog('asset', asset)
        }

        return asset
      },
    })
  }
}
