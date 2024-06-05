import { useQueries } from '@tanstack/vue-query'
import { decodeParameter } from 'web3-eth-abi'
import { keccak256 } from 'web3-utils'

import { browserProcessMetadata } from '@/utils/processMetadata'
import {
  Priorities,
  type QFQueryOptions,
  queryNull,
} from '@/utils/queryFunctions'

import type {
  LSP4DigitalAssetMetadata,
  LSP4DigitalAssetMetadataJSON,
} from '@/types/asset'

export function useToken() {
  return (_token?: MaybeRef<Asset | null | undefined>) => {
    const connectedProfile = useProfile().connectedProfile()
    const profileAddress = computed(() => connectedProfile.value?.address)
    const { currentNetwork } = storeToRefs(useAppStore())
    const { value: { chainId } = { chainId: '' } } = currentNetwork
    const queries = computed(() => {
      const token: Asset | null = isRef(_token)
        ? _token.value || null
        : _token || null
      const { address, tokenId, tokenDataURL, tokenIdFormat } = token || {}
      const queries: QFQueryOptions[] & { token: Asset | null } = (
        address
          ? [
              queryCallContract({
                // 0
                chainId,
                address,
                method: 'owner()',
              }),
              queryGetData({
                // 1
                chainId,
                address,
                keyName: 'LSP4Creators[]',
              }),
              queryCallContract({
                // 2
                chainId,
                address,
                method: 'decimals()',
              }),
              queryCallContract({
                // 3
                chainId,
                address,
                method: 'tokenIdsOf(address)',
                args: [profileAddress.value || address],
                staleTime: 250,
              }),
              tokenId && tokenIdFormat === 2
                ? queryGetData({
                    // 4
                    chainId,
                    address: (
                      decodeParameter('address', tokenId) as string
                    ).toLowerCase() as Address,
                    keyName: 'LSP8ReferenceContract',
                  })
                : queryNull(),
              tokenId && tokenIdFormat === 2
                ? queryGetData({
                    // 5
                    chainId,
                    address: (
                      decodeParameter('address', tokenId) as string
                    ).toLowerCase() as Address,
                    keyName: 'LSP4Creators[]',
                  })
                : queryNull(),
              queryGetData({
                // 6
                chainId,
                address,
                keyName: 'LSP4Metadata',
                process: data => browserProcessMetadata(data, keccak256),
                aggregateLimit: 1,
                priority: Priorities.Low,
              }),
              tokenId
                ? queryGetData({
                    // 7
                    chainId,
                    address,
                    tokenId,
                    keyName: 'LSP4Metadata',
                    process: data => browserProcessMetadata(data, keccak256),
                    aggregateLimit: 1,
                    priority: Priorities.Low,
                  })
                : queryNull(),
              tokenId
                ? {
                    // 8
                    queryKey: [
                      'tokenJSON',
                      chainId,
                      token?.address,
                      tokenId,
                      tokenDataURL,
                    ],
                    queryFn: async () => {
                      if (tokenDataURL) {
                        const url = tokenDataURL.replace(
                          /^ipfs:\/\//,
                          `${LUKSO_PROXY_API}/ipfs/`
                        )
                        return await fetch(url, { redirect: 'follow' })
                          .then(response => {
                            if (!response.ok) {
                              throw new Error('Unable to fetch')
                            }
                            return response.json()
                          })
                          .then(async data => {
                            return await browserProcessMetadata(data, keccak256)
                          })
                          .catch(error => {
                            console.error('Error fetching token data', error)
                            throw error
                          })
                      }
                      return null
                    },
                  }
                : queryNull(),
              tokenId && tokenIdFormat === 2
                ? queryGetData({
                    // 9
                    chainId,
                    address: (
                      decodeParameter('address', tokenId) as string
                    ).toLowerCase() as Address,
                    keyName: 'LSP4Metadata',
                    process: data => browserProcessMetadata(data, keccak256),
                    aggregateLimit: 1,
                    priority: Priorities.Low,
                  })
                : queryNull(),
            ]
          : []
      ) as QFQueryOptions[] & { token: Asset | null }
      queries.token = token
      return queries
    })
    return useQueries({
      queries,
      combine: results => {
        const token: Asset | null = queries.value.token as Asset
        if (!token) {
          return null
        }

        if (results.length === 0) {
          return { isLoading: true } as Asset
        }

        const resultsWithQuery = results.map((result, index) => {
          const query = queries.value[index]
          return { result, query }
        })
        const metadataResults = resultsWithQuery.slice(6)
        const nonMetadataResults = resultsWithQuery.slice(0, 6)
        const isLoading =
          token.isLoading ||
          nonMetadataResults.some(({ result }) => result.isLoading)

        const owner = results[0].data as string
        const tokenCreators = results[1].data as string[]
        const decimals = Number.parseInt((results[2].data as string) || '0')
        const tokenIdCreatorsCount = results[3]?.data || 0
        const tokenIdsOf = results[3]?.data as string[]
        const referenceContract = results[4]?.data as any
        const lsp7Creators = results[5]?.data as Address[]

        const _assetData = results[6]?.data as any
        const forTokenData = results[7]?.data as any
        const baseURIData = results[8]?.data as any
        const lsp7Data = results[9]?.data as any

        const isMetadataLoading = metadataResults.some(({ result }) => {
          return result.isLoading
        })
        const tokenData: LSP4DigitalAssetMetadataJSON = !isMetadataLoading
          ? lsp7Data || forTokenData || baseURIData || _assetData
          : undefined
        let resolvedMetadata: LSP4DigitalAssetMetadata | undefined
        let assetData: LSP4DigitalAssetMetadata | undefined
        if (tokenData) {
          resolvedMetadata = prepareMetadata(tokenData)
        }
        if (_assetData) {
          assetData = prepareMetadata(_assetData)
        }
        const asset = {
          ...token,
          isLoading,
          isAssetLoading: token.isLoading,
          isMetadataLoading,
          owner,
          tokenCreators,
          tokenIdCreatorsCount,
          tokenIdsOf,
          lsp7Creators,
          rawMetadata: {
            lsp7Data,
            baseURIData,
            forTokenData,
            assetData,
          },
          assetData,
          resolvedMetadata,
          referenceContract,
          decimals,
          tokenName: resolvedMetadata?.name
            ? resolvedMetadata?.name
            : token.tokenName,
        } as Asset
        if (!isLoading && tokenLog.enabled) {
          tokenLog('token', asset)
        }
        return asset
      },
    })
  }
}
