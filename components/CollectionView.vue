<script setup lang="ts">
type Props = {
  asset?: Asset | null
}

const props = defineProps<Props>()
const { isRpc } = useDataProvider()
const asset = computed(() => props.asset)
const token = useToken()(asset)
const assetImage = useAssetImage(token, false, 880)

const loadMore = async (): Promise<LoadMoreParams> => {
  if (isRpc) {
    // we cannot fetch collection using RPC
    return { data: [], meta: { total: 0 } }
  }

  const { collection: data, meta } = await useCollectionGraph({
    address: asset.value?.address,
    limit: limit.value,
    offset: offset.value,
  })

  return { data, meta }
}

const { offset, limit, isLoading, hasData, data } = useLoadMoreData(loadMore)
</script>

<template>
  <div class="relative mx-auto grid max-w-content pb-28">
    <lukso-card
      variant="dapp"
      :background-url="assetImage?.url"
      shadow="small"
      class="mb-4"
    >
      <div slot="content" class="break-words p-6">
        <div class="grid grid-cols-1 sm:grid-cols-[auto,max-content]">
          <div
            class="heading-inter-17-semi-bold mb-4 flex flex-col gap-2 border-b border-b-neutral-90 pb-4 sm:flex-row sm:items-center sm:gap-3"
          >
            <AssetName :asset="asset" />
            <AssetStandardBadge :asset="asset" />
          </div>
          <div><!-- TBA --></div>
        </div>
        <div class="flex flex-col gap-4">
          <AssetDescription :asset="token" without-title />
          <AssetLinks
            :asset="token"
            without-title
            button-size="small"
            class="mt-4"
          />
        </div>
      </div>
    </lukso-card>
    <div v-if="hasData">
      <NftListGraph :nfts="data" without-title />
    </div>
    <AppLoader
      v-if="isLoading"
      class="absolute bottom-0 left-[calc(50%-20px)]"
    />
  </div>
</template>
