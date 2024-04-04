<script setup lang="ts">
import { INJECTED_PROVIDER } from '@/shared/provider'

const { currentNetwork } = useAppStore()

type Props = {
  closeModal: () => void
}

const props = defineProps<Props>()

const handleChangeNetwork = async () => {
  try {
    await INJECTED_PROVIDER?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: currentNetwork.chainId }]
    })
  } catch (error: unknown) {
    console.error(error)
  } finally {
    props.closeModal()
  }
}
</script>

<template>
  <div class="flex flex-col rounded-12 bg-neutral-98 p-6 text-center">
    <img
      src="/images/switch-network.png"
      class="mx-auto mb-6 w-[150px]"
      alt=""
    />
    <div class="heading-inter-21-semi-bold pb-4">
      {{ $formatMessage('modal_switch_network_title') }}
    </div>
    <div class="paragraph-inter-16-regular">
      <lukso-sanitize
        :html-content="
          $formatMessage('modal_switch_network_description', {
            name: `<strong>${currentNetwork.name}</strong>`,
          })
        "
      ></lukso-sanitize>
    </div>
    <div class="grid grid-cols-[max-content,auto]">
      <lukso-button variant="text" @click="closeModal" class="mt-6">
        {{ $formatMessage('modal_switch_network_cancel') }}
      </lukso-button>
      <lukso-button
        variant="landing"
        is-full-width
        @click="handleChangeNetwork"
        class="mt-6"
      >
        {{ $formatMessage('modal_switch_network_confirm') }}
      </lukso-button>
    </div>
  </div>
</template>
