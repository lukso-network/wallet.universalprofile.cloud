import up from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json'

import type { AbiFunctionFragment } from 'web3'

export const getDataABI: AbiFunctionFragment[] = (
  up.abi as AbiFunctionFragment[]
).filter(({ name }) => name === 'getData')
