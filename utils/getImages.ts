import { LUKSO_PROXY_API } from '@/shared/config'

import type { Image } from '@/types/image'

const weakMap = new WeakMap<Image, MaybeRef<Image | null>>()

/**
 * Make the image reactive if needed
 * @param imageObject
 * @retursn reactive image object
 */
export const reactiveImageIfNeeded = (
  imageObj: Image
): MaybeRef<Image | null> => {
  if (imageObj?.url?.startsWith('cached://')) {
    if (weakMap.has(imageObj)) {
      return weakMap.get(imageObj) as MaybeRef<Image | null>
    }

    const reference = ref<Image | null>(null)
    weakMap.set(imageObj, reference)
    resolveImageURL(imageObj?.url, IMAGE_ERROR_URL).then(url => {
      reference.value = {
        ...imageObj,
        url,
      }
    })
    return reference as MaybeRef<Image | null>
  }
  return imageObj
}

/**
 * Gets a correct image url from an array of possible image
 * by checking the height of the image.
 * It try to find retina version of the image first, then normal version of the image
 * and lastly the biggest image available.
 *
 * @param {ImageMetadata[]} images - an array of images to check
 * @param {number} height - the desired height of the image
 * @returns url of the image
 */
export const getImageBySize = (
  _images: MaybeRef<Image[] | null>,
  width: number
): MaybeRef<Image | null> => {
  return computed(() => {
    const images = isRef(_images) ? _images.value : _images
    const sortedImagesAscending = (images || []).slice()
    sortedImagesAscending.sort((a, b) => {
      // reverse sort largest last
      if (!a.width || !b.width) {
        return 0
      }
      if (a.width < b.width) {
        return -1
      }
      if (a.width > b.width) {
        return 1
      }
      return 0
    })
    const dpr = window.devicePixelRatio || 1
    const normalImage = sortedImagesAscending?.find(
      image => image.width && image.width > width * dpr
    )

    if (normalImage) {
      const image = reactiveImageIfNeeded(normalImage)
      return isRef(image) ? image.value : image
    }

    // lastly return biggest image available
    const image = reactiveImageIfNeeded(sortedImagesAscending?.slice(-1)[0])
    return isRef(image) ? image.value : image
  })
}

const EXTRACT_CID = new RegExp(
  `^(ipfs://|${LUKSO_PROXY_API}/(ipfs|image)/)(?<cid>.*?)(\\?.*?)?$`
)

/**
 * Get optimized image using Cloudflare proxy
 *
 * @param profileImages
 * @param width
 * @returns
 */
export const getOptimizedImage = (
  image: MaybeRef<Image[] | null>,
  width: number
): ComputedRef<string | null> => {
  const currentImage = getImageBySize(image, width) || {}

  return computed<string | null>(() => {
    const dpr = window.devicePixelRatio || 1
    const { verification, url } = isRef(currentImage)
      ? currentImage?.value || {}
      : currentImage || {}
    const { verified } = (verification || {}) as any

    // if not verified then do verification
    console.log(verified, url)

    if (
      url?.startsWith('ipfs://') ||
      url?.startsWith(`${LUKSO_PROXY_API}/image/`)
    ) {
      const queryParams = {
        ...(verified != null
          ? {
              /* this is already verified no need to verify it on the proxy */
            }
          : {
              method: verification?.method || '0x00000000',
              data: verification?.data || '0x',
            }),
        width: width * dpr,
        ...(dpr !== 1 ? { dpr } : {}),
      }
      const queryParamsString = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')
      const { cid } = EXTRACT_CID.exec(url || '')?.groups || {}

      if (cid) {
        return `${LUKSO_PROXY_API}/image/${cid}?${queryParamsString}`
      }
    }

    return url || null
  })
}
