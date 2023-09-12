<script setup lang="ts"></script>

<template>
  <lukso-footer>
    <div
      slot="top"
      class="grid gap-6 items-center sm:gap-10 sm:grid-cols-[repeat(2,max-content)]"
    >
      <a
        href="https://lukso.network/faq"
        class="nav-apax-12-medium-uppercase text-purple-41 hover:underline hover:text-purple-31"
        target="_blank"
      >
        {{ $formatMessage('footer_faq_text') }}
      </a>
      <a
        :href="$formatMessage('footer_need_help_url')"
        class="nav-apax-12-medium-uppercase text-purple-41 hover:underline hover:text-purple-31"
      >
        {{ $formatMessage('footer_need_help_text') }}
      </a>
    </div>

    <div slot="bottom" class="gap-8 flex items-center">
      <a
        href="https://new-creative-economies.foundation/privacy"
        class="paragraph-inter-12-medium hover:underline"
        target="_blank"
      >
        {{ $formatMessage('footer_privacy_policy_text') }}
      </a>
      <a
        href="https://lukso.network/terms"
        class="paragraph-inter-12-medium hover:underline cursor-pointer"
        target="_blank"
      >
        {{ $formatMessage('footer_terms_text') }}
      </a>
    </div>
  </lukso-footer>
</template>
