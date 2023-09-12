export const tokenRoute = (profileAddress: Address, tokenAddress: Address) =>
  `/${profileAddress}/token/${tokenAddress}`

export const nftRoute = (
  profileAddress: Address,
  nftAddress: Address,
  tokenId: string
) => `/${profileAddress}/nft/${nftAddress}/tokenId/${tokenId}`

export const profileRoute = (profileAddress: Address) => `/${profileAddress}`

export const sendRoute = (profileAddress: Address) => `/${profileAddress}/send`

export const homeRoute = () => '/'

export const notFoundRoute = () => '/404'
