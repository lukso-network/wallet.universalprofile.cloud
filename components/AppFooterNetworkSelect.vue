<script setup lang="ts">
import type { SelectStringOption } from '@lukso/web-components'

const networks = ref<SelectStringOption[]>()
const selectedNetwork = ref<SelectStringOption>()
const { currentNetwork } = storeToRefs(useAppStore())
const { isMobileOrTablet } = useDevice()
const networkConfig = useNetworkConfig()

onMounted(() => {
  networks.value = networkConfig.map((network) => {
    return {
      id: network.chainId,
      value: network.name
    }
  })
})

watchEffect(() => {
  selectedNetwork.value = {
    id: currentNetwork.value.chainId,
    value: currentNetwork.value.name
  }
})

/**
 * When user selects a network from the dropdown, show a modal to confirm the network switch.
 *
 * @param event
 */
const handleNetworkChange = async (event: CustomEvent) => {
  const selectedNetwork = event.detail.value as SelectStringOption
  const { showModal } = useModal()

  showModal({
    template: 'SwitchApplicationNetwork',
    data: {
      name: selectedNetwork.value,
      chainId: selectedNetwork.id
    }
  })
}
</script>

<template>
  <lukso-select
    :value="JSON.stringify(selectedNetwork)"
    :options="JSON.stringify(networks)"
    :open-top="!isMobileOrTablet ? true : undefined"
    :is-full-width="isMobileOrTablet ? true : undefined"
    class="sm:w-40"
    @on-select="handleNetworkChange"
  ></lukso-select>
</template>
