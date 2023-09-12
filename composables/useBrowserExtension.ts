import { PROVIDERS, STORAGE_KEY } from '@/types/enums'
import { profileRoute } from '@/shared/routes'
import { INJECTED_PROVIDER, CONNECTION_EXPIRY_TIME_MS } from '@/shared/config'
import { EoAError, InterfaceError } from '@/shared/errors'
import useWeb3Onboard from '@/composables/useWeb3Onboard'

const { setupWeb3Onboard, disconnect: disconnectWeb3Onboard } = useWeb3Onboard()

const setConnectionExpiry = () => {
  const currentDate = Date.now()
  const expiryDate = currentDate + CONNECTION_EXPIRY_TIME_MS

  setItem(STORAGE_KEY.CONNECTION_EXPIRY, expiryDate.toString())
}

const connect = async () => {
  const { showModal } = useModal()
  const { formatMessage } = useIntl()
  const { reloadProfile } = useProfileStore()
  const { setStatus, reloadConnectedProfile } = useConnectionStore()

  const web3Store = useWeb3Store()

  const primaryWallet = await setupWeb3Onboard()
  const provider = primaryWallet.provider as any

  web3Store.addWeb3(PROVIDERS.INJECTED, provider)
  setStatus('isConnecting', true)

  try {
    const { accounts, requestAccounts } = useWeb3(PROVIDERS.INJECTED)

    let address = await accounts()

    if (!address) {
      ;[address] = await requestAccounts()
    }

    setItem(STORAGE_KEY.CONNECTED_ADDRESS, address)
    const profile = await fetchProfile(address)
    reloadProfile(profile)
    reloadConnectedProfile(address, profile)
    setStatus('isConnected', true)
    setConnectionExpiry()
    await navigateTo(profileRoute(address))
  } catch (error: any) {
    console.error(error)
    disconnect()

    // known errors
    if (error instanceof EoAError) {
      return showModal({
        title: formatMessage('web3_connect_error_title'),
        message: formatMessage('web3_eoa_error_message'),
      })
    }

    if (error instanceof InterfaceError) {
      return showModal({
        title: formatMessage('web3_connect_error_title'),
        message: formatMessage('web3_interface_error_message'),
      })
    }

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
  } finally {
    setStatus('isConnecting', false)
  }
}

const disconnect = async () => {
  await disconnectWeb3Onboard()
  const { setStatus } = useConnectionStore()
  const { removeItem } = useLocalStorage()

  setStatus('isConnected', false)
  removeItem(STORAGE_KEY.CONNECTED_ADDRESS)
  removeItem(STORAGE_KEY.CONNECTION_EXPIRY)
}

const providerEvents = async (provider: any) => {
  const { disconnect } = useBrowserExtension()
  const { reloadProfile } = useProfileStore()
  const { status, reloadConnectedProfile } = useConnectionStore()

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length) {
      const address = accounts[0]
      assertAddress(address, 'profile')

      // if user is already connected we need to update Local Storage key
      if (status.isConnected) {
        setItem(STORAGE_KEY.CONNECTED_ADDRESS, address)
      }

      await navigateTo(profileRoute(address))
      const profile = await fetchProfile(address)
      reloadProfile(profile)
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

const isUniversalProfileExtension = () => {
  return !!INJECTED_PROVIDER
}

export const useBrowserExtension = () => {
  return {
    connect,
    disconnect,
    providerEvents,
    isUniversalProfileExtension,
  }
}
