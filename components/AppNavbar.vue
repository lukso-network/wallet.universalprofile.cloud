<script setup lang="ts">
const { connect, disconnect, isUniversalProfileExtension } =
  useBrowserExtension()
const viewedProfile = useProfile().viewedProfile()
const connectedProfile = useProfile().connectedProfile()
const { isConnecting, isConnected, isTestnet, hasSimpleNavbar, isSearchOpen } =
  storeToRefs(useAppStore())

const handleNavigateProfile = async () => {
  try {
    if (isConnected.value) {
      assertAddress(connectedProfile.value?.address, 'profile')
      navigateTo(profileRoute(connectedProfile.value.address))
    } else {
      assertAddress(viewedProfile.value?.address, 'profile')
      navigateTo(profileRoute(viewedProfile.value.address))
    }
  } catch (error) {
    console.error(error)
    navigateTo(homeRoute())
  }
}

const handleNavigateSend = () => {
  try {
    assertAddress(connectedProfile.value?.address, 'profile')
    navigateTo(sendRoute(connectedProfile.value.address))
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

const handleNavigationDiscovery = () => {
  window.open(discoveryDappUrl(), '_self')
}

const handleMobileSearch = () => {
  isSearchOpen.value = !isSearchOpen.value
}

const extensionStoreData = () => {
  const url = browserInfo().storeLink
  const icon = `logo-${browserInfo().id}`

  return {
    icon,
    url
  }
}

const extensionStore = extensionStoreData()
const browserSupportExtension = extensionStore.url !== ''
</script>

<template>
  <lukso-navbar
    is-sticky
    :title="$formatMessage('header_title')"
    :is-testnet="isTestnet ? true : undefined"
    icon="wallet-outline"
    :has-menu="!hasSimpleNavbar ? true : undefined"
    :is-center="hasSimpleNavbar ? true : undefined"
    mobile-breakpoint="lg"
    @on-brand-click="handleNavigationDiscovery"
    @on-icon-click="handleNavigateProfile"
  >
    <div class="flex items-center justify-end" slot="desktop-menu">
      <AppNavbarSendButton v-if="isConnected" />
      <lukso-button
        v-if="isConnected"
        variant="text"
        custom-class="text-12 nav-apax-12-medium-uppercase"
        class="group"
        @click="handleNavigateProfile"
      >
        <span
          class="transition group-hover:text-purple-41"
          :class="{
            'text-purple-41': activePage('profileAddress'),
            'text-purple-63': !activePage('profileAddress'),
          }"
        >
          {{ $formatMessage('header_my_profile') }}
        </span>
      </lukso-button>
      <AppNavbarProfileDropdown v-if="isConnected" />
      <lukso-button
        v-else-if="isUniversalProfileExtension()"
        variant="secondary"
        custom-class="text-12 nav-apax-12-medium-uppercase"
        @click="handleConnect"
        :is-loading="isConnecting ? true : undefined"
        :loading-text="$formatMessage('header_connect')"
      >
        <span class="text-purple-41">
          {{ $formatMessage('header_connect') }}
        </span>
      </lukso-button>
      <lukso-button
        v-else-if="browserSupportExtension"
        variant="secondary"
        is-link
        custom-class="text-12 nav-apax-12-medium-uppercase"
        :href="extensionStore.url"
      >
        <span class="text-purple-41">
          {{ $formatMessage('header_install_extension') }}
        </span>
      </lukso-button>
    </div>
    <div slot="mobile-menu">
      <div className="flex flex-col items-center justify-center h-screen pb-32">
        <lukso-button
          v-if="isConnected"
          variant="text"
          custom-class="text-12 nav-apax-12-medium-uppercase"
          class="group"
          @click="handleNavigateSend"
        >
          <span
            class="transition group-hover:text-purple-41"
            :class="{
              'text-purple-41': activePage('profileAddress-send'),
              'text-purple-63': !activePage('profileAddress-send'),
            }"
          >
            {{ $formatMessage('header_send') }}
          </span>
        </lukso-button>
        <lukso-button
          v-if="isConnected"
          variant="text"
          custom-class="text-12 nav-apax-12-medium-uppercase"
          class="group"
          @click="handleNavigateProfile"
        >
          <span
            class="transition group-hover:text-purple-41"
            :class="{
              'text-purple-41': activePage('profileAddress'),
              'text-purple-63': !activePage('profileAddress'),
            }"
          >
            {{ $formatMessage('header_my_profile') }}
          </span>
        </lukso-button>
        <lukso-button
          v-if="isConnected"
          variant="text"
          custom-class="text-12 nav-apax-12-medium-uppercase"
          class="group"
          @click="handleDisconnect"
        >
          <span class="text-purple-63 transition group-hover:text-purple-41">
            {{ $formatMessage('header_disconnect') }}
          </span>
        </lukso-button>
        <lukso-button
          v-else-if="isUniversalProfileExtension()"
          variant="text"
          custom-class="text-12 nav-apax-12-medium-uppercase"
          class="group"
          @click="handleConnect"
        >
          <span class="text-purple-63 transition group-hover:text-purple-41">
            {{ $formatMessage('header_connect') }}
          </span>
        </lukso-button>
        <lukso-button
          v-else-if="browserSupportExtension"
          variant="text"
          is-link
          custom-class="text-12 nav-apax-12-medium-uppercase"
          class="group"
          :href="extensionStore.url"
        >
          <span class="text-purple-63 transition group-hover:text-purple-41">
            {{ $formatMessage('header_install_extension') }}
          </span>
        </lukso-button>
      </div>
    </div>
    <div slot="mobile-icons" class="flex">
      <lukso-icon
        name="search"
        class="cursor-pointer"
        @click="handleMobileSearch"
      ></lukso-icon>
    </div>
    <div slot="desktop-center" class="w-full">
      <AppNavbarProfileSearch class="w-full" />
    </div>
  </lukso-navbar>
  <AppNavbarMobileSearch v-if="isSearchOpen" />
</template>
