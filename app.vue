<script setup lang="ts">
import { SUPPORTED_NETWORK_IDS } from '@/shared/config'
import { INJECTED_PROVIDER } from '@/shared/provider'
import { assertString } from '@/utils/validators'

if (typeof window !== 'undefined') {
  import('@lukso/web-components')
}

const { addWeb3, getWeb3 } = useWeb3Store()
const { getNetworkById } = useAppStore()
const { isLoadedApp, selectedChainId, isSearchOpen } = storeToRefs(
  useAppStore()
)
const { addProviderEvents, removeProviderEvents, disconnect } =
  useBrowserExtension()

const setupTranslations = () => {
  useIntl().setupIntl(defaultConfig)
}

/**
 * Create web3 instances
 * INJECTED - from browser extension
 * RPC - from RPC endpoint
 */
const setupWeb3Instances = async () => {
  const provider = INJECTED_PROVIDER

  if (provider) {
    // for chain interactions through wallet
    addWeb3(PROVIDERS.INJECTED, provider)
    await addProviderEvents(provider)
    // expose web3 instance to global scope for console access
    window.web3 = getWeb3(PROVIDERS.INJECTED)
  } else {
    console.error('No browser extension provider found')
  }

  const rpcNode = await selectRpcNode()

  if (rpcNode) {
    // for chain interactions through RPC endpoint
    addWeb3(PROVIDERS.RPC, rpcNode?.host, { headers: rpcNode.headers })
  }
}

/**
 * Check if connection to the extension has expired
 * Every connection has expiration time that is stored in local storage
 */
const checkConnectionExpiry = () => {
  const expiryCheck = () => {
    const expiryDate = getItem(STORAGE_KEY.CONNECTION_EXPIRY)

    try {
      assertString(expiryDate)
      const expiryDateParsed = Number(expiryDate)

      if (expiryDateParsed < Date.now()) {
        disconnect()
      }
    } catch (error) {}
  }

  expiryCheck() // initial check on app load
  setInterval(expiryCheck, CONNECTION_EXPIRY_CHECK_INTERVAL_MS)
}

/**
 * Setup currencies that are fetched from cryptocompare API
 */
const setupCurrencies = async () => {
  const { currencyList } = storeToRefs(useCurrencyStore())
  const { fetchCurrencies } = useCurrency()

  currencyList.value = await fetchCurrencies()
}

/**
 * Setup network based on `network` query param.
 * Check if dApp network match with extension and if not show network switch modal.
 */
const setupNetwork = async () => {
  const network = useRouter().currentRoute.value.query?.network

  if (!network) {
    await checkExtensionNetwork()
    return
  }

  if (SUPPORTED_NETWORK_IDS.includes(network)) {
    selectedChainId.value = getNetworkById(network).chainId
    await checkExtensionNetwork()
  } else {
    console.warn(
      `Invalid network: ${network}, valid networks are ${SUPPORTED_NETWORK_IDS.join(
        ', '
      )}`
    )
  }
}

/**
 * Load connected profile data, this is mainly when refreshing asset details
 * where we don't have reference to viewed profile
 */
const setupConnectedProfile = async () => {
  const viewedProfileAddress =
    useRouter().currentRoute.value.params?.profileAddress
  const { connectedProfileAddress } = storeToRefs(useAppStore())

  // no need to load same profile again
  if (viewedProfileAddress === connectedProfileAddress.value) {
    return
  }

  try {
    assertAddress(connectedProfileAddress.value)
    // await setupProfile(connectedProfileAddress.value)
  } catch (error) {
    // if we can't find connected profile in the index we should disconnect it
    // it also happens when user redirect to different network through query param while being connected
    if (error instanceof NotFoundIndexError) {
      disconnect()
    }
  }
}

/**
 * Check if user bought LYX
 */
const checkBuyLyx = () => {
  // status and orderId are passed in redirect url query params after Transak order
  const status = useRouter().currentRoute.value.query?.status as
    | string
    | undefined
  const orderId = useRouter().currentRoute.value.query?.orderId as
    | string
    | undefined

  if (status && orderId) {
    genericLog('Transak order', orderId, status)

    const { showModal } = useModal()
    const { formatMessage } = useIntl()

    showModal({
      icon: '/images/lukso.svg',
      title: formatMessage('transak_success_title'),
      message: formatMessage('transak_success_message'),
      confirmButtonText: formatMessage('transak_success_button'),
      data: {
        status,
        orderId
      }
    })
  }
}

onMounted(async () => {
  setupTranslations()
  setupNetwork()
  await setupWeb3Instances()
  checkConnectionExpiry()
  await setupConnectedProfile()
  isLoadedApp.value = true
  await setupCurrencies()
  window.scrollTo(0, 0)
  checkBuyLyx()
})

onUnmounted(() => {
  const provider = INJECTED_PROVIDER
  removeProviderEvents(provider)
})

useHead({
  bodyAttrs: {
    // @ts-ignore
    class: computed(() => {
      const bodyClass = []

      // prevent window scroll when modal is open
      if (isSearchOpen.value) {
        bodyClass.push('!overflow-hidden')
      }

      return bodyClass.join(' ')
    })
  },
  script: [
    {
      innerHTML: `if('serviceWorker' in navigator){window.addEventListener('load', () => {navigator.serviceWorker.register('/sw.js', { scope: '/' })})}`
    }
  ]
})
</script>

<template>
  <NuxtPwaManifest />
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AppModal />
    <!-- <VueQueryDevtools /> -->
  </div>
</template>
