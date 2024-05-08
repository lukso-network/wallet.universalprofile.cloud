import { useQueries, useQueryClient } from '@tanstack/vue-query'
import { keccak256, toChecksumAddress } from 'web3-utils'

import { browserProcessMetadata } from '@/utils/processMetadata'

import type { ProfileLink } from '@/types/profile'
import type { QFQueryOptions } from '@/utils/queryFunctions'
import type { ProfileQuery } from '@/.nuxt/gql/default'

export const getProfile = (_profile: MaybeRef<Address | undefined>) => {
  const { currentNetwork } = storeToRefs(useAppStore())
  const profileAddress = unref(_profile)
  const enableRpc = ref(false)
  const queryClient = useQueryClient()

  const queries = computed(() => {
    const { value: { chainId } = { chainId: '' } } = currentNetwork

    const queries: QFQueryOptions[] & { profileAddress?: Address } = (
      profileAddress
        ? [
            {
              // 0
              queryKey: ['getBalance', profileAddress],
              queryFn: async () => {
                const { getBalance } = useWeb3(PROVIDERS.RPC)
                return profileAddress ? await getBalance(profileAddress) : 0
              },
              refetchInterval: 120_000,
              staleTime: 250,
            },
            // 1
            queryGetData({
              chainId,
              address: profileAddress,
              keyName: 'LSP3Profile',
              process: data => browserProcessMetadata(data, keccak256),
              enabled: enableRpc,
            }),
            // 2
            queryGetData({
              chainId,
              address: profileAddress,
              keyName: 'LSP5ReceivedAssets[]',
              refetchInterval: 120_000,
              staleTime: 250,
              enabled: enableRpc,
            }),
            // 3
            queryGetData({
              chainId,
              address: profileAddress,
              keyName: 'LSP12IssuedAssets[]',
              refetchInterval: 120_000,
              staleTime: 250,
              enabled: enableRpc,
            }),
            {
              // 4
              queryKey: ['profileResolve', chainId, profileAddress],
              queryFn: async () => {
                return await resolveProfile(profileAddress)
              },
              refetchInterval: 120_000,
              staleTime: 250,
              enabled: enableRpc,
            },
            // 5-10
            ...interfacesToCheck.map(({ interfaceId }) =>
              queryCallContract({
                chainId,
                address: profileAddress as Address,
                method: 'supportsInterface(bytes4)',
                args: [interfaceId],
              })
            ),
          ]
        : []
    ) as QFQueryOptions[] & { profileAddress?: Address }
    queries.profileAddress = profileAddress
    return queries
  })

  // we call Graph to get all data before enabling RPC calls
  if (profileAddress) {
    GqlProfile({
      id: profileAddress.toLowerCase(),
    }).then(({ profile }: ProfileQuery) => {
      // 1 LSP3Profile
      const profileDataKey = queries.value[1].queryKey
      const profileData: LSP3ProfileMetadataJSON = {
        LSP3Profile: validateLsp3Metadata({
          name: profile?.name || '',
          backgroundImage: profile?.backgroundImages || [],
          profileImage: profile?.profileImages,
          description: profile?.description,
          // @ts-ignore // TODO remove this when Graph is updated with missing field
          tags: profile?.tags,
          avatar: profile?.avatars, // TODO properly re-map avatars from Graph when they are supported
          links: profile?.links,
        }),
      }

      queryClient.setQueryData(profileDataKey, profileData)

      // 2 LSP5ReceivedAssets
      const receivedAssetsKey = queries.value[2].queryKey
      const receivedAssets: Address[] | undefined =
        profile?.lsp5ReceivedAssets?.map(asset => asset.id as Address)
      queryClient.setQueryData(receivedAssetsKey, receivedAssets)

      // 3 LSP12IssuedAssets
      const issuedAssetsKey = queries.value[3].queryKey
      const issuedAssets: Address[] | undefined =
        profile?.lsp12IssuedAssets?.map(asset => asset.id as Address)
      queryClient.setQueryData(issuedAssetsKey, issuedAssets)

      // 4 ProfileLink
      const profileLinkKey = queries.value[4].queryKey
      const checksummed = toChecksumAddress(profileAddress) as Address
      const profileLink: ProfileLink | undefined = {
        address: profileAddress,
        resolved: profileAddress,
        link: profile?.fullName || `${BASE_PROFILE_LINK_URL}/${checksummed}`,
        checksummed,
        isResolved: !!profile?.fullName,
      }
      queryClient.setQueryData(profileLinkKey, profileLink)

      enableRpc.value = true
    })
  }

  return useQueries({
    queries,
    combine: results => {
      const profileAddress: Address | undefined = queries.value.profileAddress
      if (!profileAddress) {
        return null
      }
      const isLoading = results.some(result => result.isLoading)
      const balance = results[0].data as string
      const profileData = results[1].data as LSP3ProfileMetadataJSON
      const receivedAssets = results[2].data as Address[]
      const issuedAssets = results[3].data as Address[]
      const profileLink = (results[4].data as ProfileLink) || {}
      const { supportsInterfaces, standard } = interfacesToCheck.reduce(
        (
          { supportsInterfaces, standard },
          { interfaceId, standard: _standard },
          index
        ) => {
          const supports = results[index + 5].data as boolean
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
      const { name, profileImage, backgroundImage, links, description, tags } =
        profileData?.LSP3Profile || {}

      const profile = {
        isLoading,
        address: profileAddress,
        name,
        standard: standard as Standard,
        supportsInterfaces,
        receivedAssets,
        issuedAssets,
        profileImage,
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

/**
 * Get profile that is connected to dApp
 *
 * @returns
 */
const connectedProfile = () => {
  const { connectedProfileAddress } = storeToRefs(useAppStore())
  return getProfile(connectedProfileAddress)
}

/**
 * Get profile that is currently viewed in dApp
 *
 * @returns
 */
const viewedProfile = () => {
  const viewedProfileAddress = getCurrentProfileAddress()
  return getProfile(viewedProfileAddress)
}

export function useProfile() {
  return {
    getProfile,
    connectedProfile,
    viewedProfile,
  }
}
