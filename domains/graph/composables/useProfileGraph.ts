import { useQueries } from '@tanstack/vue-query'

import type { ProfileQuery } from '@/.nuxt/gql/default'
import type { ProfileLink } from '@/types/profile'
import type { QFQueryOptions } from '@/utils/queryFunctions'

type AdditionalQueryOptions = { profileAddress?: Address | null }

export const getProfile = (_profileAddress: MaybeRef<Address | undefined>) => {
  const { selectedChainId: chainId } = useAppStore()

  const queries = computed(() => {
    const profileAddress = unref(_profileAddress)?.toLowerCase() as Address

    const queries: QFQueryOptions[] & AdditionalQueryOptions = (
      profileAddress
        ? [
            {
              // 0
              queryKey: ['getBalance', profileAddress, chainId],
              queryFn: async () => {
                const { getBalance } = useWeb3(PROVIDERS.RPC)
                return profileAddress ? await getBalance(profileAddress) : 0
              },
              refetchInterval: 120_000,
              staleTime: 250,
            },
            {
              // 1
              queryKey: ['profile-graph', profileAddress, chainId],
              queryFn: async () => {
                const { profile }: ProfileQuery = await GqlProfile({
                  id: profileAddress,
                })

                if (graphLog.enabled) {
                  graphLog('profile-raw', profile)
                }

                return profile
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
      const profileAddress: Address | null | undefined =
        queries.value.profileAddress

      if (!profileAddress) {
        return null
      }

      const isLoading = results.some(result => result.isLoading)
      const balance = results[0].data as string
      const profileData = results[1].data as ProfileQuery['profile']
      const {
        name,
        standard,
        profileImages: profileImage,
        backgroundImages: backgroundImage,
        links,
        description,
        tags,
        fullName,
      } = profileData || {}
      const checksummed = toChecksumAddress(profileAddress) as Address
      const profileLink: ProfileLink | undefined = {
        address: profileAddress,
        resolved: profileAddress,
        link: fullName || `${BASE_PROFILE_LINK_URL}/${checksummed}`,
        checksummed,
        isResolved: !!fullName,
      }
      const receivedAssets: string[] = Array.from(
        new Set(
          (
            profileData?.holds?.map(
              ({ asset, token }) => asset?.id || token?.baseAsset?.id || ''
            ) || []
          ).filter(address => !!address)
        )
      )
      const issuedAssets: Address[] | undefined =
        profileData?.lsp12IssuedAssets?.map(asset => asset.id as Address)

      const profile = {
        isLoading,
        address: profileAddress,
        name,
        standard,
        profileImage,
        receivedAssets,
        issuedAssets,
        backgroundImage,
        balance,
        links,
        description,
        tags,
        profileLink,
      } as Profile
      if (!profile.isLoading && profileLog.enabled) {
        profileLog('profile', profile)
      }
      return profile
    },
  })
}

export function useProfileGraph() {
  return {
    getProfile,
  }
}
