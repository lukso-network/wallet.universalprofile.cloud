<template>
  <ClientOnly>
    <div class="grid min-h-screen grid-rows-[max-content,auto,max-content]">
      <AppNavbar />
      <slot />
      <AppFooter />
    </div>
  </ClientOnly>
</template>
