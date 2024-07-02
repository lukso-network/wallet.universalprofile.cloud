export const getProfile = (profileAddress: MaybeRef<Address | undefined>) => {
  const { isRpc } = useDataProvider()

  if (isRpc) {
    return useProfileRpc().getProfile(profileAddress)
  }

  return useProfileGraph().getProfile(profileAddress)
}

/**
 * Get profile that is connected to dApp
 *
 * @returns
 */
const connectedProfile = () => {
  const { connectedProfileAddress } = storeToRefs(useAppStore())
  return getProfile(connectedProfileAddress)
}

/**
 * Get profile that is currently viewed in dApp
 *
 * @returns
 */
const viewedProfile = () => {
  const viewedProfileAddress = getCurrentProfileAddress()
  return getProfile(viewedProfileAddress)
}

export function useProfile() {
  return {
    getProfile,
    connectedProfile,
    viewedProfile,
  }
}
