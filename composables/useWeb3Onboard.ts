import Onboard, { OnboardAPI } from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'
import luksoModule from '@lukso/web3-onboard-config'
import { ConnectModalOptions } from '@web3-onboard/core/dist/types'

import { EXTENSION_STORE_LINKS } from '@/shared/config'
import LuksoIcon from '@/public/assets/images/up-logo.png'

const lukso = luksoModule()

const injected = injectedModule({
  custom: [lukso],
  sort: wallets => {
    const sorted = wallets.reduce<any[]>((sorted, wallet) => {
      if (wallet.label === 'Universal Profiles') {
        sorted.unshift(wallet)
      } else {
        sorted.push(wallet)
      }
      return sorted
    }, [])
    return sorted
  },
  displayUnavailable: ['Universal Profiles'],
})

const wallets = [injected]

const chains = [
  {
    id: 1,
    token: 'LYXt',
    label: 'LUKSO Testnet',
    rpcUrl: 'https://rpc.testnet.lukso.network',
  },
]

const appMetadata = {
  name: 'LUKSO Universal Profiles Wallet',
  icon: LuksoIcon,
  logo: LuksoIcon,
  description: 'My test dApp using Onboard',
  recommendedInjectedWallets: [
    {
      name: 'Universal Profiles',
      url: EXTENSION_STORE_LINKS.chrome,
    },
  ],
}

const connect: ConnectModalOptions = {
  iDontHaveAWalletLink: EXTENSION_STORE_LINKS.chrome,
  removeWhereIsMyWalletWarning: true,
}

let onboard: OnboardAPI

const setupWeb3Onboard = async () => {
  onboard = Onboard({
    wallets,
    chains,
    appMetadata,
    connect,
  })
  const connectedWallets = await onboard.connectWallet()
  return connectedWallets[0]
}

const disconnect = async (): Promise<void> => {
  const [primaryWallet] = onboard.state.get().wallets
  await onboard.disconnectWallet({ label: primaryWallet.label })
}

const setChainId = async (chainHex: string): Promise<void> => {
  await onboard.setChain({ chainId: chainHex })
}

export default function useWeb3Onboard() {
  return {
    disconnect,
    setChainId,
    setupWeb3Onboard,
  }
}
