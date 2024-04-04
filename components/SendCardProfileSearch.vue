<script setup lang="ts">
import { isAddress } from 'web3-utils'

import type { SearchProfileResult } from '@lukso/web-components'

const { currentNetwork } = storeToRefs(useAppStore())
const { search } = useAlgoliaSearch<IndexedProfile>(
  currentNetwork.value.indexName
)
const { receiver, receiverError } = storeToRefs(useSendStore())
const { isEoA } = useWeb3(PROVIDERS.RPC)
const isSearchingReceiver = ref<boolean>(false)
const searchTerm = ref<string | Address | undefined>(receiver.value?.address)
const hasNoResults = ref<boolean>(false)
const results = ref<SearchProfileResult[]>()

const searchResults = async () => {
  const searchResults = await search({
    query: searchTerm.value || '',
    requestOptions: {
      hitsPerPage: SEARCH_RESULTS_LIMIT,
      page: 0
    }
  })

  if (searchResults.hits.length === 0) {
    hasNoResults.value = true
    return
  }
  hasNoResults.value = false

  results.value = searchResults.hits.map((hit) => {
    return {
      name: hit.LSP3Profile?.name,
      address: hit.address,
      image: hit.profileImageUrl
    }
  })
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
        standard: 'EOA'
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

const handleSelect = async (event: CustomEvent) => {
  const selection = event.detail.value as SearchProfileResult
  const { address, name, image } = selection
  searchTerm.value = address
  receiver.value = {
    address,
    name,
    profileImage: [
      {
        src: image
      }
    ]
  }
  receiverError.value = ''
  results.value = undefined
}

const handleBlur = () => {
  const { formatMessage } = useIntl()

  // we add slight delay to allow `on-select` to be triggered first
  setTimeout(() => {
    if (searchTerm.value && !isAddress(searchTerm.value)) {
      receiverError.value = formatMessage('errors_invalid_address')
    } else {
      receiverError.value = ''
    }
  }, 300)
}
</script>

<template>
  <lukso-search
    name="receiver"
    :value="searchTerm"
    :placeholder="$formatMessage('send_input_placeholder')"
    :error="receiverError"
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
