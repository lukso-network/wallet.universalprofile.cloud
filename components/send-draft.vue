<script setup lang="ts">
import { fromWei, isAddress } from 'web3-utils'
import { storeToRefs } from 'pinia'

const { profile: connectedProfile } = useConnectionStore()
const { asset, receiverAddress, receiver, receiverError, amount, onSend } =
  storeToRefs(useSendStore())
const isReceiverLoading = ref<boolean>(false)

const handleReceiverChange = async (event: CustomEvent) => {
  const address = event.detail.value
  receiverAddress.value = address

  if (!isAddress(address)) {
    receiverError.value = 'Invalid address'
    receiver.value = undefined
    return
  } else {
    receiverError.value = ''
  }

  const { fetchProfile } = useErc725()

  try {
    isReceiverLoading.value = true
    receiver.value = await fetchProfile(address)
  } catch (error) {
    console.error(error)
  } finally {
    isReceiverLoading.value = false
  }
}

const handleAmountChange = (event: CustomEvent) => {
  amount.value = event.detail.value
}

const handleSend = () => {
  onSend.value && onSend.value()
}
</script>

<template>
  <lukso-card
    variant="profile-2"
    :background-url="connectedProfile.backgroundImageUrl"
    :profile-url="connectedProfile.profileImageUrl"
    :profile-address="connectedProfile.address"
    is-full-width
  >
    <div slot="content" class="p-6">
      <div
        class="border border-neutral-90 rounded-12 flex justify-center items-center"
      >
        <div class="p-4">
          <div class="shadow-neutral-above-shadow-1xl rounded-full">
            <lukso-profile
              size="small"
              :profile-url="asset?.icon"
            ></lukso-profile>
          </div>
        </div>
        <div class="flex flex-col w-full">
          <div
            class="border-b border-b-neutral-90 border-l border-l-neutral-90 paragraph-inter-14-semi-bold px-4 py-3 flex justify-between items-center"
          >
            {{ asset?.name }}
            <lukso-icon name="arrow-down-lg" class="hidden"></lukso-icon>
          </div>
          <div class="border-l border-l-neutral-90">
            <lukso-input
              placeholder="0"
              :value="amount"
              :unit="
                $formatMessage('profile_balance_of', {
                  balance: $formatNumber(
                    fromWei(asset?.amount || '0', 'ether')
                  ),
                  symbol: asset?.symbol || '',
                })
              "
              borderless
              is-full-width
              @on-input="handleAmountChange"
            ></lukso-input>
          </div>
        </div>
      </div>
    </div>
    <div slot="bottom" class="p-6 flex flex-col items-center">
      <div class="relative">
        <lukso-profile
          v-if="!isReceiverLoading"
          size="large"
          :profile-url="receiver?.profileImageUrl"
          :profile-address="receiverAddress"
          :has-identicon="receiverError ? undefined : 'true'"
          class="mb-2"
        ></lukso-profile>
        <div
          v-else
          class="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center"
        >
          <lukso-icon name="progress-indicator" size="x-large"></lukso-icon>
        </div>
      </div>
      <lukso-username
        v-if="receiver?.name || isReceiverLoading"
        :name="receiver?.name"
        size="small"
      ></lukso-username>
      <div v-else>- -</div>
      <lukso-input
        name="receiver"
        :value="receiverAddress"
        :placeholder="$formatMessage('send_input_placeholder')"
        is-full-width
        class="w-full mt-4"
        :error="receiverError"
        @on-input="handleReceiverChange"
      ></lukso-input>
      <lukso-button
        class="w-full mt-4"
        :loading="isReceiverLoading"
        :disabled="
          !receiverAddress || receiverError || !amount ? true : undefined
        "
        @click="handleSend"
        is-full-width
        >{{
          $formatMessage('send_button', {
            amount: $formatNumber(amount || '0'),
            symbol: asset?.symbol || '',
          })
        }}</lukso-button
      >
    </div>
  </lukso-card>
</template>
