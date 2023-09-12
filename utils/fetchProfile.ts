import { INTERFACE_IDS, SupportedStandards } from '@lukso/lsp-smart-contracts'

import { PROVIDERS } from '@/types/enums'
import { getDataABI } from '@/shared/abis/getDataABI'
import { InterfaceError } from '@/shared/errors'

export const fetchProfile = async (profileAddress: Address) => {
  const { contract, isEoA } = useWeb3(PROVIDERS.RPC)
  const { supportInterface } = useErc725()

  // EoA check
  if (await isEoA(profileAddress)) {
    throw new Error('The profile is an EoA')
  }

  // interface check
  if (
    !(await supportInterface(profileAddress, INTERFACE_IDS.LSP0ERC725Account))
  ) {
    throw new InterfaceError('LSP0ERC725Account')
  }

  // standard check
  const supportedStandard = await contract(getDataABI, profileAddress)
    .methods['getData(bytes32)'](SupportedStandards.LSP3Profile.key)
    .call()
  if (supportedStandard !== SupportedStandards.LSP3Profile.value) {
    throw new Error(
      `This profile contract doesn't support LSP3UniversalProfile standard`
    )
  }

  const { fetchProfile } = useErc725()
  const profile = await fetchProfile(profileAddress)

  return profile
}
