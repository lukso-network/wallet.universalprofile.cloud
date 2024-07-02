export function useAsset() {
  return (
    address?: MaybeRef<Address | undefined>,
    tokenId?: MaybeRef<string | undefined>
  ) => {
    const { isRpc } = useDataProvider()

    if (isRpc) {
      return useAssetRpc()(address, tokenId)
    }

    return useAssetGraph()(address, tokenId)
  }
}
