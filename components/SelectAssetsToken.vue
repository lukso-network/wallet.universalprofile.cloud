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

type Emits = (event: 'on-select', asset: Asset | null) => void

const props = defineProps<Props>()
const emits = defineEmits<Emits>()
const hasSquareIcon = computed(() => isCollectible(props.asset))
const asset = computed(() => props.asset)
const token = useToken()(asset)
const assetImage = useAssetImage(token, !isCollectible(token.value), 80)
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
        ></lukso-profile>
      </div>
    </div>
    <div class="grid grid-cols-[auto,max-content] items-center">
      <div class="flex flex-col text-left">
        <div class="paragraph-inter-14-semi-bold">
          {{ token?.tokenName }}
        </div>
        <div class="paragraph-inter-12-semi-bold text-neutral-60">
          {{ token?.tokenSymbol }}
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
