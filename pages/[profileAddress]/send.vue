<script setup lang="ts">
import LSP7Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP7Mintable.json'
import LSP8Mintable from '@lukso/lsp-smart-contracts/artifacts/LSP8Mintable.json'
import { numberToHex, toWei } from 'web3-utils'

import type { Transaction } from 'web3'

const connectedProfile = useProfile().connectedProfile()
const {
  asset: sendAsset,
  onSend,
  amount: sendAmount,
  receiver,
  transactionHash,
} = storeToRefs(useSendStore())
const { isLoadedApp } = storeToRefs(useAppStore())
const { setStatus, clearSend } = useSendStore()
const { showModal } = useModal()
const { isEoA, contract } = useWeb3(PROVIDERS.INJECTED)
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
})

const handleSend = async () => {
  await checkExtensionNetwork()

  try {
    setStatus('pending')
    let transactionsReceipt: any

    // native token transfer
    if (isLyx(sendAsset.value)) {
      const transaction = {
        from: connectedProfile.value?.address,
        to: receiver.value?.address as unknown as string,
        value: numberToHex(toWei(sendAmount.value || '0', 'ether')),
        // gasLimit: numberToHex(GAS_LIMIT),
      } as Transaction
      // transactionsReceipt = await sendTransaction(transaction) // TODO since we use new web3 in dApp it uses eth_call instead so we need to use raw request method
      transactionsReceipt = await window.lukso.request({
        method: 'eth_sendTransaction',
        params: [transaction],
      })
      transactionHash.value = transactionsReceipt
    } else {
      // custom token transfer
      switch (sendAsset.value?.standard) {
        case STANDARDS.LSP7: {
          const tokenContract = contract<typeof LSP7Mintable.abi>(
            LSP7Mintable.abi,
            sendAsset.value?.address
          )

          assertAddress(connectedProfile.value?.address)
          assertAddress(receiver.value?.address)
          transactionsReceipt = await tokenContract.methods
            .transfer(
              connectedProfile.value.address,
              receiver.value?.address,
              toTokenUnitWithDecimals(
                sendAmount.value || '0',
                sendAsset.value?.decimals
              ),
              await isEoA(receiver.value?.address),
              '0x'
            )
            .send({ from: connectedProfile.value.address })
          transactionHash.value = transactionsReceipt.transactionHash
          break
        }
        case STANDARDS.LSP8: {
          const nftContract = contract<typeof LSP8Mintable.abi>(
            LSP8Mintable.abi,
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
              await isEoA(receiver.value?.address),
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

    showModal({
      message: getErrorMessage(error),
    })
  }
}

useProtectedRoute()
</script>

<template>
  <AppPageLoader>
    <SendCard />
  </AppPageLoader>
</template>
