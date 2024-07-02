import type { ImageMetadata, LinkMetadata } from '@lukso/lsp-smart-contracts'

export type Maybe<T> = NonNullable<T> | undefined | null

/**
 * Check and return valid LSP3 metadata
 *
 * @param LSP3Metadata
 * @returns
 */
export const validateLsp3Metadata = (metadata: unknown) => {
  if (!metadata || typeof metadata !== 'object') {
    return {
      name: '',
      description: '',
      profileImage: [],
      backgroundImage: [],
      tags: [],
      links: [],
      avatar: [],
    }
  }

  const profileImage =
    'profileImage' in metadata ? validateImage(metadata?.profileImage) : []
  const backgroundImage =
    'backgroundImage' in metadata
      ? validateImage(metadata?.backgroundImage)
      : []
  const avatar = 'avatar' in metadata ? validateAssets(metadata?.avatar) : []
  const name = 'name' in metadata ? validateName(metadata?.name) : ''
  const tags = 'tags' in metadata ? validateTags(metadata?.tags) : []
  const links = 'links' in metadata ? validateLinks(metadata?.links) : []
  const description =
    'description' in metadata ? validateDescription(metadata?.description) : ''

  return {
    name,
    description,
    profileImage,
    backgroundImage,
    tags,
    links,
    avatar,
  }
}

/**
 * Check and return valid LSP4 metadata
 *
 * @param LSP4MetadataJSON
 * @returns
 */
export const validateLsp4Metadata = (
  metadata: Maybe<LSP4DigitalAssetMetadata>
): LSP4DigitalAssetMetadata => {
  const images = validateImages(metadata?.images)
  const links = validateLinks(metadata?.links)
  const assets = validateAssets(metadata?.assets)
  const icon = validateImage(metadata?.icon)
  const description = metadata?.description || ''
  const attributes = validateAttributes(metadata?.attributes)

  return {
    description,
    links,
    images,
    assets,
    icon,
    attributes,
  }
}

/**
 * Validates if the given image object follows proper structure
 * It checks for old format using `hash` property and
 * new format using `verification` property.
 *
 * @param image - image object to be validated
 * @returns - true if validation passes, false otherwise
 */
export const validateImage = (images: unknown): ImageMetadata[] => {
  return (
    (Array.isArray(images) &&
      images?.filter(image => {
        const imageCheck =
          'url' in image ||
          ('url' in image &&
            'verification' in image &&
            'verification.data' in image &&
            'verification.method' in image)

        if (!imageCheck) {
          console.warn('Invalid LSP4 image metadata', image)
        }

        return image.url
      })) ||
    []
  )
}

/**
 * Validates if the given image collections follows proper structure
 *
 * @param imageCollections
 * @returns
 */
export const validateImages = (imageCollections: unknown): ImageMetadata[][] =>
  Array.isArray(imageCollections)
    ? imageCollections
        ?.map(images => validateImage(images))
        .filter(array => array.length)
    : []

/**
 * Validate if the given asset object follows proper structure
 *
 * @param asset
 * @returns
 */
export const validateAssets = (assets: unknown): AssetMetadata[] => {
  if (!Array.isArray(assets) || !assets?.length) {
    return []
  }

  return (
    assets?.filter(asset => {
      return (
        'address' in asset ||
        (asset.url && asset.fileType) ||
        (asset.url &&
          asset.fileType &&
          asset.verification &&
          asset.verification.data &&
          asset.verification.method)
      )
    }) || []
  )
}

/**
 * Validates the given attribute object follows proper structure
 *
 * @param attribute
 * @returns
 */
export const validateAttributes = (
  attributes: unknown
): AttributeMetadata[] => {
  if (!Array.isArray(attributes) || !attributes?.length) {
    return []
  }

  const validateAttributes = attributes?.filter(attribute => {
    return (
      attribute.key ||
      attribute.value ||
      attribute.type === 'string' ||
      attribute.type === 'number' ||
      attribute.type === 'date'
    )
  })

  if (!validateAttributes.length) {
    console.warn('Invalid LSP4 attribute')
    return []
  }

  return validateAttributes
}

/**
 * Validates if the given link object follows proper structure
 *
 * @param link
 * @returns
 */
export const validateLinks = (links: unknown): LinkMetadata[] => {
  return (
    (Array.isArray(links) &&
      links?.filter(link => {
        return link?.title && link?.url
      })) ||
    []
  )
}

/**
 * Validates if the given name is lowercase string
 *
 * @param name - name to be checked
 * @returns - validated name
 */
export const validateName = (name: unknown): string => {
  return typeof name === 'string' ? name.toLowerCase() : ''
}

/**
 * Validate description is string with max 200 characters
 *
 * @param description - description to validate
 * @returns - validated description
 */
export const validateDescription = (description: unknown): string => {
  return typeof description === 'string' ? description.slice(0, 200) : ''
}

/**
 * Validate if tags are strings with max 3 for profile
 *
 * @param tags
 * @returns
 */
export const validateTags = (tags: unknown): string[] => {
  return (
    (Array.isArray(tags) &&
      tags?.slice(0, 3).filter((tag: string) => {
        return typeof tag === 'string' && tag !== ''
      })) ||
    []
  )
}
