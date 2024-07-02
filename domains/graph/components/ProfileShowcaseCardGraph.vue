<script setup lang="ts">
type Props = {
  profile: Profile
}

const props = defineProps<Props>()
const profileBackground = useProfileBackground(props.profile, 300)
const profileAvatar = useProfileAvatar(props.profile, 80)
</script>

<template>
  <NuxtLink
    v-if="profile"
    :to="profileRoute(profile.address)"
    class="flex w-full"
  >
    <lukso-card
      variant="profile"
      :background-url="profileBackground?.url"
      :profile-url="profileAvatar?.url"
      shadow="small"
      is-hoverable
      custom-class="rounded-24"
      class="transition hover:scale-[1.01] active:scale-100"
      height="230"
    >
      <div slot="content" class="flex flex-col items-center px-4 pb-8 pt-1">
        <div class="flex">
          <lukso-username
            v-if="profile?.name"
            :name="profile?.name.toLowerCase()"
            :address="profile?.address"
            size="large"
            max-width="220"
          ></lukso-username>
          <lukso-username
            v-else
            name="anonymous-profile"
            :address="profile?.address"
            size="large"
            max-width="220"
            hide-prefix
          ></lukso-username>
        </div>
      </div>
    </lukso-card>
  </NuxtLink>
</template>
