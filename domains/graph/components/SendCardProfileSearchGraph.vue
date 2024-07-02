<script setup lang="ts">
import { isAddress, keccak256 } from 'web3-utils'

import type { ProfileSearchQuery } from '@/.nuxt/gql/default'
import type { SearchProfileResult } from '@lukso/web-components'

const BLUR_DELAY = 100

const { receiver } = storeToRefs(useSendStore())
const { isEoA } = useWeb3(PROVIDERS.RPC)
const isSearchingReceiver = ref<boolean>(false)
const searchTerm = ref<string | Address | undefined>(receiver.value?.address)
const hasNoResults = ref<boolean>(false)
const results = ref<SearchProfileResult[]>()

const searchResults = async () => {
  const searchResults = await searchProfile(searchTerm.value)

  if (!searchResults || searchResults?.length === 0) {
    hasNoResults.value = true
    return
  }

  hasNoResults.value = false
  results.value = []

  for (const hit of searchResults) {
    const metadata = validateLsp3Metadata({
      name: hit.name,
      profileImage: hit.profileImages,
    })
    const profile = await browserProcessMetadata(metadata, keccak256)
    results.value.push({
      name: profile?.name,
      address: hit?.id as Address,
      image: profile.profileImage?.[0]?.url,
    })
  }
}

const handleReceiverSearch = async (event: CustomEvent) => {
  searchTerm.value = event.detail.value
  results.value = undefined

  if (!searchTerm.value) {
    isSearchingReceiver.value = false
    hasNoResults.value = false
    results.value = undefined
    receiver.value = undefined
    return
  }

  isSearchingReceiver.value = true

  // in user paste address, which might be EoA, we load profile right away
  if (isAddress(searchTerm.value)) {
    assertAddress(searchTerm.value)

    if (await isEoA(searchTerm.value)) {
      receiver.value = {
        address: searchTerm.value,
        standard: 'EOA',
      }
      hasNoResults.value = false
      isSearchingReceiver.value = false
      return
    }
  } else {
    receiver.value = undefined
  }

  await searchResults()
  isSearchingReceiver.value = false
}

const selectProfile = async (address?: Address) => {
  const searchResults = await searchProfile(address)

  if (!searchResults || searchResults.length === 0) {
    return
  }

  results.value = undefined

  const selectedProfile = await (async () => {
    for (const hit of searchResults) {
      const metadata = validateLsp3Metadata({
        name: hit.name,
        profileImage: hit.profileImages,
      })
      const profile = await browserProcessMetadata(metadata, keccak256)
      return {
        name: profile?.name,
        address: hit?.id as Address,
        image: profile.profileImage?.[0]?.url,
      }
    }
  })()

  receiver.value = {
    address,
    name: selectedProfile?.name,
    profileImage: [
      {
        src: selectedProfile?.image,
      },
    ],
  }
}

const searchProfile = async (searchTerm?: string) => {
  if (!searchTerm) {
    return
  }

  try {
    const { profiles }: ProfileSearchQuery = await GqlProfileSearch({
      search: `%${searchTerm}%`,
    })

    if (graphLog.enabled) {
      graphLog('profileSearch', profiles)
    }

    return profiles
  } catch (error) {
    console.error(error)
    return []
  }
}

const handleSelect = async (event: CustomEvent) => {
  const selection = event.detail.value as SearchProfileResult
  const { address } = selection
  searchTerm.value = address
  await selectProfile(address)
}

const handleBlur = async (customEvent: CustomEvent) => {
  const address = customEvent.detail.value as Address

  // we add slight delay to allow `on-select` to be triggered first
  setTimeout(async () => {
    if (address && !isAddress(address)) {
      hasNoResults.value = false
    } else {
      await selectProfile(address)
    }
  }, BLUR_DELAY)
}
</script>

<template>
  <lukso-search
    name="receiver"
    :value="searchTerm"
    :placeholder="$formatMessage('send_input_placeholder')"
    :results="JSON.stringify(results)"
    :is-searching="isSearchingReceiver ? 'true' : undefined"
    :show-no-results="hasNoResults ? 'true' : undefined"
    :no-results-text="$formatMessage('profile_search_no_results')"
    is-full-width
    class="mt-4 w-full"
    custom-class="paragraph-ptmono-14-regular"
    @on-search="handleReceiverSearch"
    @on-select="handleSelect"
    @on-blur="handleBlur"
  ></lukso-search>
</template>
