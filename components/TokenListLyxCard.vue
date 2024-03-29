<script setup lang="ts">
import { useResizeObserver, useElementSize } from '@vueuse/core'

const connectedProfile = useProfile().connectedProfile()
const { isConnected, isTestnet } = storeToRefs(useAppStore())
const viewedProfile = useProfile().viewedProfile()
const contentRef = ref()
const logoRef = ref()
const symbolRef = ref()
const balanceWidthPx = ref(0)
const asset = useLyxToken()

const calculateBalanceWidth = () => {
  const SPACING = 24 + 32 // gap + padding
  const { width: contentWidth } = useElementSize(contentRef.value)
  const { width: logoWidth } = useElementSize(logoRef.value)
  const { width: symbolWidth } = useElementSize(symbolRef.value)

  balanceWidthPx.value =
    contentWidth.value - logoWidth.value - symbolWidth.value - SPACING
}

const handleSendAsset = (event: Event) => {
  try {
    event.stopPropagation()
    assertAddress(connectedProfile?.value?.address, 'profile')
    navigateTo(sendRoute(connectedProfile.value.address))
  } catch (error) {
    console.error(error)
  }
}

const handleShowLyxDetails = () => {
  try {
    assertAddress(viewedProfile?.value?.address, 'profile')
    navigateTo(lyxDetailsRoute(viewedProfile.value.address))
  } catch (error) {
    console.error(error)
  }
}

const handleBuyLyx = (event: Event) => {
  event.stopPropagation()
  if (isTestnet.value) {
    window.open(TESTNET_FAUCET_URL, '_blank')
  } else {
    try {
      assertAddress(connectedProfile?.value?.address, 'profile')
      navigateTo(buyLyxRoute(connectedProfile.value.address))
    } catch (error) {
      console.error(error)
    }
  }
}

onMounted(() => {
  useResizeObserver(contentRef, () => {
    calculateBalanceWidth()
  })
})
</script>

<template>
  <lukso-card
    border-radius="small"
    shadow="small"
    is-hoverable
    is-full-width
    @click="handleShowLyxDetails"
    ><div
      ref="contentRef"
      slot="content"
      class="flex flex-col justify-center p-4 pt-11"
    >
      <div class="flex gap-6">
        <div ref="logoRef" class="flex flex-col items-center pl-2">
          <div class="rounded-full border border-neutral-90 p-0.5">
            <lukso-profile
              size="medium"
              :profile-url="ASSET_LYX_ICON_URL"
            ></lukso-profile>
          </div>
        </div>
        <div class="flex w-full flex-col">
          <div class="heading-inter-14-bold pb-1">LUKSO</div>
          <div class="heading-inter-21-semi-bold flex items-center pb-1">
            <span
              v-if="viewedProfile?.balance"
              class="truncate"
              :style="{
                'max-width': `${balanceWidthPx}px`,
              }"
              :title="
                $formatNumber(
                  fromWeiWithDecimals(viewedProfile.balance, asset.decimals)
                )
              "
              >{{
                $formatNumber(
                  fromWeiWithDecimals(viewedProfile.balance, asset.decimals)
                )
              }}</span
            >
            <span v-else>0</span>
            <span
              ref="symbolRef"
              class="paragraph-inter-14-semi-bold pl-2 text-neutral-60"
              >{{ asset.tokenSymbol }}</span
            >
          </div>
          <div class="paragraph-inter-12-regular pb-4">
            {{
              $formatCurrency(
                viewedProfile?.balance || '',
                CURRENCY_API_LYX_TOKEN_NAME
              )
            }}
          </div>
        </div>
      </div>
      <div class="flex w-full justify-end gap-2">
        <lukso-button
          v-if="
            isConnected && viewedProfile?.address === connectedProfile?.address
          "
          size="small"
          variant="secondary"
          @click="handleBuyLyx"
          class="transition-opacity hover:opacity-70"
          >{{
            isTestnet
              ? $formatMessage('button_get_lyx')
              : $formatMessage('button_buy_lyx')
          }}</lukso-button
        >
        <lukso-button
          v-if="
            isConnected && viewedProfile?.address === connectedProfile?.address
          "
          size="small"
          variant="secondary"
          @click="handleSendAsset"
          class="transition-opacity hover:opacity-70"
          >{{ $formatMessage('button_send') }}</lukso-button
        >
      </div>
    </div>
  </lukso-card>
</template>
