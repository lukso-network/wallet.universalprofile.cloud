<script setup lang="ts">
import { homeRoute } from '@/shared/routes'

const { formatMessage } = useIntl()

const handleVisitHomepage = () => {
  navigateTo(homeRoute())
}

const handleGetHelp = () => {
  window.open(formatMessage('not_found_get_help_url'), '_blank')
}
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full px-6">
    <img
      src="/images/up-error-large.png"
      alt=""
      class="w-full px-20 pt-10 sm:w-[341px] sm:px-0"
    />
    <div class="pb-2 heading-apax-24-medium">
      {{ $formatMessage('not_found_title') }}
    </div>
    <div class="pb-10 paragraph-inter-16-regular text-center">
      {{ $formatMessage('not_found_text') }}
    </div>
    <div class="grid gap-4 sm:grid-cols-2 w-full sm:w-auto pb-8 sm:pb-20">
      <lukso-button
        variant="landing"
        @click="handleVisitHomepage"
        is-full-width
      >
        {{ $formatMessage('not_found_homepage') }}
      </lukso-button>
      <lukso-button variant="text" @click="handleGetHelp" is-full-width>
        {{ $formatMessage('not_found_get_help') }}
      </lukso-button>
    </div>
  </div>
</template>
