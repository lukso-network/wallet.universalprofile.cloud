import assert from 'assert'
import BigNumber from 'bignumber.js'

/**
 * Convert from token units value based on passed decimals
 *
 * @param value - value to convert
 * @param decimals - decimals
 * @returns
 */
export const fromTokenUnitWithDecimals = (value?: string, decimals = 18) => {
  if (!value || typeof value !== 'string') {
    return '0'
  }

  const mintValueBN = new BigNumber(value)
  const divValue = new BigNumber('10').exponentiatedBy(decimals.toString())

  return mintValueBN.div(divValue).toString()
}

/**
 * Convert to token units value based on passed decimals
 *
 * @param value - value to convert
 * @param decimals - decimals
 * @returns
 */
export const toTokenUnitWithDecimals = (value: string, decimals = 18) => {
  assert(decimals >= 0, 'Decimals should be greater than or equal to 0')
  const mintValueBN = new BigNumber(value)
  const divValue = new BigNumber('10').exponentiatedBy(new BigNumber(decimals))

  return mintValueBN
    .multipliedBy(divValue)
    .toFormat({ decimalSeparator: ',', groupSeparator: '' })
}
