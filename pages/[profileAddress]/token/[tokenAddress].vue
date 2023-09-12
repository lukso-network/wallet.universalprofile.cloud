<script setup lang="ts">
import { Token } from '@/types/assets'

const tokenAddress = useRouter().currentRoute.value.params?.tokenAddress
const {
  getToken,
  status: profileStatus,
  profile: viewedProfile,
} = useProfileStore()
const { status: connectionStatus, profile: connectedProfile } =
  useConnectionStore()
const token = ref<Token>()

watchEffect(() => {
  token.value = getToken(tokenAddress)
})
</script>

<template>
  <div class="relative">
    <div
      :class="{
        'opacity-0': profileStatus.isAssetLoading,
        'opacity-100': !profileStatus.isAssetLoading,
      }"
      class="max-w-[835px] py-20 px-4 mx-auto relative grid grid-cols-[1fr,2fr] gap-12 transition-opacity duration-300"
    >
      <div>
        <lukso-card is-full-width size="small">
          <div
            slot="content"
            class="p-6 flex items-center justify-center sm:py-10 md:py-20"
          >
            <lukso-profile
              v-if="token"
              size="large"
              :profile-url="'icon' in token.data ? token.data.icon : undefined"
              class="shadow-neutral-above-shadow-1xl rounded-full"
            ></lukso-profile>
          </div>
        </lukso-card>
        <div
          v-if="
            connectionStatus.isConnected &&
            viewedProfile.address === connectedProfile.address
          "
        >
          <AssetOwnInfo
            :profile="connectedProfile"
            :amount="token?.data.amount"
            :symbol="token?.data.symbol"
          />

          <lukso-button is-full-width class="mt-4 hidden">{{
            $formatMessage('token_details_send', {
              token: token?.data.symbol || '',
            })
          }}</lukso-button>
        </div>
      </div>
      <div>
        <div class="heading-apax-24-medium pb-8">{{ token?.data.name }}</div>
        <AssetAddress v-if="token?.address" :address="token.address" />
        <AssetLinks
          v-if="token?.data && 'links' in token?.data"
          :links="token.data.links"
        />
        <AssetDescription
          v-if="
            token?.data && 'description' in token.data && token.data.description
          "
          :description="token.data.description"
        />
        <AssetImages
          v-if="token?.data && 'images' in token.data && token.data.images"
          :images="token.data.images"
        />
        <AssetStandardInfo v-if="token?.standard" :standard="token.standard" />
      </div>
    </div>
    <lukso-icon
      name="progress-indicator-alt"
      size="x-large"
      v-if="profileStatus.isAssetLoading"
      class="absolute top-1/2 left-1/2 transform"
    ></lukso-icon>
  </div>
</template>
