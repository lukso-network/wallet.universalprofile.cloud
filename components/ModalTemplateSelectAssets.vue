<script setup lang="ts">
const connectedProfile = useProfile().connectedProfile()
const { asset: selectedAsset } = storeToRefs(useSendStore())

type Props = {
  closeModal: () => void
}

const profileAddress = computed(() => connectedProfile.value?.address || null)
const props = defineProps<Props>()
const allTokens = useProfileAssets()(profileAddress)

const handleSelectLyx = () => {
  assertAddress(connectedProfile?.value?.address, 'profile')
  navigateTo({
    path: sendRoute(connectedProfile.value.address)
  })
  props.closeModal()
}

const handleSelectAsset = (asset: Asset) => {
  assertAddress(connectedProfile?.value?.address, 'profile')
  sendLog('Selected asset', toRaw(asset))

  let query: SendQueryParams = { asset: asset?.address }

  if (isLsp8(asset)) {
    query = {
      ...query,
      tokenId: asset?.tokenId
    }
  }

  if (isCollectible(asset)) {
    query = {
      ...query,
      amount: '1' // prefill amount field for collectibles
    }
  }

  navigateTo({
    path: sendRoute(connectedProfile.value.address),
    query
  })

  props.closeModal()
}

const ownedAssets = computed(() =>
  allTokens.value
    ?.filter(
      ({ isOwned, standard, balance }) =>
        isOwned &&
        (standard === 'LSP7DigitalAsset' ||
          standard === 'LSP8IdentifiableDigitalAsset') &&
        balance !== '0'
    )
    .sort((a: Asset, _b: Asset) => {
      // put tokens first in the list
      if (isToken(a)) {
        return -1
      }

      if (isCollectible(a)) {
        return 1
      }

      return 0
    })
)
</script>

<template>
  <div class="flex flex-col rounded-12 bg-neutral-98 p-6 text-center">
    <div
      class="heading-inter-21-semi-bold flex items-center justify-between pb-6"
    >
      {{ $formatMessage('modal_select_assets_title') }}
      <lukso-icon
        name="close-lg"
        class="cursor-pointer"
        @click="closeModal"
      ></lukso-icon>
    </div>
    <ul class="-mr-4 max-h-72 space-y-2 overflow-y-auto">
      <li class="mr-4">
        <SelectAssetsLyx
          :is-selected="selectedAsset?.isNativeToken"
          @click="handleSelectLyx"
        />
      </li>
      <li v-for="asset in ownedAssets" :key="asset?.address" class="mr-4">
        <SelectAssetsToken
          :asset="asset"
          :is-selected="
            selectedAsset?.address === asset?.address &&
            selectedAsset?.tokenId === asset?.tokenId
          "
          @on-select="handleSelectAsset"
        />
      </li>
    </ul>
  </div>
</template>
