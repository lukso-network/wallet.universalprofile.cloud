import { LSP3Profile } from '@lukso/lsp-factory.js'

import { validateImage } from './validateLSP4Metadata'

export const validateLSP3 = (LSP3Metadata: any): LSP3Profile => {
  let tags = []
  let links = []
  let profileImage = []
  let backgroundImage = []

  const lsp3Profile = LSP3Metadata?.value?.LSP3Profile

  if (lsp3Profile?.profileImage?.length) {
    const imageIsValid = validateImage(lsp3Profile?.profileImage)
    profileImage = imageIsValid ? lsp3Profile?.profileImage : []
  }

  if (lsp3Profile?.backgroundImage?.length) {
    const imageIsValid = validateImage(lsp3Profile?.backgroundImage)
    backgroundImage = imageIsValid ? lsp3Profile?.backgroundImage : []
  }

  if (lsp3Profile?.links?.length) {
    links = lsp3Profile?.links.filter((link: any) => {
      return link?.title && link?.url
    })
  }

  if (lsp3Profile?.tags?.length) {
    tags = lsp3Profile?.tags.filter((tag: any) => {
      return tag?.title && tag?.url
    })
  }

  return {
    name: lsp3Profile.name || '',
    description: lsp3Profile.description || '',
    profileImage,
    backgroundImage,
    tags,
    links,
  }
}
