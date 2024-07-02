<script setup lang="ts">
type Props = {
  icon?: string
  name?: string
  symbol?: string
  address?: Address
  hasIdenticon?: boolean

  asset?: Asset
  isSelected?: boolean
}

type Emits = (event: 'on-select', asset?: Asset | null) => void

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const hasSquareIcon = computed(() => isCollectible(props.asset))
const asset = computed(() => props.asset)
const token = useToken()(asset)
const assetImage = useAssetImage(token, !isCollectible(token.value), 80)

const assetTokenId = computed(() => {
  return prefixedTokenId(token.value?.tokenId, token.value?.tokenIdFormat, 24)
})
</script>

<template>
  <div
    class="grid cursor-pointer grid-cols-[max-content,auto] rounded-12 p-2 hover:bg-neutral-95"
    :class="{
      'bg-neutral-95': isSelected,
    }"
    @click="emits('on-select', token)"
  >
    <div class="flex items-center pr-4">
      <div
        class="shadow-neutral-above-shadow-1xl"
        :class="{
          'rounded-full': !hasSquareIcon,
          'rounded-4': hasSquareIcon,
        }"
      >
        <lukso-profile
          size="small"
          :profile-url="assetImage?.url"
          :profile-address="asset?.address"
          has-identicon
          :is-square="hasSquareIcon ? true : undefined"
          :placeholder="
            isCollectible(token)
              ? undefined
              : '/assets/images/token-default.svg'
          "
        ></lukso-profile>
      </div>
    </div>
    <div class="grid grid-cols-[auto,max-content] items-center">
      <div class="flex flex-col text-left">
        <div
          class="paragraph-inter-14-semi-bold flex flex-wrap items-center gap-x-1 break-word"
        >
          <span>
            {{ token?.tokenName }}
          </span>
          <span class="paragraph-inter-12-semi-bold text-neutral-60">
            {{ token?.tokenSymbol }}
          </span>
        </div>
        <div class="paragraph-ptmono-10-bold">
          <span v-if="isLsp8(token) && token?.tokenId">
            {{ $formatMessage('token_owned') }}
            {{ assetTokenId }}
          </span>
          <span v-else-if="hasBalance(token)">
            {{ $formatMessage('token_owned') }}
            {{
              $formatNumber(
                fromTokenUnitWithDecimals(getBalance(token), token?.decimals)
              )
            }}
          </span>
        </div>
      </div>
      <lukso-icon
        v-if="isSelected"
        name="complete-filled"
        color="green-54"
        secondary-color="neutral-100"
      ></lukso-icon>
    </div>
  </div>
</template>
