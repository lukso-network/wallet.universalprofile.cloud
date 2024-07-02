<script setup lang="ts">
import makeBlockie from 'ethereum-blockies-base64'

type Props = {
  asset: Asset
}

const props = defineProps<Props>()

const target = ref<HTMLElement | null>(null)
const assetImage = useAssetImage(props.asset, false, 260)

const handleShowAsset = () => {
  navigateTo(assetRoute(props.asset.address))
}

const assetTokenId = computed(() => {
  return prefixedTokenId(props.asset?.tokenId, props.asset?.tokenIdFormat, 24)
})
</script>

<template>
  <div ref="target" class="relative flex">
    <lukso-card
      border-radius="small"
      shadow="small"
      is-hoverable
      is-full-width
      class="relative z-10 transition hover:scale-[1.01] active:scale-100"
      @click="handleShowAsset"
      ><div
        slot="content"
        class="grid h-full grid-rows-[max-content,auto,max-content] rounded-12 bg-neutral-100"
      >
        <AssetImage
          :image="assetImage"
          class="min-h-[260px] rounded-t-12 md:max-h-[260px]"
        />
        <div
          class="relative grid grid-rows-[max-content,max-content,auto] p-4 pt-2"
        >
          <div
            class="paragraph-inter-14-semi-bold flex flex-wrap items-center gap-x-1 gap-y-0.5 break-word"
          >
            <span>{{ asset?.tokenName }}</span>
            <span class="paragraph-inter-10-semi-bold text-neutral-60">{{
              truncate(asset?.tokenSymbol, 8)
            }}</span>
          </div>
          <div class="paragraph-ptmono-10-bold">
            <span v-if="isCollection(asset)">
              {{
                $formatMessage('token_collection_of', {
                  count: asset?.tokenIdsData?.length.toString() || '0',
                })
              }}
            </span>
            <span v-else-if="isLsp8(asset) && asset?.tokenId">
              {{ assetTokenId }}
            </span>
            <span v-else-if="hasBalance(asset)">
              {{ $formatMessage('token_owned') }}
              {{ $formatNumber(getBalance(asset)) }}
            </span>
          </div>
          <NftListCardCreatorsGraph :asset="asset" class="mt-4" />
        </div>
        <div
          class="mx-4 flex justify-between border-t border-t-neutral-90 py-3"
        >
          <AssetStandardBadge :asset="asset" />
          <div
            v-if="asset?.address"
            class="paragraph-ptmono-10-bold flex items-center gap-1 text-neutral-60"
          >
            <img
              :src="makeBlockie(asset.address)"
              alt=""
              class="size-3 rounded-full shadow-neutral-above-shadow-1xl outline outline-neutral-100"
            />
            {{ asset?.address?.slice(0, 6) }}
          </div>
          <AppPlaceholderLine v-else class="h-[20px] w-1/5" />
        </div>
      </div>
    </lukso-card>
  </div>
</template>
