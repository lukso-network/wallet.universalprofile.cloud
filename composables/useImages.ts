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
  return computed(() => {
    return (
      unref(images)?.map(image => {
        const url = getOptimizedImage(image, width)
        return {
          optimized: unref(url),
          original: image,
        }
      }) || []
    )
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
