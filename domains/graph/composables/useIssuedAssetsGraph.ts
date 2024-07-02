const getIssuedAssets = (
  creators: Creator[]
): {
  [k: Address]: Set<`0x${string}`>
} => {
  const issuedAssets: {
    [k: Address]: Set<`0x${string}`>
  } = {}

  for (const creator of creators) {
    if (creator.issuedAssets && creator.address) {
      for (const asset of creator.issuedAssets) {
        if (!issuedAssets[creator.address]) {
          issuedAssets[creator.address] = new Set()
        }

        issuedAssets[creator.address].add(asset)
      }
    }
  }

  return issuedAssets
}

export function useIssuedAssetsGraph() {
  return {
    validateAssets(
      _creators: MaybeRef<Creator[]>,
      _assetAddress?: MaybeRef<Address | undefined>
    ): ComputedRef<Map<Address, boolean>> {
      const creators = unref(_creators)
      const issuedAssets = getIssuedAssets(creators)

      return computed(() => {
        const assetAddress = unref(_assetAddress)

        return new Map<Address, boolean>(
          Object.entries(issuedAssets || {})?.map(([address, assets]) => [
            address as Address,
            assetAddress ? assets.has(assetAddress) : false,
          ])
        )
      })
    },
  }
}
