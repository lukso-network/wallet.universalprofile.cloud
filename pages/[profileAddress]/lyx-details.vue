<script setup lang="ts">
import type { LinkMetadata } from '@lukso/lsp-smart-contracts'

const connectedProfile = useProfile().connectedProfile()
const { currentNetwork, isTestnet } = storeToRefs(useAppStore())
const viewedProfile = useProfile().viewedProfile()
const { isConnected } = storeToRefs(useAppStore())
const asset = useLyxToken()

const profileImage = useProfileAvatar(connectedProfile, 40)

const links: LinkMetadata[] = [
  {
    title: 'www.lukso.network',
    url: 'https://lukso.network/',
  },
  {
    title: 'www.docs.lukso.tech',
    url: 'https://docs.lukso.tech/',
  },
]

const handleSendLyx = () => {
  navigateTo(sendRoute(connectedProfile.value?.address))
}

const handleBuyLyx = () => {
  if (isTestnet.value) {
    window.open(TESTNET_FAUCET_URL, '_blank')
  } else {
    try {
      assertAddress(viewedProfile.value?.address, 'profile')
      navigateTo(buyLyxRoute(viewedProfile.value.address))
    } catch (error) {
      console.error(error)
    }
  }
}
</script>

<template>
  <AppPageLoader>
    <div
      class="relative mx-auto grid max-w-content gap-12 transition-opacity duration-300 md:grid-cols-[1fr,2fr]"
    >
      <div>
        <lukso-card is-full-width border-radius="small" shadow="small">
          <div
            slot="content"
            class="flex min-h-[260px] items-center justify-center p-6 sm:py-10 md:py-20"
          >
            <lukso-profile
              size="large"
              :profile-url="ASSET_LYX_ICON_URL"
              class="rounded-full shadow-neutral-above-shadow-1xl"
            ></lukso-profile>
          </div>
        </lukso-card>
        <AssetOwnInfo
          v-if="
            isConnected &&
            connectedProfile &&
            viewedProfile?.address === connectedProfile?.address
          "
          :address="connectedProfile.address"
          :balance="getBalance(asset)"
          :symbol="asset.tokenSymbol"
          :decimals="asset.decimals"
          :profile-image-url="profileImage?.url"
          :message="$formatMessage('token_details_own')"
        />

        <div class="mt-12 flex flex-col gap-2">
          <lukso-button
            v-if="
              isConnected &&
              connectedProfile &&
              viewedProfile?.address === connectedProfile?.address &&
              hasBalance(asset)
            "
            is-full-width
            variant="secondary"
            @click="handleSendLyx"
            >{{
              $formatMessage('token_details_send', {
                token: asset.tokenSymbol || '',
              })
            }}</lukso-button
          >
          <lukso-button is-full-width variant="primary" @click="handleBuyLyx">{{
            isTestnet
              ? $formatMessage('token_details_get_lyx')
              : $formatMessage('token_details_buy_lyx')
          }}</lukso-button>
        </div>
      </div>
      <div>
        <div class="heading-apax-24-medium pb-2">
          {{ $formatMessage('lyx_details_title') }}
        </div>
        <div class="flex flex-col gap-8">
          <AssetTokenSupply
            :asset="{
              totalSupply: currentNetwork.token.supply,
              decimals: asset?.decimals,
            }"
          />
          <AssetDescription
            :asset="{
              resolvedMetadata: {
                description: $formatMessage('lyx_details_description'),
              },
            }"
            class="mb-8"
          />
          <AssetLinks :asset="{ resolvedMetadata: { links } }" class="mb-8" />
        </div>
      </div>
    </div>
  </AppPageLoader>
</template>
