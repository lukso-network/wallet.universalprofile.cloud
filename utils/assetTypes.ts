import mime from 'mime-types'
import { isAddress } from 'web3-validator'

const DOCUMENT_FILE_EXTENSIONS = ['doc', 'docx', 'pdf', 'txt']
const AUDIO_FILE_EXTENSIONS = ['mp3', 'wav', 'mpga']
const VIDEO_FILE_EXTENSIONS = ['mp4', 'mov', 'avi']
const IMAGE_FILE_EXTENSIONS = [
  'png',
  'jpg',
  'jpeg',
  'gif',
  'svg',
  'tif',
  'tiff',
]
const THREE_DIMENSIONAL_FILE_EXTENSIONS = ['gltf', 'glb']

export type AssetFileType =
  | 'document'
  | 'audio'
  | 'video'
  | 'image'
  | '3d'
  | 'other'
  | 'contract'

/**
 * Get file type for passed asset.
 * We group most common file/mime types into groups.
 *
 * @param asset
 */
export const getAssetType = (asset: AssetMetadata): AssetFileType => {
  if ('address' in asset && isAddress(asset.address)) {
    return 'contract'
  }

  if ('fileType' in asset) {
    const fileExtension = getFileExtension(asset.fileType)

    if (DOCUMENT_FILE_EXTENSIONS.includes(fileExtension)) {
      return 'document'
    }

    if (AUDIO_FILE_EXTENSIONS.includes(fileExtension)) {
      return 'audio'
    }

    if (VIDEO_FILE_EXTENSIONS.includes(fileExtension)) {
      return 'video'
    }

    if (IMAGE_FILE_EXTENSIONS.includes(fileExtension)) {
      return 'image'
    }

    if (THREE_DIMENSIONAL_FILE_EXTENSIONS.includes(fileExtension)) {
      return '3d'
    }
  }

  console.warn(`LSP3 Asset is missing "fileType" field.`, toRaw(asset))

  return 'other'
}

/**
 * Get file extension from mime type or use the one provided by user.
 *
 * @param fileType
 * @returns
 */
export const getFileExtension = (fileType: string): string => {
  return mime.extension(fileType) || fileType
}
