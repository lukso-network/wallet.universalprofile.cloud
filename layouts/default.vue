<script setup lang="ts">
import { notFoundRoute } from '@/shared/routes'
const { setStatus, setAddress, setProfile } = useProfileStore()

const setupWalletProfile = async () => {
  try {
    const profileAddress = useRouter().currentRoute.value.params?.profileAddress

    setStatus('isProfileLoading', true)
    assertAddress(profileAddress, 'wallet')
    setAddress(profileAddress)
    const profile = await fetchProfile(profileAddress)
    setProfile(profile)
  } catch (error) {
    console.error(error)
    navigateTo(notFoundRoute())
  } finally {
    setStatus('isProfileLoading', false)
  }
}

const setupWalletAssets = async () => {
  try {
    const { profile, setOwnedAssets, setStatus, setCreatedAssets } =
      useProfileStore()
    const { fetchAssets } = useErc725()

    setStatus('isAssetLoading', true)
    assertNotUndefined(profile.address)

    setOwnedAssets(await fetchAssets(profile.address, 'LSP5ReceivedAssets[]'))
    setCreatedAssets(await fetchAssets(profile.address, 'LSP12IssuedAssets[]'))
  } catch (error) {
    console.error(error)
  } finally {
    setStatus('isAssetLoading', false)
  }
}

onMounted(async () => {
  await setupWalletProfile()
  await setupWalletAssets()
})
</script>

<template>
  <div class="min-h-screen grid grid-rows-[max-content,auto,max-content]">
    <Navbar />
    <slot />
    <Footer />
  </div>
</template>
