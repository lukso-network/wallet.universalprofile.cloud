<script setup lang="ts">
type Props = {
  asset?: Asset
}

const props = defineProps<Props>()
const isLoaded = computed(() => props.asset && !props.asset?.isLoading)
const totalSupply = computed(() => props.asset?.totalSupply)
const decimals = computed(() => props.asset?.decimals)
</script>

<template>
  <template v-if="isLoaded">
    <div class="paragraph-ptmono-14-regular" v-if="totalSupply">
      {{
        $formatMessage('token_details_total_supply_of', {
          count: $formatNumber(
            fromTokenUnitWithDecimals(totalSupply, decimals)
          ),
        })
      }}
    </div>
  </template>
  <AppPlaceholderLine v-else class="h-[20px] w-1/3" />
</template>
