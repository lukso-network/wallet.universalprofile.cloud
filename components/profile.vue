<script setup lang="ts">
const { profile } = useProfileStore()
</script>

<template>
  <div class="relative">
    <lukso-card
      variant="profile"
      :background-url="profile.backgroundImageUrl"
      :profile-url="profile.profileImageUrl"
      :profile-address="profile.address"
      is-full-width
      custom-class="rounded-24 shadow-neutral-drop-shadow"
    >
      <div slot="content" class="px-6 pb-6 flex flex-col items-center">
        <lukso-username
          v-if="profile.name"
          :name="profile.name"
          size="large"
        ></lukso-username>
        <lukso-username
          :address="profile.address"
          :size="profile.name ? 'small' : 'large'"
          slice-by="40"
        ></lukso-username>
      </div>
    </lukso-card>
  </div>
</template>
