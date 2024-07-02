<script setup lang="ts">
const { isOwned, isCreated, setFilters } = useFilters()
const viewedProfileAddress = getCurrentProfileAddress()
const { isMobile } = useDevice()

const viewedProfile = useProfile().getProfile(viewedProfileAddress)
const allTokens = useProfileAssetsRpc()(viewedProfileAddress)

/**
 * Sort assets ascending (A-Z) by their name
 *
 * @returns
 */
const allTokensSorted = computed(
  () =>
    allTokens.value?.slice().sort((a, b) => {
      const tokenNameA = a.tokenName || ''
      const tokenNameB = b.tokenName || ''

      return tokenNameA.localeCompare(tokenNameB)
    }) || []
)

const tokensOwned = computed(() =>
  allTokensSorted.value?.filter(
    asset =>
      asset.isOwned && isLsp7(asset) && hasBalance(asset) && isToken(asset)
  )
)

const tokensCreated = computed(() =>
  allTokensSorted.value?.filter(
    asset => asset.isIssued && isLsp7(asset) && isToken(asset)
  )
)

const nftsOwned = computed(() =>
  allTokensSorted.value?.filter(
    asset => asset.isOwned && isCollectible(asset) && hasBalance(asset)
  )
)

const nftsCreated = computed(() =>
  allTokensSorted.value?.filter(asset => asset.isIssued && isCollectible(asset))
)

// tokens
const ownedTokensCount = computed(
  () =>
    (tokensOwned.value?.length || 0) +
    (hasBalance(viewedProfile?.value) ? 1 : 0) // +1 if user has LYX token
)

const createdTokensCount = computed(() => tokensCreated.value?.length || 0)

const tokens = computed(() => {
  if (isOwned.value) {
    return tokensOwned.value
  }
  return tokensCreated.value
})

// NFTs
const ownedNftsCount = computed(() => nftsOwned.value?.length || 0)

const createdNftsCount = computed(() => nftsCreated.value?.length || 0)

const nfts = computed(() => {
  if (isOwned.value) {
    return nftsOwned.value || []
  }
  return nftsCreated.value || []
})

// assets (tokens + NFTs)
const ownedAssetsCount = computed(
  () => ownedTokensCount.value + ownedNftsCount.value
)

const createdAssetsCount = computed(
  () => createdTokensCount.value + createdNftsCount.value
)

// empty states
const hasEmptyCreators = computed(
  () => isCreated.value && !createdNftsCount.value && !createdTokensCount.value
)

const hasEmptyTokens = computed(
  () => isOwned.value || (isCreated && createdTokensCount.value)
)

const hasEmptyNfts = computed(
  () =>
    (isOwned.value && ownedNftsCount.value) ||
    (isCreated && createdNftsCount.value)
)

const isLoadingAssets = computed(() =>
  allTokens.value?.some(asset => asset.isLoading)
)
</script>

<template>
  <AppPageLoader :is-loading="viewedProfile?.isLoading">
    <div
      v-if="viewedProfile?.standard === STANDARDS.LSP3"
      class="mx-auto max-w-content"
    >
      <ProfileCard />
      <ProfileDetails />
      <div
        v-if="nftsCreated.length > 0"
        class="heading-inter-17-semi-bold my-10 flex items-center justify-center"
      >
        {{ $formatMessage('asset_creations') }}
        <span
          class="paragraph-inter-10-semi-bold ml-2 rounded-4 border border-neutral-20 bg-neutral-20 px-[2px] py-[1px] text-neutral-100"
          >{{ nftsCreated.length }}</span
        >
      </div>
      <CreationsCarousel
        v-if="nftsCreated.length > 0"
        :assets="nftsCreated"
        class="mb-10"
      />
      <div>
        <ul class="grid gap-2 pt-6 sm:flex sm:grid-cols-2 sm:gap-4 sm:pt-10">
          <li>
            <lukso-button
              :size="isMobile ? 'medium' : 'small'"
              variant="secondary"
              :is-active="isOwned ? true : undefined"
              is-full-width
              :count="ownedAssetsCount"
              @click="setFilters({ assetType: 'owned' })"
              >{{ $formatMessage('asset_filter_owned_assets') }}</lukso-button
            >
          </li>
          <li>
            <lukso-button
              :size="isMobile ? 'medium' : 'small'"
              variant="secondary"
              :is-active="isCreated ? true : undefined"
              is-full-width
              :count="createdAssetsCount"
              @click="setFilters({ assetType: 'created' })"
              >{{ $formatMessage('asset_filter_created_assets') }}</lukso-button
            >
          </li>
        </ul>

        <div v-if="hasEmptyCreators" class="pt-8">
          <h3 class="heading-inter-17-semi-bold pb-2">
            {{ $formatMessage('assets_empty_state_title') }}
          </h3>
          <lukso-sanitize
            :html-content="$formatMessage('assets_empty_state_description')"
          ></lukso-sanitize>
        </div>
        <div v-else>
          <TokenListRpc v-if="hasEmptyTokens" :tokens="tokens" />
          <NftListRpc v-if="hasEmptyNfts" :nfts="nfts" />
          <AppLoader
            v-if="isLoadingAssets"
            class="relative left-[calc(50%-20px)] mt-20"
          />
        </div>
      </div>
    </div>
    <div
      v-else
      class="mx-auto flex h-full max-w-72 flex-col items-center justify-center text-center"
    >
      <img src="/images/up-error.png" alt="" class="mb-6 w-36" />
      <div class="heading-inter-21-semi-bold mb-4">
        {{ $formatMessage('not_up_title') }}
      </div>
      <div class="paragraph-inter-16-regular mb-6">
        {{ $formatMessage('not_up_description') }}
      </div>
      <lukso-button
        variant="landing"
        is-link
        :href="explorerContractUrl(viewedProfile?.address)"
        class="mb-8"
        >{{ $formatMessage('not_up_button') }}</lukso-button
      >
    </div>
  </AppPageLoader>
</template>
