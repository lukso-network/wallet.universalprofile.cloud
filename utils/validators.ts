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
  value: unknown,
  name = ''
): asserts value is Address {
  assertString(value)

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
  value: unknown,
  name = ''
): asserts value is Address[] {
  assertArray(value, name)

  for (const address of value) {
    assertAddress(address, name)
  }
}

/**
 * Ensures that the given value is an array,
 * otherwise throws an error.
 *
 * @param value - the value to check
 * @param name - the name of the value
 * @returns - throws an error if the value is not an array
 */
export function assertArray(
  value: unknown,
  name = ''
): asserts value is Array<any> {
  if (!Array.isArray(value)) {
    throw Error(`${value} is not an ${name} array`)
  }
}

/**
 * Ensures that the given value is a string,
 * otherwise throws an error.
 *
 * @param value - the value to check
 * @returns - throws an error if the value is not a string
 */
export function assertString(value: unknown): asserts value is string {
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
