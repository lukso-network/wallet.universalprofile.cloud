<script setup lang="ts">
const { profile } = useConnectionStore()
const { disconnect } = useBrowserExtension()

const DROPDOWN_TRIGGER_TAG_NAME = 'LUKSO-PROFILE'
const isOpen = ref(false)

const handleToggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const handleDisconnect = async () => {
  disconnect()
}

onMounted(() => {
  const handleOutsideDropdown = (event: Event) => {
    const element = event.target as HTMLElement

    if (element.tagName === DROPDOWN_TRIGGER_TAG_NAME) {
      return
    }

    isOpen.value = false
  }

  window.addEventListener('click', handleOutsideDropdown)
  return () => {
    window.removeEventListener('click', handleOutsideDropdown)
  }
})
</script>

<template>
  <div class="cursor-pointer relative">
    <lukso-profile
      size="small"
      :profile-url="profile.profileImageUrl"
      @click="handleToggleDropdown"
      :profile-address="profile.address"
      :data-profile-address="profile.address"
      has-identicon
    ></lukso-profile>

    <div
      class="absolute z-[1000] right-0 mt-8 rounded-12 bg-neutral-100 shadow-pink-drop-shadow select-none before:content before:absolute before:top-0 before:right-0 before:-mt-1 before:mr-4 before:w-3 before:h-3 before:bg-neutral-100 before:transform before:rotate-45 animate-fade-in animation-duration-150"
      :class="isOpen ? 'block' : 'hidden'"
    >
      <lukso-button
        variant="text"
        custom-class="text-purple-51 text-12 hover:text-purple-41 uppercase nav-apax-12-medium-uppercase"
        @click="handleDisconnect"
      >
        {{ $formatMessage('header_disconnect') }}
      </lukso-button>
    </div>
  </div>
</template>
