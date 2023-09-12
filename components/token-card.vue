<script setup lang="ts">
import { fromWei } from 'web3-utils'

import { sendRoute, tokenRoute } from '@/shared/routes'
import { Token, StandardsAbbreviations } from '@/types/assets'

type Props = {
  asset: Token
  hasAddress?: boolean
  isOpenable?: boolean
}

const props = defineProps<Props>()

const { profile: connectedProfile, status } = useConnectionStore()
const { profile: viewedProfile } = useProfileStore()

const handleShowAsset = () => {
  if (!props.isOpenable) {
    return
  }

  try {
    assertAddress(viewedProfile.address, 'profile')
    assertAddress(props.asset.address, 'asset')
    navigateTo(tokenRoute(viewedProfile.address, props.asset.address))
  } catch (error) {
    console.error(error)
  }
}

const handleSendAsset = () => {
  try {
    assertAddress(connectedProfile.address, 'profile')
    navigateTo({
      path: sendRoute(connectedProfile.address),
      query: {
        token: props.asset.address,
      },
    })
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <lukso-card
    size="small"
    :is-hoverable="isOpenable ? 'true' : undefined"
    is-full-width
    @click="handleShowAsset"
    ><div slot="content" class="p-4">
      <div class="h-7 flex justify-end items-start">
        <lukso-tag
          v-if="asset.standard"
          size="x-small"
          background-color="lukso-90"
          >{{ StandardsAbbreviations[asset.standard] }}</lukso-tag
        >
      </div>
      <div class="flex gap-6">
        <div class="pl-4 flex flex-col items-center">
          <lukso-profile
            size="medium"
            :profile-address="asset.address"
            :profile-url="'icon' in asset.data ? asset.data.icon : undefined"
            :has-identicon="hasAddress ? 'true' : undefined"
          ></lukso-profile>
          <div
            v-if="hasAddress"
            class="paragraph-ptmono-10-bold text-neutral-60 pt-2"
          >
            #{{ asset.address.slice(2, 8) }}
          </div>
        </div>
        <div class="flex flex-col w-full">
          <div class="heading-inter-14-bold pb-1">{{ asset.data.name }}</div>
          <div class="heading-inter-21-semi-bold flex items-center pb-1">
            <span v-if="asset.data.amount">{{
              $formatNumber(fromWei(asset.data.amount, 'ether'))
            }}</span>
            <span v-else>0</span>
            <span class="paragraph-inter-14-semi-bold text-neutral-60 ml-2">{{
              asset.data.symbol
            }}</span>
          </div>
          <div class="paragraph-inter-12-regular hidden">$ 123.24</div>
          <div class="flex justify-end w-full hidden">
            <lukso-button
              v-if="
                status.isConnected &&
                viewedProfile.address === connectedProfile.address
              "
              size="small"
              variant="secondary"
              @click="handleSendAsset"
              class="mt-4"
              >{{ $formatMessage('button_send') }}</lukso-button
            >
          </div>
        </div>
      </div>
    </div>
  </lukso-card>
</template>
