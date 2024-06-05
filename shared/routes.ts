import assert from 'assert'

export const tokenRoute = (tokenAddress: Address) => `/asset/${tokenAddress}`

export const nftRoute = (nftAddress: Address, tokenId: string) =>
  `/asset/${nftAddress}/tokenId/${tokenId}`

export const gotoContract = (address: Address) => `/contract/${address}`

export const profileRoute = (profileAddress?: Address) => {
  assert(profileAddress, 'Missing profile address in route')
  return `/${profileAddress}`
}

export const sendRoute = (profileAddress?: Address) => {
  assert(profileAddress, 'Missing profile address in route')
  return `/${profileAddress}/send`
}

export const homeRoute = () => '/'

export const notFoundRoute = () => '/404'

export const lyxDetailsRoute = (profileAddress: Address) =>
  `/${profileAddress}/lyx-details`

export const buyLyxRoute = (profileAddress: Address) =>
  `/${profileAddress}/buy-lyx`

export const settingsRoute = () => {
  return '/settings'
}

export const settingsMissingAssetsRoute = () => {
  return '/settings/missing-assets'
}

export const settingsMissingAssetsAddRoute = (assetAddress?: Address) => {
  assert(assetAddress, 'Missing asset address in route')
  return `/settings/missing-assets/${assetAddress}/add`
}

export const settingsMissingAssetsSuccessRoute = (assetAddress?: Address) => {
  assert(assetAddress, 'Missing asset address in route')
  return `/settings/missing-assets/${assetAddress}/success`
}
