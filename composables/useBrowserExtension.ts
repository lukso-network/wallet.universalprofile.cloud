import { PROVIDERS, STORAGE_KEY } from '@/types/enums'
import { profileRoute } from '@/shared/routes'
import { INJECTED_PROVIDER } from '@/shared/config'

const connect = async () => {
  const { showModal } = useModal()
  const { formatMessage } = useIntl()
  const { reloadProfile } = useProfileStore()
  const { setIsConnected, reloadConnectedProfile } = useConnectionStore()

  // when no extension installed we show modal
  if (!INJECTED_PROVIDER) {
    return showModal({
      title: formatMessage('web3_connect_error_title'),
      message: formatMessage('web3_connect_no_extension'),
    })
  }

  try {
    const { accounts, requestAccounts } = useWeb3(PROVIDERS.INJECTED)

    let address = await accounts()

    if (!address) {
      ;[address] = await requestAccounts()
    }

    setItem(STORAGE_KEY.CONNECTED_ADDRESS, address)
    const profile = await fetchProfile(address)
    reloadProfile(address, profile)
    reloadConnectedProfile(address, profile)
    setIsConnected(true)
    await navigateTo(profileRoute(address))
  } catch (error: any) {
    console.error(error)
    disconnect()

    // errors that have a code or message
    if (error && error.code) {
      switch (error.code) {
        case 4001:
          return showModal({
            title: formatMessage('web3_connect_error_title'),
            message: formatMessage('web3_connect_error_rejected_request'),
          })

        case -32005:
          return showModal({
            title: formatMessage('web3_connect_error_title'),
            message: formatMessage('web3_connect_error_pending_request'),
          })
        default:
          return showModal({
            title: formatMessage('web3_connect_error_title'),
            message: error.message,
          })
      }
    }

    // unknowns errors
    return showModal({
      title: formatMessage('web3_connect_error_title'),
      message: formatMessage('web3_connect_error'),
    })
  }
}

const disconnect = () => {
  useConnectionStore().setIsConnected(false)
  useLocalStorage().removeItem(STORAGE_KEY.CONNECTED_ADDRESS)
}

const providerEvents = async (provider: any) => {
  const { disconnect } = useBrowserExtension()
  const { reloadProfile } = useProfileStore()
  const { status, reloadConnectedProfile } = useConnectionStore()

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length) {
      const address = accounts[0]
      assertAddress(address)

      // if user is already connected we need to update Local Storage key
      if (status.isConnected) {
        setItem(STORAGE_KEY.CONNECTED_ADDRESS, address)
      }

      await navigateTo(profileRoute(address))
      const profile = await fetchProfile(address)
      reloadProfile(address, profile)
      reloadConnectedProfile(address, profile)
    } else {
      // when user remove connection with dApp we disconnect
      disconnect()
    }
  }

  onMounted(async () => {
    provider?.on?.('accountsChanged', handleAccountsChanged)
  })

  onUnmounted(() => {
    provider?.removeListener?.('accountsChanged', handleAccountsChanged)
  })
}

export const useBrowserExtension = () => {
  return {
    connect,
    disconnect,
    providerEvents,
  }
}
