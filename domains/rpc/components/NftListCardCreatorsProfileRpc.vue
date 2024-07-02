<script setup lang="ts">
type Props = {
  profileAddress?: Address
  hasName?: boolean
  count?: number
}

const props = defineProps<Props>()
const address = computed(() => props.profileAddress)
const creatorProfile = useProfile().getProfile(address)
const profileAvatar = useProfileAvatar(creatorProfile, 24)
</script>

<template>
  <div class="flex h-6">
    <div
      v-if="count"
      class="paragraph-inter-10-semi-bold flex size-6 items-center justify-center rounded-full bg-neutral-100 outline outline-2 outline-neutral-90"
    >
      +{{ count }}
    </div>
    <lukso-profile
      v-else
      size="x-small"
      :profile-url="profileAvatar?.url"
      :profile-address="creatorProfile?.address"
      has-identicon
    ></lukso-profile>
    <div class="pl-1" v-if="hasName">
      <div class="paragraph-inter-10-semi-bold text-neutral-60">
        {{ $formatMessage('asset_created_by') }}
      </div>
      <lukso-username
        :name="creatorProfile?.name"
        :address="creatorProfile?.address"
        size="x-small"
        class="flex"
        name-color="neutral-20"
      ></lukso-username>
    </div>
  </div>
</template>
