type SendStatus = 'draft' | 'pending' | 'success'

export const useSendStore = defineStore('send', () => {
  const asset = ref<Asset | null>()
  const receiver = ref<Profile>()
  const receiverError = ref<string>()
  const amount = ref<string>()
  const status = ref<SendStatus>('draft')
  const onSend = ref<() => Promise<void>>()
  const transactionHash = ref<string>()

  // getters
  const isDraft = computed(() => status.value === 'draft')

  const isPending = computed(() => status.value === 'pending')

  const isSuccess = computed(() => status.value === 'success')

  // actions
  const setStatus = (newStatus: SendStatus) => {
    status.value = newStatus
  }

  const clearSend = () => {
    receiver.value = undefined
    amount.value = undefined
    receiverError.value = undefined
  }

  return {
    asset,
    receiver,
    receiverError,
    amount,
    status,
    isDraft,
    isPending,
    isSuccess,
    onSend,
    setStatus,
    clearSend,
    transactionHash
  }
})
