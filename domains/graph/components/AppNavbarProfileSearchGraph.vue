<script setup lang="ts">
import { isAddress, keccak256 } from 'web3-utils'

import type { ProfileSearchQuery } from '@/.nuxt/gql/default'
import type { SearchProfileResult } from '@lukso/web-components'

const INPUT_FOCUS_DELAY = 10 // small delay for focusing input after element render

const { isSearchOpen } = storeToRefs(useAppStore())
const { formatMessage } = useIntl()
const isSearching = ref<boolean>(false)
const searchTerm = ref<string | Address | undefined>()
const hasNoResults = ref<boolean>(false)
const results = ref<SearchProfileResult[]>()

const searchResults = async () => {
  if (!searchTerm.value) {
    return
  }

  isSearching.value = true

  const { profiles }: ProfileSearchQuery = await GqlProfileSearch({
    search: `%${searchTerm.value}%`,
  })

  if (graphLog.enabled) {
    graphLog('profileSearch', profiles)
  }

  if (profiles.length === 0) {
    hasNoResults.value = true
    isSearching.value = false
    return
  }

  hasNoResults.value = false
  results.value = []

  for (const hit of profiles) {
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
  isSearching.value = false
}

const handleSearch = async (event: CustomEvent) => {
  searchTerm.value = event.detail.value
  results.value = undefined

  if (!searchTerm.value) {
    isSearching.value = false
    hasNoResults.value = false
    results.value = undefined
    return
  }

  await searchResults()
}

const handleSelect = (event: CustomEvent) => {
  const selection = event.detail.value
  const { address } = selection
  searchTerm.value = address
  results.value = undefined
  isSearchOpen.value = false

  if (isAddress(address)) {
    navigateTo(profileRoute(address))
    searchTerm.value = undefined
  }
}

watchEffect(() => {
  if (isSearchOpen.value) {
    setTimeout(() => {
      const luksoSearch = document
        .getElementById('mobile-search')
        ?.querySelector('lukso-search') as unknown as HTMLElement
      const inputElement = luksoSearch?.shadowRoot?.querySelector('input')
      inputElement?.focus()
    }, INPUT_FOCUS_DELAY)
  }
})
</script>

<template>
  <lukso-search
    name="profile-search"
    :value="searchTerm"
    :placeholder="formatMessage('profile_search_placeholder')"
    :results="JSON.stringify(results)"
    :is-searching="isSearching ? 'true' : undefined"
    :show-no-results="hasNoResults ? 'true' : undefined"
    :no-results-text="formatMessage('profile_search_no_results')"
    is-full-width
    class="w-full"
    @on-search="handleSearch"
    @on-select="handleSelect"
  ></lukso-search>
</template>
