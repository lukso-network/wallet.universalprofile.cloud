<script setup lang="ts">
import BigNumber from 'bignumber.js'

const { asset, amount, tempAmount } = storeToRefs(useSendStore())

const balance = computed(() => {
  if (
    isLsp8(asset.value) &&
    asset.value?.tokenId &&
    asset.value?.tokenIdsOf?.includes(asset.value.tokenId)
  ) {
    return '1'
  }

  if (isLsp7(asset.value) || isLyx(asset.value)) {
    return getBalance(asset.value)
  }

  return '0'
})

const balanceInUnits = computed(() =>
  fromTokenUnitWithDecimals(balance.value, asset.value?.decimals)
)

/**
 * Input field validation
 *
 * @param customEvent
 */
const handleInput = async (customEvent: CustomEvent) => {
  const numberRegex = /^[0-9]*\.?[0-9]*$/
  const event = customEvent.detail.event
  const input = event.target as HTMLInputElement
  const key = input.value.slice(-1)
  const realValueBN = new BigNumber(input.value)

  const assetBalanceBN = new BigNumber(balanceInUnits.value)
  const maxDecimalPlaces = asset.value?.decimals || 0

  // allow type only numbers
  if (!numberRegex.test(key)) {
    return rollbackAmount(input)
  }

  // when value is more then balance we set to max value
  if (realValueBN.gt(assetBalanceBN)) {
    amount.value = balanceInUnits.value
    tempAmount.value = balanceInUnits.value
    return rollbackAmount(input)
  }

  // when asset use 0 decimals we should only allow integers
  if (
    asset.value?.decimals === 0 &&
    (key === '.' || (key === '0' && input.value === ''))
  ) {
    return rollbackAmount(input)
  }

  // dot not as first character
  if (key === '.' && input.value === '.') {
    return rollbackAmount(input)
  }

  // allow only one dot
  if (key === '.' && input.value.split('.').length > 2) {
    return rollbackAmount(input)
  }

  // check for max decimal places
  if (input.value.toString().split('.')[1]?.length > maxDecimalPlaces) {
    return rollbackAmount(input)
  }

  tempAmount.value = parseValue(input.value)
  amount.value = parseValue(input.value)
}

/**
 * Rollback input value to temp value
 *
 * @param input HTMLInputElement
 * @returns {void}
 */
const rollbackAmount = (input: HTMLInputElement) => {
  amount.value = tempAmount.value
  input.value = tempAmount.value
}

/**
 *  When user paste value with comma 123, 44 we swap to dot notation 123.44
 *
 * @param value
 * @returns {string}
 */
const parseValue = (value: string) => String(value).replace(',', '.')

const handleUnitClick = () => {
  const total = balanceInUnits.value
  tempAmount.value = total
  amount.value = total
}
</script>

<template>
  <lukso-input
    placeholder="0"
    :value="amount"
    :unit="
      $formatMessage('profile_balance_of', {
        balance: truncate(
          $formatNumber(balanceInUnits || '', {
            maximumFractionDigits: asset?.decimals,
          }),
          10
        ),
        symbol: truncate(asset?.tokenSymbol, 10),
      })
    "
    borderless
    is-full-width
    autofocus
    @on-input="handleInput"
    @on-unit-click="handleUnitClick"
  ></lukso-input>
</template>
