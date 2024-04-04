<script setup lang="ts">
const profile = useProfile().viewedProfile()
const { isMobile } = useDevice()
const { showModal } = useModal()

const profileBackground = useProfileBackground(profile, 880)
const profileAvatar = useProfileAvatar(profile, 96)

const handlePreviewProfileImage = () => {
  const image = profile.value?.profileImage

  if (!image) {
    return
  }

  showModal({
    template: 'AssetImage',
    data: {
      asset: image
    },
    size: 'auto'
  })
}
</script>

<template>
  <div class="relative">
    <lukso-card
      variant="hero"
      :background-url="profileBackground?.url"
      is-full-width
      shadow="small"
      :border-radius="isMobile ? 'none' : 'medium'"
      class="-mx-4 -mt-6 mb-22 w-screen sm:mx-0 sm:mt-0 sm:w-full"
    >
      <div slot="content" class="relative flex size-full flex-col items-center">
        <ProfileCardShareLink :profile="profile" />
        <div class="relative bottom-[-195px] text-center">
          <div class="flex cursor-pointer flex-col items-center">
            <lukso-profile
              :profile-url="profileAvatar?.url"
              :profile-address="profile?.address"
              size="x-large"
              has-identicon
              class="relative z-[1] inline-flex rounded-full outline outline-4 outline-neutral-100 transition hover:scale-[1.02]"
              @click="handlePreviewProfileImage"
            >
            </lukso-profile>
            <lukso-tooltip
              variant="light"
              offset="110"
              is-clipboard-copy
              :copy-text="$formatMessage('profile_card_copy_address')"
              :copy-value="profile?.address"
            >
              <div
                class="paragraph-ptmono-16-regular relative -top-10 h-0 text-14 opacity-10 transition hover:opacity-30 md:text-24"
              >
                {{ profile?.address }}
              </div>
            </lukso-tooltip>
          </div>
          <lukso-username
            v-if="profile?.name"
            :name="profile?.name.toLowerCase()"
            :address="profile?.address"
            address-color="neutral-80"
            size="large"
            max-width="350"
            class="mt-4"
          ></lukso-username>
          <lukso-username
            v-else
            :name="$formatMessage('profile_default_name')"
            :address="profile?.address"
            address-color="neutral-80"
            size="large"
            max-width="350"
            class="mt-4"
            hide-prefix
          ></lukso-username>
        </div>
      </div>
    </lukso-card>
  </div>
</template>
