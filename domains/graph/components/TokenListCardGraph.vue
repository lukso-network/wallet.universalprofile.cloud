<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

type Props = {
  asset: Asset
}

const props = defineProps<Props>()

const { isConnected } = storeToRefs(useAppStore())
const connectedProfile = useProfile().connectedProfile()
const viewedProfileAddress = getCurrentProfileAddress()
const targetIsVisible = ref(false)
const target = ref<HTMLElement | null>(null)
const asset = computed(() => (targetIsVisible.value ? props.asset : null))

const assetImage = useAssetImage(asset, true, 260)

const handleShowAsset = () => {
  navigateTo(assetRoute(props.asset.address))
}

const handleSendAsset = (event: Event) => {
  event.stopPropagation()
  navigateTo({
    path: sendRoute(connectedProfile.value?.address),
    query: {
      asset: props.asset?.address,
    },
  })
}

onMounted(() => {
  setTimeout(() => {
    useIntersectionObserver(
      target,
      ([{ isIntersecting }], _observerElement) => {
        targetIsVisible.value = targetIsVisible.value || isIntersecting
      }
    )
  }, 1)
})

const isLoadedAsset = computed(() => asset.value && !asset.value.isLoading)
const isLoadedMetadata = computed(
  () => asset.value && !asset.value.isMetadataLoading
)
</script>

<template>
  <div ref="target" class="flex">
    <lukso-card
      border-radius="small"
      shadow="small"
      is-hoverable
      is-full-width
      @click="handleShowAsset"
      ><div
        slot="content"
        class="grid h-full grid-rows-[max-content,auto] overflow-hidden p-4"
      >
        <div class="flex h-7 items-start justify-end">
          <AssetStandardBadge :asset="asset" />
        </div>
        <div class="flex gap-6">
          <div class="flex flex-col items-center gap-2 pl-2">
            <lukso-profile
              v-if="isLoadedMetadata"
              size="medium"
              :profile-address="asset?.address"
              :profile-url="assetImage?.url"
              placeholder="/assets/images/token-default.svg"
              has-identicon
            ></lukso-profile>
            <AppPlaceholderCircle v-else class="size-14" />
            <div
              v-if="isLoadedAsset"
              class="paragraph-ptmono-10-bold text-neutral-60"
            >
              #{{ asset?.address?.slice(2, 8) }}
            </div>
            <AppPlaceholderLine v-else class="h-[14px] w-full" />
          </div>
          <div
            class="grid w-full grid-rows-[max-content,max-content,auto] gap-1"
          >
            <div class="heading-inter-14-bold break-word">
              <div v-if="isLoadedAsset">{{ asset?.tokenName }}</div>
              <AppPlaceholderLine v-else class="h-[17px] w-1/3" />
            </div>
            <div
              v-if="isLoadedAsset"
              class="heading-inter-21-semi-bold grid grid-cols-[minmax(auto,max-content),max-content] flex-wrap items-center"
            >
              <span
                v-if="hasBalance(asset)"
                class="truncate"
                :title="
                  $formatNumber(
                    fromTokenUnitWithDecimals(
                      getBalance(asset),
                      asset?.decimals
                    )
                  )
                "
                >{{
                  $formatNumber(
                    fromTokenUnitWithDecimals(
                      getBalance(asset),
                      asset?.decimals
                    )
                  )
                }}</span
              >
              <span v-else>0</span>
              <span class="paragraph-inter-14-semi-bold pl-2 text-neutral-60">{{
                truncate(asset?.tokenSymbol, 8)
              }}</span>
            </div>
            <div v-else class="grid grid-cols-[2fr,1fr] items-center gap-2">
              <AppPlaceholderLine class="h-[26px] w-full" />
              <AppPlaceholderLine class="h-[22px] w-full" />
            </div>
            <div
              v-if="hasBalance(asset) && asset?.tokenSymbol"
              class="paragraph-inter-12-regular"
            >
              {{ $formatCurrency(getBalance(asset), asset.tokenSymbol) }}
            </div>
            <div class="flex w-full items-end justify-end">
              <div v-if="isLoadedAsset">
                <lukso-button
                  v-if="
                    isConnected &&
                    viewedProfileAddress === connectedProfile?.address
                  "
                  size="small"
                  variant="secondary"
                  @click="handleSendAsset"
                  class="mt-4"
                  >{{ $formatMessage('button_send') }}</lukso-button
                >
              </div>
              <AppPlaceholderLine v-else class="h-[28px] w-[60px]" />
            </div>
          </div>
        </div>
      </div>
    </lukso-card>
  </div>
</template>
