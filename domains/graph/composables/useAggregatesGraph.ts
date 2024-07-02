import { useQueries } from '@tanstack/vue-query'

import type { AggregatesQuery } from '@/.nuxt/gql/default'
import type { QFQueryOptions } from '@/utils/queryFunctions'

type FiltersProfileAssets = {
  profileAddress?: MaybeRef<Address | null>
}

type AdditionalQueryOptions = { profileAddress?: Address | null }

type QueryResult = AggregatesQuery
type QueryResultProfile = AggregatesQuery['Profile']

export function useAggregatesGraph() {
  return ({ profileAddress: _profileAddress }: FiltersProfileAssets) => {
    const { selectedChainId: chainId } = useAppStore()

    const queries = computed(() => {
      const profileAddress = unref(_profileAddress)

      const queries: QFQueryOptions[] & AdditionalQueryOptions = (
        profileAddress
          ? [
              {
                // 0
                queryKey: ['aggregates-graph', profileAddress, chainId],
                queryFn: async () => {
                  const { Profile: profiles }: QueryResult =
                    await GqlAggregates({
                      address: profileAddress,
                    })

                  if (graphLog.enabled) {
                    graphLog('aggregates-raw', profiles)
                  }

                  return profiles as QueryResultProfile
                },
                refetchInterval: 120_000,
                staleTime: 250,
              },
            ]
          : []
      ) as QFQueryOptions[] & AdditionalQueryOptions
      queries.profileAddress = profileAddress
      return queries
    })
    return useQueries({
      queries,
      combine: results => {
        const data = results[0]?.data as QueryResultProfile | undefined
        const profilesData = data?.[0]
        const {
          ownedAssets,
          ownedTokens,
          ownedCollectibles,
          issuedAssets,
          issuedTokens,
          issuedCollectibles,
        } = profilesData || {}
        const ownedAssetsCount = ownedAssets?.aggregate?.count || 0
        const ownedTokensCount = ownedTokens?.aggregate?.count || 0
        const ownedCollectiblesCount = ownedCollectibles?.aggregate?.count || 0

        const issuedAssetsCount = issuedAssets?.aggregate?.count || 0
        const issuedTokensCount = issuedTokens?.aggregate?.count || 0
        const issuedCollectiblesCount =
          issuedCollectibles?.aggregate?.count || 0

        const aggregates = {
          ownedAssetsCount,
          ownedTokensCount,
          ownedCollectiblesCount,
          issuedAssetsCount,
          issuedTokensCount,
          issuedCollectiblesCount,
        }

        if (assetLog.enabled) {
          assetLog('aggregates', aggregates)
        }

        return aggregates
      },
    })
  }
}
