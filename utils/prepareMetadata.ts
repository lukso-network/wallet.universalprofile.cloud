import { LUKSO_PROXY_API } from '@/shared/config'

export const prepareMetadata = (metadata: LSP4DigitalAssetMetadataJSON) => {
  const validatedMetadata = validateLsp4Metadata(metadata.LSP4Metadata)

  const { links, description, attributes } = validatedMetadata || {}
  const assets =
    validatedMetadata?.assets?.map((asset: AssetMetadata) => {
      const { url } = asset as FileAsset

      // TODO add url verification check
      return url
        ? ({
            ...asset,
            src: url.startsWith('ipfs://') ? resolveUrl(url) : url,
          } as AssetMetadata & { src: string })
        : asset
    }) || []
  const images = prepareImagesNested(validatedMetadata?.images)
  const icon = prepareImages(validatedMetadata?.icon)

  return {
    images,
    icon,
    attributes,
    description,
    links,
    assets,
  } as LSP4DigitalAssetMetadata
}

export const prepareImage = (image: any) => {
  const { verification, url } = image

  return {
    ...image,
    src: url.startsWith('ipfs://')
      ? `${LUKSO_PROXY_API}/image/${url.replace(/^ipfs:\/\//, '')}?method=${verification?.method || '0x00000000'}&data=${verification?.data || '0x'}`
      : url,
  } as Image & { src: string }
}

export const prepareImages = (images?: any[]) => {
  return (
    images?.map((image: any) => {
      return prepareImage(image)
    }) || []
  )
}

export const prepareImagesNested = (imagesNested?: any[][]) => {
  return (
    imagesNested?.map((images: any) => {
      return (
        images?.map((image: any) => {
          return prepareImage(image)
        }) || []
      )
    }) || []
  )
}
