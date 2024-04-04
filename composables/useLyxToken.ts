export const useLyxToken = () => {
  const connectedProfile = useProfile().connectedProfile()
  const { currentNetwork } = storeToRefs(useAppStore())

  return computed(
    () =>
      ({
        tokenName: currentNetwork.value.token.name,
        tokenSymbol: currentNetwork.value.token.symbol,
        isNativeToken: true,
        decimals: ASSET_LYX_DECIMALS,
        balance: connectedProfile.value?.balance
      }) as Asset
  )
}
