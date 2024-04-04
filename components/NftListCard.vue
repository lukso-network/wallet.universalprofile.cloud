<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import makeBlockie from 'ethereum-blockies-base64'
import { ref } from 'vue'

type Props = {
  asset: Asset
}

const props = defineProps<Props>()

const { isConnected } = storeToRefs(useAppStore())
const connectedProfile = useProfile().connectedProfile()
const targetIsVisible = ref(false)
const target = ref<HTMLElement | null>(null)
const asset = computed(() => (targetIsVisible.value ? props.asset : null))
const token = useToken()(asset)
const viewedProfileAddress = getCurrentProfileAddress()
const assetImage = useAssetImage(token, false, 260)

const handleShowAsset = () => {
  try {
    assertAddress(props.asset?.address)

    if (props.asset?.tokenId) {
      navigateTo(nftRoute(props.asset.address, props.asset.tokenId))
    } else {
      navigateTo(tokenRoute(props.asset.address))
    }
  } catch (error) {
    console.error(error)
  }
}

const handleSendAsset = (event: Event) => {
  try {
    event.stopPropagation()
    assertAddress(connectedProfile?.value?.address, 'profile')

    let query: SendQueryParams = {
      asset: props.asset?.address,
      tokenId: props.asset?.tokenId
    }

    if (isCollectible(props.asset)) {
      query = {
        ...query,
        amount: '1'
      }
    }

    navigateTo({
      path: sendRoute(connectedProfile.value.address),
      query
    })
  } catch (error) {
    console.error(error)
  }
}

const assetTokenId = computed(() => {
  return prefixedTokenId(props.asset?.tokenId, props.asset?.tokenIdFormat, 24)
})

onMounted(() => {
  setTimeout(() => {
    useIntersectionObserver(
      target,
      ([{ isIntersecting }], _observerElement) => {
        targetIsVisible.value = targetIsVisible.value || isIntersecting
      },
      {
        rootMargin: '600px' // load images before they appear in viewport
      }
    )
  }, 1)
})

const isLoadedAsset = computed(() => asset.value && !asset.value.isLoading)
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
        class="grid h-full grid-rows-[auto,max-content] rounded-12 bg-neutral-97"
      >
        <div
          class="grid grid-rows-[max-content,auto] rounded-12 bg-neutral-100 shadow-neutral-drop-shadow"
        >
          <AssetImage
            :image="assetImage"
            class="min-h-[260px] rounded-t-12 md:max-h-[260px]"
          />
          <div
            class="relative grid grid-rows-[max-content,max-content,auto] p-4"
          >
            <div
              class="relative top-[-40px] z-[2] flex cursor-pointer flex-col gap-1 rounded-4 bg-neutral-100 p-2 pr-6 shadow-neutral-drop-shadow"
            >
              <div class="paragraph-inter-14-semi-bold flex items-center gap-1">
                <span v-if="isLoadedAsset">{{ token?.tokenName }}</span>
                <AppPlaceholderLine v-else class="h-[22px] w-1/2" />
                <span
                  v-if="isLoadedAsset"
                  class="paragraph-inter-10-semi-bold text-neutral-60"
                  >{{ token?.tokenSymbol }}</span
                >
                <AppPlaceholderLine v-else class="h-[12px] w-1/4" />
              </div>
              <div v-if="isLoadedAsset" class="paragraph-ptmono-10-bold">
                <span v-if="isLsp8(token) && asset?.tokenId">
                  {{ assetTokenId }}
                </span>
                <span v-else-if="token?.balance">
                  {{ $formatMessage('token_owned') }}
                  {{ token.balance }}
                </span>
              </div>
              <AppPlaceholderLine v-else class="h-[14px] w-1/4" />
            </div>
            <NftListCardCreators :asset="token" class="relative -top-4 -mt-2" />
            <div class="flex items-end">
              <div class="flex w-full justify-end">
                <div v-if="isLoadedAsset">
                  <lukso-button
                    v-if="
                      isConnected &&
                      viewedProfileAddress === connectedProfile?.address
                    "
                    size="small"
                    variant="secondary"
                    @click="handleSendAsset"
                    class="transition-opacity hover:opacity-70"
                    >{{ $formatMessage('button_send') }}</lukso-button
                  >
                </div>
                <AppPlaceholderLine v-else class="h-[28px] w-[60px]" />
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-between px-4 py-3">
          <AssetStandardBadge :asset="asset" />
          <div
            v-if="isLoadedAsset && token?.address"
            class="paragraph-ptmono-10-bold flex items-center gap-1 text-neutral-60"
          >
            <img
              :src="makeBlockie(token.address)"
              alt=""
              class="size-3 rounded-full shadow-neutral-above-shadow-1xl outline outline-neutral-100"
            />
            {{ token?.address?.slice(0, 6) }}
          </div>
          <AppPlaceholderLine v-else class="h-[20px] w-1/5" />
        </div>
      </div>
    </lukso-card>
  </div>
</template>
