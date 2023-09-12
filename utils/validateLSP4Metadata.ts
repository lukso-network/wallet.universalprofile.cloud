import { LSP4DigitalAssetJSON } from '@lukso/lsp-factory.js/build/main/src/lib/interfaces/lsp4-digital-asset'

export const validateLSP4MetaData = (
  LSP4MetadataJSON: any
): LSP4DigitalAssetJSON => {
  let images = [[]]
  let links = []
  let assets = []
  let icon = []

  if (LSP4MetadataJSON?.LSP4Metadata?.images?.length) {
    images = LSP4MetadataJSON?.LSP4Metadata?.images?.filter((image: any) => {
      if (!image?.length) return false

      return validateImage(image)
    })
  }

  if (LSP4MetadataJSON?.LSP4Metadata?.links?.length) {
    links = LSP4MetadataJSON?.LSP4Metadata?.links.filter((link: any) => {
      return link?.title && link?.url
    })
  }

  if (LSP4MetadataJSON?.LSP4Metadata?.assets?.length) {
    assets = LSP4MetadataJSON?.LSP4Metadata?.assets.filter((asset: any) => {
      return asset?.hash && asset?.url && asset?.hashFunction && asset.fileType
    })
  }

  if (LSP4MetadataJSON?.LSP4Metadata?.icons?.length) {
    icon = LSP4MetadataJSON?.LSP4Metadata?.icons?.filter((image: any) => {
      return validateIcon(image)
    })
  }

  return {
    LSP4Metadata: {
      description: LSP4MetadataJSON?.LSP4Metadata?.description || '',
      links,
      images,
      assets,
      icon,
    },
  }
}

const validateIcon = (icon: any) => {
  return icon.width && icon.url && icon.hash && icon.hashFunction && icon.height
}

export const validateImage = (image: any[]) => {
  return image.every(size => {
    return (
      size.url && size.hash && size.width && size.height && size.hashFunction
    )
  })
}
