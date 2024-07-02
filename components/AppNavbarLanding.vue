<script setup lang="ts">
const { isTestnet, isConnected } = storeToRefs(useAppStore())
const { connect, disconnect, isUniversalProfileExtension } =
  useBrowserExtension()

const handleConnect = async () => {
  connect()
}

const handleDisconnect = async () => {
  disconnect()
}
</script>

<template>
  <lukso-navbar
    :title="$formatMessage('header_title')"
    :is-testnet="isTestnet ? true : undefined"
    is-transparent
    has-menu
  >
    <div class="flex w-full items-center justify-end gap-4" slot="desktop-menu">
      <lukso-button
        variant="text"
        is-link
        :href="BASE_L14_UP_CLOUD_URL"
        target="_self"
        custom-class="text-12 nav-apax-12-medium-uppercase"
        class="group"
      >
        <span class="text-purple-51 transition group-hover:text-purple-41">
          {{ $formatMessage('button_l14_profiles') }}
        </span>
        <lukso-icon
          name="link-3"
          size="small"
          class="ml-2"
          color="purple-51"
        ></lukso-icon>
      </lukso-button>
      <lukso-button
        variant="secondary"
        is-link
        :href="myUpDappBaseUrl()"
        target="_self"
        custom-class="bg-transparent text-purple-51 p-0 border-0"
      >
        <span
          class="nav-apax-12-medium-uppercase flex h-12 items-center rounded-12 border !border-purple-51 px-6"
        >
          {{
            $formatMessage(
              `button_create_${isTestnet ? 'testnet_' : ''}profile`
            )
          }}
        </span>
      </lukso-button>
      <AppNavbarProfileDropdown v-if="isConnected" />
      <lukso-button
        v-else-if="isUniversalProfileExtension()"
        variant="landing"
        custom-class="text-12 nav-apax-12-medium-uppercase"
        class="group"
        @click="handleConnect"
      >
        {{ $formatMessage('header_connect') }}
      </lukso-button>
    </div>
    <div slot="mobile-menu">
      <div className="flex flex-col items-center justify-center h-screen pb-32">
        <lukso-button
          variant="text"
          custom-class="no-underline"
          is-link
          :href="BASE_L14_UP_CLOUD_URL"
          target="_self"
          class="group"
        >
          <span
            class="nav-apax-12-medium-uppercase text-purple-63 group-hover:text-purple-41"
          >
            {{ $formatMessage('button_l14_profiles') }}
          </span>
          <lukso-icon
            name="link-3"
            size="small"
            class="ml-2 group-hover:hidden"
            color="purple-63"
          ></lukso-icon>
          <lukso-icon
            name="link-3"
            size="small"
            class="ml-2 hidden group-hover:inline-block"
            color="purple-41"
          ></lukso-icon>
        </lukso-button>
        <lukso-button
          variant="text"
          custom-class="no-underline"
          is-link
          :href="myUpDappBaseUrl()"
          target="_self"
          class="group"
        >
          <span
            class="nav-apax-12-medium-uppercase text-purple-63 group-hover:text-purple-41"
          >
            {{
              $formatMessage(
                `button_create_${isTestnet ? 'testnet_' : ''}profile`
              )
            }}
          </span>
          <lukso-icon
            name="link-3"
            size="small"
            class="ml-2 group-hover:hidden"
            color="purple-63"
          ></lukso-icon>
          <lukso-icon
            name="link-3"
            size="small"
            class="ml-2 hidden group-hover:inline-block"
            color="purple-41"
          ></lukso-icon>
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
      </div>
    </div>
  </lukso-navbar>
</template>
