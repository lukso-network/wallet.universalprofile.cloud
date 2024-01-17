import { ProfileRepository } from '@/repositories/profile'

import type { LSP3ProfileMetadata } from '@lukso/lsp-smart-contracts'
import type { NuxtApp } from '@/types/plugins'

/**
 * Put fetched profile into the store
 *
 * @param profileAddress - profile address
 */
export const fetchAndStoreProfile = async (profileAddress: Address) => {
  const profileRepo = useRepo(ProfileRepository)
  const profile = await fetchProfile(profileAddress)

  profileRepo.saveProfile(profile)
}

/**
 * Fetch profile from the index
 *
 * @param profileAddress - profile address
 * @returns
 */
export const fetchProfile = async (profileAddress: Address) => {
  const { isLoadingProfile } = storeToRefs(useAppStore())
  const { $fetchIndexedProfile } = useNuxtApp() as unknown as NuxtApp
  const profileIndexedData = await $fetchIndexedProfile(profileAddress)

  if (!profileIndexedData || profileIndexedData.type !== 'LSP3Profile') {
    throw new NotFoundIndexError(profileAddress)
  }

  try {
    isLoadingProfile.value = true

    const profile = await createProfileObject(
      profileAddress,
      profileIndexedData?.LSP3Profile
    )

    return profile
  } catch (error: unknown) {
    throw error
  } finally {
    isLoadingProfile.value = false
  }
}

/**
 * Create Profile type object
 *
 * @param profileAddress - address of the profile
 * @param profileMetadata - metadata of the profile
 * @returns
 */
const createProfileObject = async (
  profileAddress: Address,
  profileMetadata?: LSP3ProfileMetadata
): Promise<Profile> => {
  const { links, tags, description, name } = profileMetadata || {}
  const profileImage =
    profileMetadata?.profileImage &&
    createImageObject(Object.values(profileMetadata.profileImage), 96)
  const backgroundImage =
    profileMetadata?.backgroundImage &&
    createImageObject(Object.values(profileMetadata.backgroundImage), 240)
  const { getBalance } = useWeb3(PROVIDERS.RPC)
  const balance = await getBalance(profileAddress)
  const profileImageId = getHash(profileImage)
  const backgroundImageId = getHash(backgroundImage)

  return {
    address: profileAddress,
    name,
    balance,
    links,
    tags,
    description,
    profileImage,
    backgroundImage,
    profileImageId,
    backgroundImageId,
  }
}
