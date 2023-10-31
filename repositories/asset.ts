import { Repository } from 'pinia-orm'

import { Asset, AssetModel } from '@/models/asset'
import { InterfaceId } from '@/types/assets'

export class AssetRepository extends Repository<AssetModel> {
  async loadAssets(addresses: Address[], profileAddress: Address) {
    await Promise.all(
      addresses.map(async assetAddress => {
        const storageAsset = this.repo(AssetModel)
          .where('address', assetAddress)
          .get()

        if (storageAsset && storageAsset.length > 0) {
          // asynchronously fetch token balances
          if (storageAsset[0].standard === 'LSP7DigitalAsset') {
            fetchLsp7Balance(assetAddress, profileAddress).then(balance => {
              this.setBalance(assetAddress, balance)
            })
          }

          return
        }

        const fetchedAsset = await fetchAsset(assetAddress, profileAddress)

        if (fetchedAsset?.length) {
          fetchedAsset && fetchedAsset.length && this.saveAssets(fetchedAsset)
        } else {
          console.warn('Asset not found', assetAddress)
          // we store the asset although it can't be detected so we don't repeat interface check
          this.saveAssets([
            {
              address: assetAddress,
              tokenId: '',
            },
          ])
        }
      })
    )
  }

  async getOwnedTokens() {
    const { viewedProfile } = useViewedProfile()

    if (!viewedProfile.value?.receivedAssetIds) {
      return []
    }

    return this.repo(AssetModel)
      .where('standard', 'LSP7DigitalAsset')
      .where('address', viewedProfile.value.receivedAssetIds)
      .get()
  }

  async getIssuedTokens() {
    const { viewedProfile } = useViewedProfile()

    if (!viewedProfile.value?.issuedAssetIds) {
      return []
    }

    return this.repo(AssetModel)
      .where('standard', 'LSP7DigitalAsset')
      .where('address', viewedProfile.value.issuedAssetIds)
      .get()
  }

  async getOwnedNfts() {
    const { viewedProfile } = useViewedProfile()

    if (!viewedProfile.value?.receivedAssetIds) {
      return []
    }

    return this.repo(AssetModel)
      .where('standard', 'LSP8IdentifiableDigitalAsset')
      .where('address', viewedProfile.value.receivedAssetIds)
      .get()
  }

  async getIssuedNfts() {
    const { viewedProfile } = useViewedProfile()

    if (!viewedProfile.value?.issuedAssetIds) {
      return []
    }

    return this.repo(AssetModel)
      .where('standard', 'LSP8IdentifiableDigitalAsset')
      .where('address', viewedProfile.value.issuedAssetIds)
      .get()
  }

  getOwnedAssets() {
    const { viewedProfile } = useViewedProfile()

    if (!viewedProfile.value?.receivedAssetIds) {
      return []
    }

    return this.repo(AssetModel)
      .where('address', viewedProfile.value.receivedAssetIds)
      .where('standard', (standard: InterfaceId) => standard)
      .get()
  }

  saveAssets(assets?: Asset[]) {
    if (!assets || !assets.length) {
      return
    }

    assets?.forEach(asset => {
      const { icon, images, creators, ...plainAsset } = asset || {}

      // save asset
      this.repo(AssetModel).save(plainAsset)

      // save asset images
      icon && this.repo(ImageModel).save(icon)
      images && images.length && this.repo(ImageModel).save(images)
      creators && creators.length && this.repo(CreatorModel).save(creators)
    })
  }

  getAssetAndImages(address: Address, tokenId = '') {
    const primaryKey = this.primaryKey(address, tokenId)
    const asset = this.repo(AssetModel).find(primaryKey)

    if (!asset) {
      return
    }

    const icon = asset?.iconId && this.repo(ImageModel).find(asset.iconId)
    const images =
      asset?.imageIds &&
      asset.imageIds.length &&
      this.repo(ImageModel).find(asset.imageIds)

    return {
      ...asset,
      icon,
      images,
    } as Asset
  }

  setBalance(address: Address, balance: string) {
    this.repo(AssetModel).where('address', address).update({ balance })
  }

  removeAsset(address: Address, tokenId = '') {
    const primaryKey = this.primaryKey(address, tokenId)
    this.repo(AssetModel).destroy(primaryKey)
  }

  private primaryKey(address: Address, tokenId = '') {
    return `["${address}","${tokenId}"]`
  }
}
