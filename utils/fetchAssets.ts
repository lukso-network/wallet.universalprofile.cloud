import LSP3ProfileMetadata from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json'

import { AssetRepository } from '@/repositories/asset'

import type { ERC725JSONSchema } from '@erc725/erc725.js'

export const fetchAssets = async (profileAddress: Address) => {
  const { profile } = useProfile(profileAddress)
  const profileRepo = useRepo(ProfileRepository)
  const assetRepo = useRepo(AssetRepository)
  const { getInstance } = useErc725()
  const erc725 = getInstance(
    profileAddress,
    LSP3ProfileMetadata as ERC725JSONSchema[]
  )
  const { isLoadingAssets } = storeToRefs(useAppStore())
  let receivedAssets, issuedAssets

  // we split LSP5 and LSP12 into separate catch blocks so we can handle them individually and even if
  // one fails, the other is still handled.
  isLoadingAssets.value = true

  try {
    receivedAssets = (await erc725.fetchData('LSP5ReceivedAssets[]'))?.value
    assertArray(receivedAssets)
    assertAddresses(receivedAssets)

    await assetRepo.loadAssets(receivedAssets, profileAddress)
    profileRepo.saveProfile({
      ...profile.value,
      receivedAssetAddresses: receivedAssets,
    })
  } catch (error) {
    console.error(error)
  }

  try {
    issuedAssets = (await erc725.fetchData('LSP12IssuedAssets[]'))?.value
    assertArray(issuedAssets)
    assertAddresses(issuedAssets)

    await assetRepo.loadAssets(issuedAssets, profileAddress)
    profileRepo.saveProfile({
      ...profile.value,
      issuedAssetAddresses: issuedAssets,
    })
  } catch (error) {
    console.error(error)
  }

  isLoadingAssets.value = false
}
