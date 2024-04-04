<script setup lang="ts">
import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json'
import LSP8Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP8Mintable.json'
import { type AbiItem, toWei } from 'web3-utils'

import type {
  LSP7DigitalAsset,
  LSP8IdentifiableDigitalAsset
} from '@/contracts'
import type { TransactionConfig } from 'web3-core'
import type { TransactionReceipt } from 'web3-eth'

const connectedProfile = useProfile().connectedProfile()
const {
  asset: sendAsset,
  onSend,
  amount: sendAmount,
  receiver,
  transactionHash
} = storeToRefs(useSendStore())
const { isLoadedApp, isConnected, hasSimpleNavbar } = storeToRefs(useAppStore())
const { setStatus, clearSend } = useSendStore()
const { showModal } = useModal()
const { sendTransaction, contract } = useWeb3(PROVIDERS.INJECTED)
const amount = computed(() => useRouter().currentRoute.value.query.amount)
const assetAddress = computed(() => useRouter().currentRoute.value.query.asset)
const tokenId = computed(() => useRouter().currentRoute.value.query.tokenId)
const asset = useToken()(useAsset()(assetAddress, tokenId))
const lyxToken = useLyxToken()

onMounted(() => {
  setStatus('draft')

  onSend.value = handleSend
})

onUnmounted(() => {
  setStatus('draft')
  hasSimpleNavbar.value = false
  clearSend()
})

watchEffect(() => {
  // until everything is loaded we skip this effect
  if (!isLoadedApp.value) {
    return
  }

  sendAmount.value = amount.value

  if (!assetAddress.value) {
    sendAsset.value = lyxToken.value
  } else {
    sendAsset.value = asset.value
  }

  // when not connected then navigate to home
  if (!isConnected.value) {
    navigateTo(homeRoute())
  }
})

const handleSend = async () => {
  await checkExtensionNetwork()

  try {
    setStatus('pending')
    hasSimpleNavbar.value = true
    let transactionsReceipt: TransactionReceipt

    // native token transfer
    if (isLyx(sendAsset.value)) {
      const transaction = {
        from: connectedProfile.value?.address,
        to: receiver.value?.address as unknown as string,
        value: toWei(sendAmount.value || '0')
      } as TransactionConfig
      transactionsReceipt = await sendTransaction(transaction)
      transactionHash.value = transactionsReceipt.transactionHash
    } else {
      // custom token transfer
      switch (sendAsset.value?.standard) {
        case STANDARDS.LSP7: {
          const tokenContract = contract<LSP7DigitalAsset>(
            LSP7Mintable.abi as AbiItem[],
            sendAsset.value?.address
          )

          assertAddress(connectedProfile.value?.address)
          assertAddress(receiver.value?.address)
          transactionsReceipt = await tokenContract.methods
            .transfer(
              connectedProfile.value.address,
              receiver.value?.address,
              toWeiWithDecimals(
                sendAmount.value || '0',
                sendAsset.value?.decimals
              ),
              false,
              '0x'
            )
            .send({ from: connectedProfile.value.address })
          transactionHash.value = transactionsReceipt.transactionHash
          break
        }
        case STANDARDS.LSP8: {
          const nftContract = contract<LSP8IdentifiableDigitalAsset>(
            LSP8Mintable.abi as AbiItem[],
            sendAsset.value?.address
          )

          assertAddress(connectedProfile.value?.address)
          assertAddress(receiver.value?.address)
          assertString(sendAsset.value.tokenId)
          transactionsReceipt = await nftContract.methods
            .transfer(
              connectedProfile.value.address,
              receiver.value?.address,
              sendAsset.value.tokenId,
              false,
              '0x'
            )
            .send({ from: connectedProfile.value.address })
          transactionHash.value = transactionsReceipt.transactionHash
          assertNotUndefined(sendAsset.value.address, 'asset')
          break
        }
        default:
          throw new StandardError()
      }
    }
    setStatus('success')
  } catch (error: unknown) {
    console.error(error)
    setStatus('draft')
    hasSimpleNavbar.value = false

    showModal({
      message: getErrorMessage(error)
    })
  }
}
</script>

<template>
  <AppPageLoader>
    <SendCard />
  </AppPageLoader>
</template>
