import { ImageMetadata } from '@lukso/lsp-factory.js'

import { Asset, ImageMetadataEncoded } from '@/types/assets'
import { formatUrl } from '@/utils/formatUrl'

const convertBlobToBase64 = (blob: Blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.addEventListener('load', () => {
      resolve(reader.result)
    })
    reader.readAsDataURL(blob)
  })

const fetchBlobAndConvertToBase64 = async (
  request: Request
): Promise<unknown> => {
  return fetch(request)
    .then(response => response.blob())
    .then(convertBlobToBase64)
}

export const fetchAndConvertImage = async (imageUrl: string) => {
  const request = new Request(formatUrl(imageUrl))
  return (await fetchBlobAndConvertToBase64(request)) as Base64EncodedImage
}

/**
 * Gets a correct image url from an array of possible image
 * by checking the max height and min width of the image.
 *
 * @param {ImageMetadata[]} images - an array of images to check
 * @param {number} minWidth - min width
 * @param {number} maxHeight - max height
 * @returns url of the image
 */
export const getImageBySize = (
  images: ImageMetadata[],
  maxHeight: number
): ImageMetadata | undefined => {
  for (const image of images) {
    if (image.height <= maxHeight) {
      return image
    }
  }
  return images.length > 0 ? images[0] : undefined
}

/**
 * Return asset thumb image for given sizes.
 * It first look into icon and if not found take first image from collection
 *
 * @param asset
 * @param minWidth
 * @param minHeight
 * @returns
 */
export const getAssetThumb = (asset?: Asset) => {
  if (!asset) {
    return ''
  }

  if (asset.icon) {
    return asset.icon
  }

  if (asset.images && asset.images.length > 0) {
    return asset.images[0]
  }

  return ''
}

export const getAndConvertImage = async (
  image: ImageMetadata[],
  maxHeight: number
) => {
  const optimalImage = getImageBySize(image, maxHeight)

  if (optimalImage) {
    return {
      ...optimalImage,
      base64: await fetchAndConvertImage(optimalImage.url),
    } as ImageMetadataEncoded
  }
}
