<script setup lang="ts">
import { homeRoute, profileRoute, sendRoute } from '@/shared/routes'
import { IS_TESTNET } from '@/shared/config'

const { profile: connectedProfile, status } = useConnectionStore()
const { connect, disconnect, isUniversalProfileExtension } =
  useBrowserExtension()
const { reloadProfile } = useProfileStore()

const handleNavigateProfile = async () => {
  try {
    if (status.isConnected) {
      assertAddress(connectedProfile.address, 'profile')
      reloadProfile(connectedProfile)
      navigateTo(profileRoute(connectedProfile.address))
    } else {
      navigateTo(homeRoute())
    }
  } catch (error) {
    console.error(error)
  }
}

const handleNavigateSend = () => {
  try {
    assertAddress(connectedProfile.address, 'profile')
    navigateTo(sendRoute(connectedProfile.address))
  } catch (error) {
    console.error(error)
  }
}

const handleConnect = async () => {
  connect()
}

const handleDisconnect = async () => {
  disconnect()
}

const extensionStoreData = () => {
  const url = browserInfo().storeLink
  const icon = `logo-${browserInfo().id}`

  return {
    icon,
    url,
  }
}

const extensionStore = extensionStoreData()
const browserSupportExtension = extensionStore.url !== ''
</script>

<template>
  <lukso-navbar
    is-sticky
    :title="$formatMessage('header_title')"
    :is-testnet="IS_TESTNET"
    icon="wallet-outline"
    has-menu
    @on-brand-click="handleNavigateProfile"
  >
    <div class="w-full flex items-center justify-end" slot="desktop">
      <lukso-button
        v-if="status.isConnected"
        variant="text"
        custom-class="text-purple-51 hover:text-purple-41 uppercase text-12 nav-apax-12-medium-uppercase font-apax font-500"
        @click="handleNavigateSend"
      >
        {{ $formatMessage('header_send') }}
      </lukso-button>
      <lukso-button
        v-if="status.isConnected"
        variant="text"
        custom-class="text-purple-51 hover:text-purple-41 uppercase text-12 nav-apax-12-medium-uppercase font-apax font-500"
        @click="handleNavigateProfile"
      >
        {{ $formatMessage('header_my_profile') }}
      </lukso-button>
      <ProfileDropdown v-if="status.isConnected" />
      <lukso-button
        v-else-if="isUniversalProfileExtension()"
        variant="secondary"
        custom-class="text-purple-51 hover:text-purple-41 uppercase text-12 nav-apax-12-medium-uppercase font-apax font-500"
        @click="handleConnect"
        :is-loading="status.isConnecting ? true : undefined"
        :loading-text="$formatMessage('header_connect')"
      >
        {{ $formatMessage('header_connect') }}
      </lukso-button>
      <lukso-button
        v-else-if="browserSupportExtension"
        variant="secondary"
        is-link
        custom-class="text-purple-51 hover:text-purple-41 uppercase text-12 nav-apax-12-medium-uppercase font-apax font-500"
        :href="extensionStore.url"
      >
        {{ $formatMessage('header_install_extension') }}
      </lukso-button>
    </div>
    <div slot="mobile">
      <div className="flex flex-col items-center justify-center h-screen pb-32">
        <lukso-button
          v-if="status.isConnected"
          variant="text"
          custom-class="text-purple-51 hover:text-purple-41 uppercase text-12 nav-apax-12-medium-uppercase font-apax font-500"
          @click="handleNavigateSend"
        >
          {{ $formatMessage('header_send') }}
        </lukso-button>
        <lukso-button
          v-if="status.isConnected"
          variant="text"
          custom-class="text-purple-51 hover:text-purple-41 uppercase text-12 nav-apax-12-medium-uppercase font-apax font-500"
          @click="handleNavigateProfile"
        >
          {{ $formatMessage('header_my_profile') }}
        </lukso-button>
        <lukso-button
          v-if="status.isConnected"
          variant="text"
          custom-class="text-purple-51 text-12 hover:text-purple-41 uppercase nav-apax-12-medium-uppercase font-apax font-500"
          @click="handleDisconnect"
        >
          {{ $formatMessage('header_disconnect') }}
        </lukso-button>
        <lukso-button
          v-else-if="isUniversalProfileExtension()"
          variant="text"
          custom-class="text-purple-51 text-12 hover:text-purple-41 uppercase nav-apax-12-medium-uppercase font-apax font-500"
          @click="handleConnect"
        >
          {{ $formatMessage('header_connect') }}
        </lukso-button>
        <lukso-button
          v-else-if="browserSupportExtension"
          variant="text"
          is-link
          custom-class="text-purple-51 text-12 hover:text-purple-41 uppercase nav-apax-12-medium-uppercase font-apax font-500"
          :href="extensionStore.url"
        >
          {{ $formatMessage('header_install_extension') }}
        </lukso-button>
      </div>
    </div>
  </lukso-navbar>
</template>
