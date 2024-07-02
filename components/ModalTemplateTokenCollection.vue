<script setup lang="ts">
import '@google/model-viewer'

const { modal } = useAppStore()

type Props = {
  closeModal: () => void
}

defineProps<Props>()
const viewedProfile = useProfile().viewedProfile()
const connectedProfile = useProfile().connectedProfile()
const profileAvatar = useProfileAvatar(viewedProfile, 24)
const { isConnected } = storeToRefs(useAppStore())

const asset = computed(() => modal?.data?.asset)
const tokenIdsData = computed(() => asset.value?.tokenIdsData)

const handleViewEntireCollection = () => {
  navigateTo(collectionRoute(asset.value.address))
}
</script>

<template>
  {{ genericLog(asset?.tokenName, toRaw(asset)) }}
  <div class="relative rounded-12 bg-neutral-100 p-6 pb-2">
    <div class="flex items-center justify-between pb-6">
      <div
        class="heading-inter-21-semi-bold flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3"
      >
        <AssetName :asset="asset" />
        <AssetStandardBadge :asset="asset" />
      </div>
      <ModalCloseButton @click="closeModal" />
    </div>
    <div class="flex items-center justify-between pb-6">
      <div class="flex items-center gap-4">
        <lukso-profile
          size="small"
          :profile-url="profileAvatar?.url"
          :profile-address="viewedProfile?.address"
          has-identicon
        ></lukso-profile>
        <div
          v-if="
            isConnected && viewedProfile?.address === connectedProfile?.address
          "
          class="paragraph-inter-10-semi-bold"
        >
          {{ $formatMessage('collection_connected_own_info') }}
        </div>
        <div v-else class="flex flex-col justify-center">
          <lukso-username
            :name="viewedProfile?.name"
            :address="viewedProfile?.address"
            size="large"
          ></lukso-username>
          <div class="paragraph-inter-10-semi-bold">
            {{ $formatMessage('collection_not_connected_own_info') }}
          </div>
        </div>
      </div>
      <lukso-button
        variant="secondary"
        size="small"
        @click="handleViewEntireCollection"
      >
        <lukso-icon size="small" name="eye-show" class="mr-2"></lukso-icon>
        {{ $formatMessage('view_entire_collection') }}
      </lukso-button>
    </div>
    <div
      class="-mx-4 grid max-h-[calc(100vh-300px)] grid-cols-1 gap-6 overflow-y-auto px-4 pb-6 sm:grid-cols-2 md:grid-cols-3"
    >
      <NftListCard
        v-for="(token, index) in tokenIdsData"
        :key="index"
        :asset="token"
      />
      <div
        class="paragraph-inter-16-semi-bold flex min-h-[400px] cursor-pointer items-center justify-center rounded-12 border border-neutral-90 bg-neutral-100 p-6 transition hover:shadow-neutral-drop-shadow-1xl"
        @click="handleViewEntireCollection"
      >
        <lukso-icon size="medium" name="eye-show" class="mr-2"></lukso-icon>
        {{ $formatMessage('view_entire_collection') }}
      </div>
    </div>
  </div>
</template>
