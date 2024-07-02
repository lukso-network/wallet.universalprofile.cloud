export function useProfileAssets() {
  return (profileAddress?: MaybeRef<Address | null>) => {
    const { isRpc } = useDataProvider()

    if (isRpc) {
      return useProfileAssetsRpc()(profileAddress)
    }

    return useProfileAssetsGraph()({ profileAddress })
  }
}
