import { DEFAULT_NETWORK_ID, NETWORKS } from '@/shared/config'

/**
 * Connection store
 * Keeps the information about connected profile and it's status
 *
 */
export const useAppStore = defineStore('app', () => {
  const networks = ref<NetworkInfo[]>(NETWORKS)
  const selectedNetwork = ref<NetworkId>(DEFAULT_NETWORK_ID)
  const modal = ref<Modal>()

  // --- getters

  const getNetwork = (networkId: NetworkId): NetworkInfo => {
    const network = networks.value.find(network => network.id === networkId)

    // fallback to default network
    if (!network) {
      return networks.value.find(
        network => network.id === DEFAULT_NETWORK_ID
      ) as NetworkInfo
    }

    return network
  }

  const currentNetwork = computed(() => getNetwork(selectedNetwork.value))

  // --- actions

  const setModal = (newModal: Modal) => {
    modal.value = newModal
  }

  return {
    networks,
    selectedNetwork,
    getNetwork,
    modal,
    setModal,
    currentNetwork,
  }
})
