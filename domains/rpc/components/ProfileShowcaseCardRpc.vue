<script setup lang="ts">
type Props = {
  address: Address
}
const props = defineProps<Props>()
const profile = useProfile().getProfile(props.address)
const profileBackground = useProfileBackground(profile, 300)
const profileAvatar = useProfileAvatar(profile, 80)
const isLoading = computed(() => {
  return profile.value?.isLoading
})
</script>

<template>
  <NuxtLink :to="profileRoute(address)" class="flex w-full">
    <lukso-card
      v-if="!isLoading"
      variant="profile"
      :background-url="profileBackground?.url"
      :profile-url="profileAvatar?.url"
      :profile-address="isLoading ? '' : address"
      shadow="small"
      is-hoverable
      custom-class="rounded-24"
      class="transition hover:scale-[1.01]"
      height="230"
    >
      <div slot="content" class="flex flex-col items-center px-4 pb-8 pt-1">
        <div class="flex">
          <lukso-username
            v-if="profile?.name"
            :name="profile?.name.toLowerCase()"
            :address="address"
            size="large"
            max-width="220"
          ></lukso-username>
          <lukso-username
            v-else
            name="anonymous-profile"
            :address="address"
            size="large"
            max-width="220"
            hide-prefix
          ></lukso-username>
        </div>
      </div>
    </lukso-card>
    <lukso-card
      v-else
      variant="profile"
      size="small"
      is-hoverable
      custom-class="rounded-24 shadow-neutral-drop-shadow"
      class="transition hover:scale-[1.01]"
      height="230"
    >
      <div slot="content" class="flex flex-col items-center px-4 pb-8 pt-1">
        <AppPlaceholderLine class="h-[22px] w-1/2" />
      </div>
    </lukso-card>
  </NuxtLink>
</template>
