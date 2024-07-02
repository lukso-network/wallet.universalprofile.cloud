<script setup lang="ts">
const connectedProfile = useProfile().connectedProfile()
const { isConnected, isTestnet } = storeToRefs(useAppStore())
const viewedProfile = useProfile().viewedProfile()
const asset = useLyxToken()

const handleSendAsset = (event: Event) => {
  event.stopPropagation()
  navigateTo(sendRoute(connectedProfile.value?.address))
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
      assertAddress(viewedProfile?.value?.address, 'profile')
      navigateTo(buyLyxRoute(viewedProfile.value.address))
    } catch (error) {
      console.error(error)
    }
  }
}
</script>

<template>
  <lukso-card
    border-radius="small"
    shadow="small"
    is-hoverable
    is-full-width
    @click="handleShowLyxDetails"
    ><div
      slot="content"
      class="flex flex-col justify-center overflow-hidden p-4 pt-11"
    >
      <div class="flex gap-6">
        <div class="flex flex-col items-center pl-2">
          <div class="rounded-full border border-neutral-90 p-0.5">
            <lukso-profile
              size="medium"
              :profile-url="ASSET_LYX_ICON_URL"
            ></lukso-profile>
          </div>
        </div>
        <div class="flex w-full flex-col">
          <div class="heading-inter-14-bold pb-1">LUKSO</div>
          <div
            class="heading-inter-21-semi-bold grid grid-cols-[minmax(auto,max-content),max-content] items-center pb-1"
          >
            <span
              v-if="hasBalance(viewedProfile)"
              class="truncate"
              :title="
                $formatNumber(
                  fromTokenUnitWithDecimals(
                    getBalance(viewedProfile),
                    asset.decimals
                  )
                )
              "
              >{{
                $formatNumber(
                  fromTokenUnitWithDecimals(
                    getBalance(viewedProfile),
                    asset.decimals
                  )
                )
              }}</span
            >
            <span v-else>0</span>
            <span class="paragraph-inter-14-semi-bold pl-2 text-neutral-60">{{
              asset.tokenSymbol
            }}</span>
          </div>
          <div class="paragraph-inter-12-regular pb-4">
            {{
              $formatCurrency(
                getBalance(viewedProfile),
                CURRENCY_API_LYX_TOKEN_NAME
              )
            }}
          </div>
        </div>
      </div>
      <div class="flex w-full justify-end gap-2">
        <lukso-button size="small" variant="secondary" @click="handleBuyLyx">{{
          isTestnet
            ? $formatMessage('button_get_lyx')
            : $formatMessage('button_buy_lyx')
        }}</lukso-button>
        <lukso-button
          v-if="
            isConnected && viewedProfile?.address === connectedProfile?.address
          "
          size="small"
          variant="secondary"
          @click="handleSendAsset"
          >{{ $formatMessage('button_send') }}</lukso-button
        >
      </div>
    </div>
  </lukso-card>
</template>
