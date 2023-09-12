import { ImageMetadata } from '@lukso/lsp-factory.js'

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

export const fetchBlobAndConvertToBase64 = async (
  request: Request
): Promise<unknown> => {
  return fetch(request)
    .then(response => response.blob())
    .then(convertBlobToBase64)
}

export const fetchAndConvertImage = async (
  imageUrl: string
): Promise<string> => {
  const request = new Request(formatUrl(imageUrl))
  return (await fetchBlobAndConvertToBase64(request)) as string
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
export const getImageUrlBySize = (
  images: ImageMetadata[],
  minWidth: number,
  maxHeight: number
): string | undefined => {
  for (const image of images) {
    if (image.width >= minWidth && image.height <= maxHeight) {
      return formatUrl(image.url)
    }
  }
  return images.length > 0 ? formatUrl(images[0].url) : undefined
}
