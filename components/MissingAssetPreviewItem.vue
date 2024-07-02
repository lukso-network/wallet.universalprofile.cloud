<script setup lang="ts">
type Props = {
  address: Address
  tokenId?: string
  isAdded?: boolean
}

const props = defineProps<Props>()
const asset = useAsset()(props.address, props.tokenId)
const token = useToken()(asset)
const assetImage = useAssetImage(token, true, 260)

const isLoadedToken = computed(() => token.value && !token.value.isLoading)
const isLoadedAsset = computed(() => asset && !asset.value.isLoading)
const isLoadedMetadata = computed(
  () => token.value && !token.value.isMetadataLoading
)
</script>

<template>
  <div class="rounded-12 border border-neutral-90 bg-neutral-100 px-6 py-4">
    <div class="flex gap-6">
      <div class="flex flex-col items-center gap-2">
        <lukso-profile
          v-if="isLoadedMetadata"
          size="medium"
          :profile-address="token?.address"
          :profile-url="assetImage?.url"
          has-identicon
          :is-square="isCollectible(token) ? true : undefined"
        ></lukso-profile>
        <AppPlaceholderCircle v-else class="size-14" />
        <div
          v-if="isLoadedAsset"
          class="paragraph-ptmono-10-bold text-neutral-60"
        >
          #{{ token?.address?.slice(2, 8) }}
        </div>
        <AppPlaceholderLine v-else class="h-[14px] w-full" />
      </div>
      <div class="flex w-full flex-col justify-center gap-1">
        <div class="heading-inter-14-bold break-word">
          <div v-if="isLoadedAsset">{{ token?.tokenName }}</div>
          <AppPlaceholderLine v-else class="h-[17px] w-1/3" />
        </div>
        <div v-if="isLsp7(token)">
          <div
            v-if="isLoadedToken"
            class="heading-inter-21-semi-bold grid grid-cols-[minmax(auto,max-content),max-content] flex-wrap items-center"
          >
            <span
              v-if="hasBalance(token)"
              class="truncate"
              :title="
                $formatNumber(
                  fromTokenUnitWithDecimals(getBalance(token), token?.decimals)
                )
              "
              >{{
                $formatNumber(
                  fromTokenUnitWithDecimals(getBalance(token), token?.decimals)
                )
              }}</span
            >
            <span v-else>0</span>
            <span class="paragraph-inter-14-semi-bold pl-2 text-neutral-60">{{
              truncate(token?.tokenSymbol, 8)
            }}</span>
          </div>
          <div v-else class="grid grid-cols-[2fr,1fr] items-center gap-2">
            <AppPlaceholderLine class="h-[26px] w-full" />
            <AppPlaceholderLine class="h-[22px] w-full" />
          </div>
        </div>
        <div v-else>
          <div v-if="isLoadedToken">
            <lukso-tag v-if="hasTokenId(asset)" is-rounded>
              <div class="flex items-center">
                <div class="paragraph-ptmono-12-bold">
                  {{
                    prefixedTokenId(asset?.tokenId, asset?.tokenIdFormat, 36)
                  }}
                </div>
              </div>
            </lukso-tag>
          </div>
          <AppPlaceholderLine v-else class="h-[28px] w-[100px]" />
        </div>
      </div>
      <div class="flex items-center">
        <lukso-tag v-if="isAdded" is-rounded border-color="neutral-90">
          <lukso-icon
            name="complete-filled"
            color="green-54"
            secondary-color="neutral-100"
            size="small"
            class="mr-1"
          ></lukso-icon>
          {{ $formatMessage('missing_asset_label_added') }}</lukso-tag
        >
        <lukso-tag v-else is-rounded border-color="neutral-90">
          <lukso-icon
            name="cross-filled"
            color="red-55"
            secondary-color="neutral-100"
            size="small"
            class="mr-1"
          ></lukso-icon>
          {{ $formatMessage('missing_asset_label_missing') }}</lukso-tag
        >
      </div>
    </div>
  </div>
</template>
