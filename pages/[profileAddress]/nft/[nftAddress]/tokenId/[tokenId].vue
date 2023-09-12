<script setup lang="ts">
import { Nft } from '@/types/assets'

const nftAddress = useRouter().currentRoute.value.params?.nftAddress
const tokenId = useRouter().currentRoute.value.params?.tokenId

const {
  getNft,
  status: profileStatus,
  profile: viewedProfile,
} = useProfileStore()
const { status: connectionStatus, profile: connectedProfile } =
  useConnectionStore()
const nft = ref<Nft>()

watchEffect(() => {
  nft.value = getNft(nftAddress, tokenId)
  console.log(nft.value)
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
        <lukso-card size="small" is-full-width
          ><div slot="content">
            <div
              class="min-h-[260px] bg-neutral-90 w-100 rounded-t-12 bg-center bg-cover"
              :style="`background-image: url(${nft?.data.image});`"
            ></div>
            <div class="p-4">
              <div
                v-if="nft?.data.creatorAddress"
                class="shadow-neutral-drop-shadow p-2 pr-6 rounded-4 inline-flex -top-6 relative bg-neutral-100"
              >
                <lukso-profile
                  size="x-small"
                  :profile-url="nft.data.creatorProfileImage"
                ></lukso-profile>
                <div class="pl-1">
                  <div class="text-neutral-60 paragraph-inter-10-semi-bold">
                    {{ $formatMessage('asset_created_by') }}
                  </div>
                  <lukso-username
                    :name="nft.data.creatorName"
                    :address="nft.data.creatorAddress"
                    size="x-small"
                    class="flex"
                    name-color="neutral-20"
                  ></lukso-username>
                </div>
              </div>
              <div>
                <div class="paragraph-inter-14-semi-bold">
                  {{ nft?.data.collectionName }}
                </div>
                <div class="paragraph-inter-12-semi-bold pb-2">
                  1
                  <span class="text-neutral-60">{{
                    nft?.data.collectionSymbol
                  }}</span>
                </div>
              </div>
            </div>
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
            :amount="'1'"
            :symbol="nft?.data.collectionSymbol"
          />

          <lukso-button is-full-width class="mt-4 hidden">{{
            $formatMessage('token_details_send', {
              token: nft?.data.collectionSymbol || '',
            })
          }}</lukso-button>
        </div>
      </div>
      <div>
        <div class="heading-apax-24-medium pb-8">
          {{ nft?.data.collectionName }}
        </div>
        <AssetAddress v-if="nft?.address" :address="nft.address" />
        <AssetTokenId v-if="nft?.data.tokenId" :token-id="nft.data.tokenId" />
        <AssetLinks
          v-if="nft?.data && 'collectionLinks' in nft?.data"
          :links="nft.data.collectionLinks"
        />
        <AssetDescription
          v-if="nft?.data && 'description' in nft.data && nft.data.description"
          :description="nft.data.description"
        />
        <AssetImages
          v-if="
            nft?.data &&
            'collectionImages' in nft.data &&
            nft.data.collectionImages
          "
          :images="nft.data.collectionImages"
        />
        <AssetStandardInfo v-if="nft?.standard" :standard="nft.standard" />
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
