export function useProfileHolds() {
  return (profileAddress?: MaybeRef<Address | null>) => {
    const { isRpc } = useDataProvider()

    if (isRpc) {
      return useProfileAssetsRpc()(profileAddress)
    }

    return useProfileHoldsGraph()({ profileAddress })
  }
}
