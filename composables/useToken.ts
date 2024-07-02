export function useToken() {
  return (asset?: MaybeRef<Asset | null | undefined>) => {
    const { isRpc } = useDataProvider()

    if (isRpc) {
      return useTokenRpc()(asset)
    }

    // since in graph we already have all the data we pass through
    return toRef(asset)
  }
}
