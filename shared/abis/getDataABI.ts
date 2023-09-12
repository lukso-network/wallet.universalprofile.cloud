import { AbiItem } from 'web3-utils'
import up from '@lukso/lsp-smart-contracts/artifacts/UniversalProfile.json'

export const getDataABI: AbiItem[] = (up.abi as AbiItem[]).filter(
  ({ name }) => name === 'getData'
)
