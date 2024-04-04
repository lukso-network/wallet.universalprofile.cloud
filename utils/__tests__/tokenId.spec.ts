import { describe, expect, it } from 'vitest'

import { parseTokenId, prefixedTokenId } from '../tokenId'

describe('parseTokenId', () => {
  it('should parse tokenId based on format', async () => {
    expect(
      parseTokenId(
        '0x0000000000000000000000000000000000000000000000000000000000000db4',
        0
      )
    ).toBe('3508')
    expect(
      parseTokenId(
        '0x647a626f00000000000000000000000000000000000000000000000000000000',
        1
      )
    ).toBe('dzbo')
    expect(
      parseTokenId(
        '0x546869735f69735f736f6d655f746f6b656e5f69645f61735f737472696e672e',
        1
      )
    ).toBe('This_is_some_token_id_as_string.')
  })
})

describe('prefixedTokenId', () => {
  it('should add prefix to tokenId based on format', async () => {
    // number
    expect(
      prefixedTokenId(
        '0x0000000000000000000000000000000000000000000000000000000000000db4',
        0
      )
    ).toBe('#3508')

    // string
    expect(
      prefixedTokenId(
        '0x647a626f00000000000000000000000000000000000000000000000000000000',
        1
      )
    ).toBe('#dzbo')

    // address
    expect(
      prefixedTokenId(
        '0x00000000000000000000000099f00578962e20b22c11275e90d1c5da9115234a',
        2
      )
    ).toBe('0x99f00578962e20b22c11275e90d1c5da9115234a')

    // uid / hash
    expect(
      prefixedTokenId(
        '0x000000000000000000000000000000000000000000000000000000000005234a',
        3
      )
    ).toBe('#000000000000000000000000000000000000000000000000000000000005234a')
  })

  it('should truncate based on the token id format', async () => {
    expect(
      prefixedTokenId(
        '0x546869735f69735f736f6d655f746f6b656e5f69645f61735f737472696e672e',
        1,
        20
      )
    ).toBe('#This_is_some_tok...')
    expect(
      prefixedTokenId(
        '0x00000000000000000000000099f00578962e20b22c11275e90d1c5da9115234a',
        2,
        20
      )
    ).toBe('0x99f00578...9115234a')
    expect(
      prefixedTokenId(
        '0x000000000000000000000000000000000000000000000000000000000005234a',
        3,
        20
      )
    ).toBe('#000000000...0005234a')
  })
})
