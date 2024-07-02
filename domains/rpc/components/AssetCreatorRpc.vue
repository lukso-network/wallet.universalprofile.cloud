<script setup lang="ts">
type Props = {
  creator: Address
  asset?: Address
}

const props = defineProps<Props>()
const { isMobile } = useDevice()
const { formatMessage } = useIntl()
const creator = computed(() => props.creator)
const creatorProfile = useProfile().getProfile(creator)

const handleOpenProfile = (address?: Address) => {
  if (address) {
    navigateTo(profileRoute(address))
  }
}

const verified = computed(() => {
  const issued = useIssuedAssetsRpc().validateAssets(
    props.creator ? [props.creator] : [],
    props.asset
  )

  return issued.value?.get(creator.value) || false
})
const profileImage = useProfileAvatar(creatorProfile, 24)
</script>

<template>
  <lukso-button
    custom-class="px-4"
    variant="secondary"
    :is-full-width="isMobile ? true : undefined"
    @click="handleOpenProfile(creatorProfile?.address)"
  >
    <div class="flex w-full items-center justify-between">
      <div class="flex items-center">
        <lukso-profile
          size="x-small"
          :profile-url="profileImage?.url"
          :profile-address="creatorProfile?.address"
          has-identicon
        ></lukso-profile>
        <lukso-username
          :name="creatorProfile?.name"
          :address="creatorProfile?.address"
          size="small"
          class="pl-2"
          name-color="neutral-20"
        ></lukso-username>
      </div>
      <div class="flex items-center">
        <lukso-tooltip
          v-if="verified"
          variant="success"
          :text="formatMessage('asset_creators_verified')"
          class="ml-2"
        >
          <lukso-icon
            name="complete-filled"
            color="green-54"
            secondary-color="neutral-100"
            size="small"
          ></lukso-icon>
        </lukso-tooltip>
        <lukso-tooltip
          v-else
          variant="danger"
          :text="formatMessage('asset_creators_unverified')"
          class="ml-2"
        >
          <lukso-icon
            name="cross-filled"
            color="red-55"
            secondary-color="neutral-100"
            size="small"
          ></lukso-icon>
        </lukso-tooltip>
      </div>
    </div>
  </lukso-button>
</template>
