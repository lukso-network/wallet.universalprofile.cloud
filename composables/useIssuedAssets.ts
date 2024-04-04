import { useQueries } from '@tanstack/vue-query'
import { isAddress } from 'web3-validator'

import type { QFQueryOptions } from '@/utils/queryFunctions'

function getIssuedAssets(_profiles: MaybeRef<Address[]>) {
  const { currentNetwork } = storeToRefs(useAppStore())
  const queries: ComputedRef<
    QFQueryOptions[] & {
      profiles: Address[]
      allProfiles: (Address | undefined | null)[]
    }
  > = computed(() => {
    const chainId = currentNetwork.value?.chainId || ''
    const allProfiles: (Address | null)[] =
      (isRef(_profiles) ? _profiles.value : _profiles) || []
    const profiles: Address[] = allProfiles.filter(
      (profile) => profile && isAddress(profile)
    ) as Address[]
    const queries: QFQueryOptions[] & {
      profiles: Address[]
      allProfiles: (Address | undefined | null)[]
    } = profiles.map((profile) =>
      queryGetData({
        chainId,
        address: profile as Address,
        keyName: 'LSP12IssuedAssets[]',
        refetchInterval: 120_000,
        staleTime: 250
      })
    ) as QFQueryOptions[] & {
      profiles: Address[]
      allProfiles: (Address | undefined | null)[]
    }
    queries.allProfiles = allProfiles
    queries.profiles = profiles
    return queries
  })
  return useQueries({
    queries,
    combine: (results) => {
      const allProfiles = queries.value.allProfiles
      const profiles = queries.value.profiles
      const output = Object.fromEntries(
        results.map((result, index) => {
          const set = new Set((result.data as Address[]) || [])
          const profile = profiles[index]
          return [profile, set]
        })
      )
      for (const profile of allProfiles) {
        if (profile && !output[profile]) {
          output[profile] = new Set()
        }
      }
      return output
    }
  })
}

export function useIssuedAssets() {
  return {
    getIssuedAssets,
    validateAssets(
      _profiles: MaybeRef<Address[]>,
      _assetAddress?: MaybeRef<Address | undefined>
    ): ComputedRef<Map<Address, boolean>> {
      const profiles = computed(() =>
        isRef(_profiles) ? _profiles.value : _profiles
      )
      const issuedAssets = getIssuedAssets(profiles)
      return computed(() => {
        const assetAddress = isRef(_assetAddress)
          ? _assetAddress.value
          : _assetAddress
        return new Map<Address, boolean>(
          Object.entries(issuedAssets.value || {})?.map(([address, assets]) => [
            address as Address,
            assetAddress ? assets.has(assetAddress) : false
          ])
        )
      })
    }
  }
}
