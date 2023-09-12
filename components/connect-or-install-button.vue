<script setup lang="ts">
const { connect, isUniversalProfileExtension } = useBrowserExtension()
const { status } = useConnectionStore()

const handleConnect = async () => {
  connect()
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
  <lukso-button
    v-if="isUniversalProfileExtension()"
    @click="handleConnect"
    variant="landing"
    custom-class="mt-6"
    is-full-width
    :disabled="status.isConnecting ? true : undefined"
  >
    {{ $formatMessage('connect_or_install_button_connect') }}
  </lukso-button>
  <lukso-button
    v-else
    variant="landing"
    custom-class="mt-6"
    is-full-width
    :is-link="browserSupportExtension ? 'true' : undefined"
    :href="extensionStore.url"
    :disabled="!browserSupportExtension ? 'true' : undefined"
  >
    <lukso-icon
      :name="extensionStore.icon"
      color="neutral-100"
      secondary-color="purple-51"
      class="mr-2"
    />
    <span v-if="browserSupportExtension">
      {{ $formatMessage('connect_or_install_button_install') }}
    </span>
    <span v-else>
      {{ $formatMessage('connect_or_install_button_coming_soon') }}
    </span>
  </lukso-button>
</template>
