<script setup lang="ts">
const appStore = useAppStore()
const modalTemplateComponent = shallowRef()

const loadModalTemplate = () => {
  modalTemplateComponent.value = defineAsyncComponent(() => {
    const templateName = appStore.modal?.template
      ? appStore.modal.template
      : MODAL_DEFAULT_TEMPLATE
    return import(`./ModalTemplate${templateName}.vue`)
  })
}

const closeModal = async () => {
  appStore.setModal({ isOpen: false })
  modalTemplateComponent.value = defineAsyncComponent(() => {
    const templateName = MODAL_DEFAULT_TEMPLATE
    return import(`./ModalTemplate${templateName}.vue`)
  })
}

// when modal is opened, load proper template
watch(
  () => appStore.modal?.isOpen,
  () => {
    if (appStore.modal?.isOpen) {
      loadModalTemplate()
    }
  }
)
</script>

<template>
  <lukso-modal
    :is-open="appStore.modal?.isOpen ? true : undefined"
    :size="appStore.modal?.size"
    @on-backdrop-click="closeModal"
  >
    <component
      v-if="modalTemplateComponent"
      :is="modalTemplateComponent"
      :close-modal="closeModal"
    ></component>
  </lukso-modal>
</template>
