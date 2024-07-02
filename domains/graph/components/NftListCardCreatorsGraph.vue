<script setup lang="ts">
type Props = {
  asset: Asset
}

export type VerifyStatus = 'verified' | 'unverified' | 'partial'

const CREATOR_SHOW_LIMIT = 4
const props = defineProps<Props>()

const asset = computed(() => props.asset)
const assetAddress = computed(() => asset.value?.address)
const creators = computed(() => {
  let items = props.asset?.tokenCreatorsData || []

  if (items.length === 0 && props.asset?.ownerData) {
    items = [asset.value?.ownerData as Creator]
  }

  return items
})

const creatorsWithLimit = computed(() => {
  if (tooManyCreators.value) {
    return creators.value.slice(0, CREATOR_SHOW_LIMIT)
  }
  return creators.value.slice(1)
})

const verifyStatus = computed<VerifyStatus>(() => {
  const issued = useIssuedAssetsGraph().validateAssets(creators, assetAddress)
  const array = Array.from(issued.value?.values() || [])
  const hasSome = array?.some(info => info)
  if (!hasSome) {
    return 'unverified'
  }

  if (array.every(Boolean)) {
    return 'verified'
  }

  return 'partial'
})

const tooManyCreators = computed(
  () => creators.value.length > CREATOR_SHOW_LIMIT
)

const isLoaded = computed(() => asset.value && !asset.value.isLoading)
</script>

<template>
  <div v-if="isLoaded">
    <!--no creators at all including owner, might be that its EOA or not indexed -->
    <div
      v-if="(creators || []).length === 0"
      class="grid grid-cols-[max-content,auto] gap-1"
    ></div>
    <div v-else class="grid animate-fade-in grid-cols-[max-content,auto]">
      <div class="flex space-x-[-14px]">
        <NftListCardCreatorsProfileGraph
          v-for="(creator, index) in creatorsWithLimit || []"
          :creator="creator"
          :key="index"
          class="relative"
        />
        <NftListCardCreatorsProfileGraph
          v-if="creators[0]"
          :creator="creators[0]"
          :count="tooManyCreators ? creators.length - CREATOR_SHOW_LIMIT : 0"
          class="relative"
          has-name
        />
      </div>
      <div class="flex items-center justify-end">
        <lukso-tooltip
          v-if="verifyStatus === 'unverified'"
          variant="danger"
          :text="$formatMessage('asset_all_creators_unverified')"
          class="ml-2"
        >
          <lukso-icon
            name="cross-filled"
            color="red-55"
            secondary-color="neutral-100"
            size="small"
          ></lukso-icon>
        </lukso-tooltip>
        <lukso-tooltip
          v-if="verifyStatus === 'partial'"
          variant="danger"
          :text="$formatMessage('asset_all_creators_partial')"
          class="ml-2"
        >
          <lukso-icon
            name="cross-filled"
            color="red-55"
            secondary-color="neutral-100"
            size="small"
          ></lukso-icon>
        </lukso-tooltip>
        <lukso-tooltip
          v-if="verifyStatus === 'verified'"
          variant="success"
          :text="$formatMessage('asset_all_creators_verified')"
          class="ml-2"
        >
          <lukso-icon
            name="complete-filled"
            color="green-54"
            secondary-color="neutral-100"
            size="small"
          ></lukso-icon>
        </lukso-tooltip>
      </div>
    </div>
  </div>
  <div v-else class="mt-4 grid grid-cols-[max-content,auto] gap-1">
    <AppPlaceholderCircle class="size-6" />
    <div class="grid w-full flex-col gap-1">
      <AppPlaceholderLine class="w-1/3" />
      <AppPlaceholderLine class="w-1/2" />
    </div>
  </div>
</template>
