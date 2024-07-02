<script setup lang="ts">
type Props = {
  creator?: Creator
  asset?: Asset
}

const props = defineProps<Props>()
const { isMobile } = useDevice()
const { formatMessage } = useIntl()

const handleOpenProfile = (address?: Address) => {
  if (address) {
    navigateTo(profileRoute(address))
  }
}

const verified = computed(() => {
  const issued = useIssuedAssetsGraph().validateAssets(
    props.creator ? [props.creator] : [],
    props.asset?.address
  )
  return (
    (props.creator?.address && issued.value?.get(props.creator?.address)) ||
    false
  )
})

const profileImage = useProfileAvatar(props.creator, 24)
</script>

<template>
  <lukso-button
    v-if="creator"
    custom-class="px-4"
    variant="secondary"
    :is-full-width="isMobile ? true : undefined"
    @click="handleOpenProfile(creator?.address)"
  >
    <div class="flex w-full items-center justify-between">
      <div class="flex items-center">
        <lukso-profile
          size="x-small"
          :profile-url="profileImage?.url"
          :profile-address="creator?.address"
          has-identicon
        ></lukso-profile>
        <lukso-username
          :name="creator?.name"
          :address="creator?.address"
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
