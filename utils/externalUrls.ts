/**
 * URL to transaction on blockchain explorer
 *
 * @param transactionHash
 * @returns
 */
export const explorerTransactionUrl = (transactionHash: string) => {
  const { currentNetwork } = storeToRefs(useAppStore())

  return `${currentNetwork.value.explorerUrl}/tx/${transactionHash}`
}

/**
 * URL to contract on blockchain explorer
 *
 * @param address
 * @returns
 */
export const explorerContractUrl = (address?: string | Address) => {
  const { currentNetwork } = storeToRefs(useAppStore())

  return `${currentNetwork.value.explorerUrl}/address/${address}`
}

/**
 * URL to Discovery dApp aka. universalprofile.cloud
 *
 * @returns
 */
export const discoveryDappUrl = () => {
  const { currentNetwork } = storeToRefs(useAppStore())

  return `${BASE_UP_CLOUD_URL}?network=${currentNetwork.value.id}`
}

/**
 * URL to Transak to buy LYX
 *
 * @returns
 */
export const transakBuyLyxUrl = () => {
  const connectedProfile = useProfile().connectedProfile()
  const { currentNetwork } = storeToRefs(useAppStore())
  const { formatMessage } = useIntl()
  const { $config } = useNuxtApp()

  const queryParams = {
    apiKey: $config.public.TRANSAK_API_KEY,
    network: 'lukso',
    defaultCryptoCurrency: 'LYX',
    productsAvailed: 'BUY',
    walletAddress: connectedProfile?.value?.address,
    isFeeCalculationHidden: 'true',
    defaultPaymentMethod: 'credit_debit_card',
    hideMenu: 'true',
    redirectURL: `${BASE_WALLET_URL}/${connectedProfile?.value?.address}?network=${currentNetwork.value.id}`,
    themeColor: '243542', // neutral-20
    exchangeScreenTitle: formatMessage('transak_widget_title')
  }

  const queryParamsString = Object.entries(queryParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&')

  return `${TRANSAK_HOST}/?${queryParamsString}`
}

/**
 * URL to Relayer dashboard on my.universalprofile.cloud
 *
 * @returns
 */
export const relayerDappDashboardUrl = () => {
  const { currentNetwork } = storeToRefs(useAppStore())

  return `${BASE_RELAYER_DAPP_URL}/dashboard?network=${currentNetwork.value.id}`
}
