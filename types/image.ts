import type { ImageMetadata } from '@lukso/lsp3-contracts'

export type Image = {
  hash?: string
  width?: number
  height?: number
  hashFunction?: string
  url?: string
  verification?: ImageMetadata['verification']
  src?: string
}

export type Base64EncodedImage = `data:image/jpeg;base64${string}`

export type ImageItem = {
  url: string | null
  verified: ImageVerifiedStatus | null
}
