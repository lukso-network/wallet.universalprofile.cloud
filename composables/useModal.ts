const showModal = (data: Modal | string) => {
  const appStore = useAppStore()

  const defaultData = {
    isOpen: true,
    icon: '/images/up-error.png',
  } as Modal

  if (typeof data === 'string') {
    appStore.setModal({ ...defaultData, message: data })
  } else {
    appStore.setModal({ ...defaultData, ...data })
  }
}

export const useModal = () => {
  return {
    showModal,
  }
}
