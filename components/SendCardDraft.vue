<script setup lang="ts">
const connectedProfile = useProfile().connectedProfile()
const {
  asset: sendAsset,
  receiver,
  amount,
  onSend,
} = storeToRefs(useSendStore())
const { isLoadedApp } = storeToRefs(useAppStore())
const { showModal } = useModal()
const { formatMessage } = useIntl()
const address = computed(() => sendAsset.value?.address)
const tokenId = computed(() => sendAsset.value?.tokenId)
const _asset = useToken()(useAsset()(address, tokenId))
const lyxToken = useLyxToken()

const asset = computed(() =>
  isLyx(sendAsset.value) ? lyxToken.value : _asset.value
)

const assetImage = useAssetImage(asset, isToken(asset.value), 100)

const backgroundImage = useProfileBackground(connectedProfile, 450)
const avatarImage = useProfileAvatar(connectedProfile, 80)

const handleSend = () => {
  onSend.value?.()
}

const handleSelectAssets = () => {
  showModal({
    template: 'SelectAssets',
  })
}

const handleBack = () => {
  navigateTo(profileRoute(connectedProfile?.value?.address))
}

const checkBalance = () => {
  if (asset.value?.isLoading) {
    return
  }

  if (isLyx(asset.value)) {
    return
  }

  if (
    isLsp8(asset.value) &&
    asset.value?.tokenId &&
    asset.value?.tokenIdsOf?.includes(asset.value.tokenId)
  ) {
    return
  }

  if (isLsp7(asset.value) && hasBalance(asset.value)) {
    return
  }

  showModal({
    message: formatMessage('no_asset_balance'),
  })
}

const assetTokenId = computed(() => {
  return prefixedTokenId(asset.value?.tokenId, asset.value?.tokenIdFormat, 24)
})

watch(
  () => asset.value?.isLoading,
  () => {
    checkBalance()
  }
)
</script>

<template>
  {{ sendLog('Current asset', toRaw(asset)) }}
  <lukso-card
    variant="profile-2"
    :background-url="backgroundImage?.url"
    :profile-url="avatarImage?.url"
    :profile-address="connectedProfile?.address"
    is-full-width
  >
    <div slot="header" class="text-left">
      <lukso-icon
        name="arrow-left-sm"
        class="relative z-[1] m-4 cursor-pointer rounded-full bg-neutral-100 shadow-neutral-above-shadow transition hover:scale-105 hover:shadow-neutral-above-shadow-1xl active:scale-100 active:shadow-neutral-above-shadow"
        @click="handleBack"
      ></lukso-icon>
    </div>
    <div slot="content" class="relative p-6 pt-0">
      <div
        class="relative z-[1] grid min-h-[100px] grid-cols-[max-content,auto] grid-rows-1 transition"
        :class="{
          'invisible opacity-0': !isLoadedApp,
          'visible opacity-100': isLoadedApp,
        }"
      >
        <div
          class="flex items-center justify-center rounded-[12px_0_0_12px] border border-r-0 border-neutral-90 p-4"
        >
          <div class="rounded-full shadow-neutral-above-shadow-1xl">
            <lukso-profile
              size="small"
              :profile-url="assetImage?.url"
              :profile-address="asset?.address"
              :has-identicon="isLyx(asset) ? undefined : true"
              :is-square="isCollectible(asset) ? true : undefined"
              :placeholder="
                isCollectible(asset)
                  ? undefined
                  : '/assets/images/token-default.svg'
              "
            ></lukso-profile>
          </div>
        </div>
        <div class="flex w-full flex-col">
          <div
            v-if="isLsp8(asset)"
            class="paragraph-inter-14-semi-bold grid h-full cursor-pointer grid-cols-[auto,max-content] items-center rounded-r-12 border border-neutral-90 px-4 py-3 text-left transition hover:border-neutral-35"
            @click="handleSelectAssets"
          >
            <div>
              <div
                class="flex flex-wrap items-center gap-x-1 gap-y-0.5 break-word"
              >
                <span>
                  {{ asset?.tokenName }}
                </span>
                <span class="paragraph-inter-10-semi-bold text-neutral-60">{{
                  truncate(asset?.tokenSymbol, 8)
                }}</span>
              </div>
              <div class="paragraph-ptmono-10-bold">
                {{ assetTokenId }}
              </div>
            </div>
            <lukso-icon name="arrow-down-lg"></lukso-icon>
          </div>
          <div
            v-else
            class="paragraph-inter-14-semi-bold flex h-full cursor-pointer items-center justify-between rounded-[0_12px_0_0] border border-neutral-90 px-4 py-3 transition break-word hover:border-neutral-35"
            @click="handleSelectAssets"
          >
            {{ asset?.tokenName }}
            <lukso-icon name="arrow-down-lg"></lukso-icon>
          </div>
          <div
            v-if="!isLsp8(asset)"
            class="rounded-[0_0_12px_0] border border-t-0 border-neutral-90"
          >
            <SendCardAmount />
          </div>
        </div>
      </div>
      <div
        class="absolute inset-0 m-6 mt-0 grid grid-rows-2 gap-2 transition"
        :class="{
          'opacity-0': isLoadedApp,
          'animate-pulse opacity-100': !isLoadedApp,
        }"
      >
        <div class="rounded-12 bg-neutral-95"></div>
        <div class="rounded-12 bg-neutral-95"></div>
      </div>
    </div>
    <div slot="bottom" class="flex flex-col items-center p-6">
      <AppAvatar
        :is-eoa="receiver?.standard === 'EOA'"
        :name="receiver?.name"
        :address="receiver?.address"
        :profile-url="receiver?.profileImage?.[0].src"
      />
      <SendCardProfileSearch />
      <lukso-button
        class="mt-4 w-full"
        :disabled="!receiver?.address || !Number(amount) ? true : undefined"
        @click="handleSend"
        is-full-width
        >{{
          $formatMessage('send_button', {
            amount: !!Number(amount) ? $formatNumber(amount || '') : '',
            symbol: truncate(asset?.tokenSymbol, 10) || '',
          })
        }}</lukso-button
      >
    </div>
  </lukso-card>
</template>
