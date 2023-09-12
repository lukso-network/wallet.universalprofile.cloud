<script setup lang="ts">
import { fromWei } from 'web3-utils'

import { sendRoute } from '@/shared/routes'

const { profile: connectedProfile, status } = useConnectionStore()
const { profile: viewedProfile } = useProfileStore()
const appStore = useAppStore()

const handleSendAsset = () => {
  try {
    assertAddress(connectedProfile.address, 'profile')
    navigateTo(sendRoute(connectedProfile.address))
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <lukso-card size="small" is-full-width
    ><div slot="content" class="p-4">
      <div class="flex gap-6 pt-4">
        <div class="pl-4 flex flex-col items-center">
          <div class="border border-neutral-90 rounded-full p-0.5">
            <lukso-profile
              size="medium"
              profile-url="/images/lyx-token.png"
            ></lukso-profile>
          </div>
        </div>
        <div class="flex flex-col w-full">
          <div class="heading-inter-14-bold pb-1">LUKSO</div>
          <div class="heading-inter-21-semi-bold flex items-center pb-1">
            <span v-if="viewedProfile.balance">{{
              $formatNumber(fromWei(viewedProfile.balance, 'ether'))
            }}</span>
            <span v-else>0</span>
            <span class="paragraph-inter-14-semi-bold text-neutral-60 ml-2">{{
              appStore.currentNetwork.token
            }}</span>
          </div>
          <div class="paragraph-inter-12-regular pb-4 hidden">$ 123.24</div>
          <div class="flex justify-end w-full pt-4">
            <lukso-button
              v-if="
                status.isConnected &&
                viewedProfile.address === connectedProfile.address
              "
              size="small"
              variant="secondary"
              @click="handleSendAsset"
              >{{ $formatMessage('button_send') }}</lukso-button
            >
          </div>
        </div>
      </div>
    </div>
  </lukso-card>
</template>
