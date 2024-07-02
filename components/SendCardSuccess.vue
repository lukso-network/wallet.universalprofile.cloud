<script setup lang="ts">
const { setStatus, clearSend } = useSendStore()
const { asset: sendAsset, transactionHash } = storeToRefs(useSendStore())
const connectedProfile = useProfile().connectedProfile()
const asset = useToken()(
  useAsset()(sendAsset.value?.address, sendAsset.value?.tokenId)
)

const handleSendMore = () => {
  if (!isToken(asset.value) || hasBalance(asset.value)) {
    navigateTo({
      path: sendRoute(connectedProfile.value?.address),
    })
  }

  clearSend()
  setStatus('draft')
}

const handleOpenProfile = () => {
  navigateTo(profileRoute(connectedProfile.value?.address))
}
</script>

<template>
  <lukso-card variant="with-header" is-full-width>
    <div slot="header" class="flex flex-col px-6 py-10">
      <SendCardHeader />
    </div>
    <div slot="content" class="flex flex-col items-center p-8">
      <div class="heading-inter-17-semi-bold">
        {{ $formatMessage('send_success_title') }}
      </div>
      <lukso-icon
        name="progress-complete"
        size="x-large"
        class="my-6"
      ></lukso-icon>
      <lukso-button variant="secondary" @click="handleSendMore">{{
        $formatMessage('send_success_button')
      }}</lukso-button>
    </div>
  </lukso-card>
  <a
    v-if="transactionHash"
    class="paragraph-inter-12-medium mt-5 block text-purple-51 underline hover:text-purple-41"
    :href="explorerTransactionUrl(transactionHash)"
    target="_blank"
    >{{ $formatMessage('send_card_view_in_explorer') }}</a
  >
  <lukso-button
    class="mt-8"
    size="small"
    variant="secondary"
    @click="handleOpenProfile"
  >
    <lukso-icon name="return-left" size="small" class="mr-2"></lukso-icon>
    {{ $formatMessage('send_card_return_to_profile') }}
  </lukso-button>
</template>
