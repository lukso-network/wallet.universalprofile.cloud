<script setup lang="ts">
import { MODAL_DEFAULT_TEMPLATE } from '@/shared/config'

const appStore = useAppStore()
const modalTemplateComponent = shallowRef()

const loadModalTemplate = () => {
  modalTemplateComponent.value = defineAsyncComponent(() => {
    const templateName = appStore.modal?.template
      ? appStore.modal.template
      : MODAL_DEFAULT_TEMPLATE
    return import(`./modal-templates/${templateName}.vue`)
  })
}

const closeModal = async () => {
  await appStore.modal?.onConfirm?.()
  appStore.setModal({ isOpen: false })
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
  <lukso-modal :is-open="appStore.modal?.isOpen ? true : undefined">
    <component
      v-if="modalTemplateComponent"
      :is="modalTemplateComponent"
      :close-modal="closeModal"
    ></component>
  </lukso-modal>
</template>
