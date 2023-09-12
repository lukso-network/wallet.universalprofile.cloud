<script setup lang="ts">
import { EXTENSION_STORE_LINKS } from '@/shared/config'
import { profileRoute } from '@/shared/routes'

definePageMeta({
  layout: 'landing',
})

const supportedBrowsers = Object.entries(EXTENSION_STORE_LINKS)
  .filter(entry => entry[1] !== '')
  .map(browser => browser[0])

const { status, profile } = useConnectionStore()
const { isUniversalProfileExtension } = useBrowserExtension()

watchEffect(() => {
  if (status.isConnected) {
    try {
      assertAddress(profile.address, 'profile')
      navigateTo(profileRoute(profile.address))
    } catch (error) {
      console.error(error)
    }
  }
})
</script>

<template>
  <div class="relative">
    <div
      :class="{
        'opacity-0': status.isProfileLoading,
        'opacity-100': !status.isProfileLoading,
      }"
      class="max-w-[950px] py-20 px-4 mx-auto relative grid grid-cols-1 gap-7 h-full transition-opacity duration-300 delay-500 sm:items-center sm:grid-cols-2 sm:pt-24"
    >
      <div class="hidden sm:block">
        <img
          src="/images/wallet.png"
          alt=""
          class="max-w-full lg:max-w-[484px]"
        />
      </div>
      <div>
        <lukso-card is-full-width>
          <div slot="content" class="p-10 pt-16 relative">
            <img
              src="/images/up-cube.png"
              alt=""
              class="w-[100px] absolute -top-[50px]"
            />
            <div class="heading-apax-24-medium">
              {{ $formatMessage('landing_hero_title') }}
            </div>
            <div class="paragraph-inter-16-regular pt-6">
              <lukso-sanitize
                v-if="isUniversalProfileExtension()"
                :html-content="
                  $formatMessage('landing_hero_description_not_connected')
                "
              ></lukso-sanitize>
              <lukso-sanitize
                v-else
                :html-content="
                  $formatMessage('landing_hero_description_no_extension')
                "
              ></lukso-sanitize>
            </div>
            <ConnectOrInstallButton />
          </div>
        </lukso-card>
        <div
          class="flex pt-6 gap-2 justify-center items-center paragraph-inter-12-regular"
        >
          <span>{{ $formatMessage('landing_hero_supported_browsers') }}</span>
          <lukso-icon
            v-for="browser in supportedBrowsers"
            :key="browser"
            :name="`logo-${browser}`"
            color="neutral-20"
            secondary-color="neutral-100"
          />
        </div>
      </div>
    </div>
    <lukso-icon
      v-if="status.isProfileLoading"
      name="progress-indicator-alt"
      size="x-large"
      class="absolute top-1/2 left-1/2 transform"
    ></lukso-icon>
  </div>
</template>
