<script setup lang="ts">
import { sliceAddress } from '@lukso/web-components/tools'
import makeBlockie from 'ethereum-blockies-base64'

type Props = {
  asset?: Asset
}

const props = defineProps<Props>()
const { isMobile } = useDevice()
const isLoaded = computed(() => props.asset)
const address = computed(() => props.asset?.address)

const truncateAddress = computed(() => {
  if (!props.asset?.address) {
    return ''
  }

  const address = props.asset.address
  if (address.length <= 8) {
    return address
  }

  let addressLength = 66

  if (isMobile) {
    addressLength = 8
  }
  return sliceAddress(props.asset.address, addressLength)
})
</script>

<template>
  <template v-if="isLoaded">
    <div>
      <div class="heading-inter-14-bold pb-2">
        {{ $formatMessage('token_details_contract_address') }}
      </div>
      <div class="rounded-12 border border-neutral-90 bg-neutral-100 px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <img
              v-if="address"
              :src="makeBlockie(address)"
              alt=""
              class="bottom-0 right-0 size-6 rounded-full shadow-neutral-above-shadow-1xl outline outline-2 outline-neutral-100"
            />
            <div class="paragraph-ptmono-12-bold ml-2">
              {{ truncateAddress }}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <lukso-tooltip
              variant="light"
              offset="15"
              is-clipboard-copy
              :copy-text="$formatMessage('asset_address_copied_tooltip')"
              :copy-value="address"
            >
              <lukso-icon
                name="copy"
                size="small"
                class="cursor-pointer transition-opacity hover:opacity-70"
              ></lukso-icon>
            </lukso-tooltip>
            <a
              :href="explorerContractUrl(address)"
              target="_blank"
              class="flex"
            >
              <lukso-icon
                name="link-1"
                size="small"
                class="cursor-pointer transition-opacity hover:opacity-70"
              ></lukso-icon
            ></a>
          </div>
        </div>
      </div>
    </div>
  </template>
  <AppPlaceholderSection v-else>
    <AppPlaceholderLine class="h-[48px] w-full" />
  </AppPlaceholderSection>
</template>
