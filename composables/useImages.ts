export const useProfileAvatar = (
  profile: MaybeRef<Profile | null | undefined>,
  width: number
): Ref<ImageItem | null> => {
  const profileAvatar = computed(() => {
    const { profileImage } = unref(profile) || {}
    return profileImage
  }) as Ref<Image[] | null>

  return getOptimizedImage(profileAvatar, width)
}

export const useProfileBackground = (
  profile: MaybeRef<Profile | null | undefined>,
  width: number
): Ref<ImageItem | null> => {
  const profileBackground = computed(() => {
    const { backgroundImage } = unref(profile) || {}
    return backgroundImage
  }) as Ref<Image[] | null>

  return getOptimizedImage(profileBackground, width)
}

export const useOptimizedImages = (
  images: MaybeRef<Image[][] | null>,
  width: number
): Ref<Array<{ optimized: ImageItem | null; original: Image[] | null }>> => {
  const imagesOriginal = ref<Array<Image[]>>([])
  const imagesFinal = ref<(ImageItem | null)[]>([])
  return computed(() => {
    unref(images)?.map((image, index) => {
      if (
        !imagesOriginal.value[index] ||
        imagesOriginal.value[index].some(
          (imageItem, index) =>
            imageItem.url !== image[index].url ||
            imageItem?.verification?.data !== image[index].verification?.data
        )
      ) {
        imagesOriginal.value[index] = image
        imagesFinal.value[index] = null
      }
      if (imagesOriginal.value[index].length > image.length) {
        imagesOriginal.value.length = image.length
      }
      imagesFinal.value = imagesOriginal.value[index].map(
        (imageItem, index) => {
          const oldImageItem = imagesFinal.value[index]
          if (!oldImageItem) {
            return getOptimizedImage(image, width).value
          }
          return oldImageItem
        }
      )
    })
    return imagesOriginal.value?.map((image, index) => {
      return {
        optimized: unref(imagesFinal.value[index]),
        original: image
      }
    })
  })
}

export const useOptimizedImage = (
  image: MaybeRef<Image[] | null>,
  width: number
) => {
  return getOptimizedImage(image, width)
}

export const useAssetImage = (
  asset: MaybeRef<Asset | null | undefined>,
  useIcon: boolean,
  width: number
): Ref<ImageItem | null> => {
  const assetIcon = computed(() => {
    const { resolvedMetadata } = unref(asset) || {}
    const { icon } = resolvedMetadata || {}
    return icon
  }) as Ref<Image[] | null>
  const assetImage = computed(() => {
    const { resolvedMetadata } = unref(asset) || {}
    const { images } = resolvedMetadata || {}
    return images?.[0] || null
  }) as Ref<Image[] | null>
  const currentIcon = getOptimizedImage(assetIcon, width)
  const currentImage = getOptimizedImage(assetImage, width)
  const assetIsNativeToken = computed(() => {
    const { isNativeToken } = unref(asset) || {}
    return isNativeToken
  })

  return computed(() => {
    if (assetIsNativeToken.value) {
      return { url: ASSET_LYX_ICON_URL, verified: null }
    }

    if (useIcon) {
      return currentIcon.value
    }

    if (currentImage.value) {
      return currentImage.value
    }

    if (currentImage.value) {
      return currentIcon.value
    }

    if (!assetIcon.value && !assetImage.value) {
      return { url: null, verified: null }
    }
    return { url: IMAGE_ERROR_URL, verified: null }
  })
}
