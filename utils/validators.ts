import web3utils from 'web3-utils'
const { isAddress } = web3utils // need to import like this due to CommonJS module import issue

/**
 * Ensures that the given value is an address,
 * otherwise throws an error.
 *
 * @param value - the value to check
 * @param name - the name of the value
 * @returns - throws an error if the value is not an address
 */
export function assertAddress(
  value?: string,
  name = ''
): asserts value is Address {
  if (!value) {
    throw Error(`missing ${name} address`)
  }

  if (!isAddress(value)) {
    throw Error(`${value} is not an ${name} address`)
  }
}

/**
 * Ensures that the given value is an array of addresses,
 * otherwise throws an error.
 *
 * @param value - the value to check
 * @param name - the name of the value
 * @returns - throws an error if the value is not an array of addresses
 */
export function assertAddresses(
  value?: string[],
  name = ''
): asserts value is Address[] {
  if (!value) {
    throw Error(`missing addresses`)
  }

  if (!Array.isArray(value)) {
    throw Error(`is not an ${name} array`)
  }

  return value.forEach(value => assertAddress(value, name))
}

/**
 * Ensures that the given value is a string,
 * otherwise throws an error.
 *
 * @param value - the value to check
 * @returns - throws an error if the value is not a string
 */
export function assertString(value: any): asserts value is string {
  if (typeof value !== 'string') {
    throw Error(`${value} is not a string`)
  }
}

/**
 * Ensures that the input parameter is not undefined.
 *
 * @param input - the input param
 * @param message - optional message to include in the error
 * @throws {Error} - throws if input is not a undefined
 */
export function assertNotUndefined(
  input: unknown,
  message?: string
): asserts input {
  if (input === undefined) {
    throw new Error(message || 'Input is undefined')
  }
}
