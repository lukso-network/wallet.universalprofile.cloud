<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { toWei } from 'web3-utils'
import { TransactionConfig } from 'web3-core'

import { homeRoute } from '@/shared/routes'
import { DEFAULT_GAS, DEFAULT_GAS_PRICE } from '@/shared/config'
import { PROVIDERS } from '@/types/enums'

const { profile: connectedProfile, status } = useConnectionStore()
const { currentNetwork } = useAppStore()
const { asset, onSend, receiverAddress, amount } = storeToRefs(useSendStore())
const { setStatus, clearSend } = useSendStore()
const { showModal } = useModal()
const { formatMessage } = useIntl()
const { sendTransaction } = useWeb3(PROVIDERS.INJECTED)

onMounted(() => {
  clearSend()

  if (!status.isConnected) {
    navigateTo(homeRoute())
  }

  asset.value = {
    name: 'LUKSO',
    symbol: currentNetwork.token,
    icon: '/images/lyx-token.png',
  }

  onSend.value = handleSend
})

watchEffect(() => {
  if (!asset.value) {
    return
  }

  // since balance is not avail in onMounted hook
  asset.value = {
    ...asset.value,
    amount: connectedProfile.balance,
  }
})

const handleSend = async () => {
  try {
    setStatus('pending')

    let transaction = {
      from: connectedProfile.address,
      to: receiverAddress.value as unknown as string,
      value: toWei(amount.value || '0'),
      gas: DEFAULT_GAS,
      gasPrice: DEFAULT_GAS_PRICE,
    } as TransactionConfig
    console.log(transaction)

    await sendTransaction(transaction)
    setStatus('success')
  } catch (error: any) {
    console.error(error)
    setStatus('draft')

    // errors that have a code or message
    if (error && error.code) {
      switch (error.code) {
        case 4001:
          return showModal({
            title: formatMessage('send_error_title'),
            message: formatMessage('send_error_rejected_request'),
          })
        default:
          return showModal({
            title: formatMessage('send_error_title'),
            message: error.message,
          })
      }
    }

    // unknowns errors
    showModal({
      title: formatMessage('send_error_title'),
      message: formatMessage('send_error_message'),
    })
  }
}
</script>

<template>
  <SendCard />
</template>
