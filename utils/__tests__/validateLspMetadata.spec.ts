import { describe, expect, test } from 'vitest'
import {
  validateAssets,
  validateAttributes,
  validateDescription,
  validateIcon,
  validateImages,
  validateLinks,
  validateName,
  validateTags
} from '../validateLspMetadata'

test('validateAttribute', () => {
  expect(validateAttributes([])).toEqual([])
  expect(validateAttributes(undefined)).toEqual([])

  // when more "custom" attributer
  expect(
    validateAttributes([
      {
        test: '123',
        key: 'size',
        value: 123,
        type: 'number'
      }
    ])
  ).toEqual([
    {
      test: '123',
      key: 'size',
      value: 123,
      type: 'number'
    }
  ])

  // when at least one valid
  expect(
    validateAttributes([
      {
        value: 123
      }
    ])
  ).toEqual([
    {
      value: 123
    }
  ])

  // when invalid attributes are present
  expect(
    validateAttributes([
      {
        test: '123'
      }
    ])
  ).toEqual([])
})

describe('validateImages', () => {
  test('should return images has the required properties', () => {
    const result = validateImages([
      [
        {
          width: 223,
          height: 656,
          url: 'https://example.com/image.png',
          hash: '0x123',
          hashFunction: 'keccak256'
        },
        {
          width: 123,
          height: 456,
          url: 'https://example.com/image.png',
          hash: '0x123',
          hashFunction: 'keccak256'
        }
      ]
    ])
    expect(result).toEqual([
      [
        {
          width: 223,
          height: 656,
          url: 'https://example.com/image.png',
          hash: '0x123',
          hashFunction: 'keccak256'
        },
        {
          width: 123,
          height: 456,
          url: 'https://example.com/image.png',
          hash: '0x123',
          hashFunction: 'keccak256'
        }
      ]
    ])
  })

  test('should return partial images that have the required properties', () => {
    const result = validateImages([
      [
        {
          width: 223,
          height: 656
        },
        {
          width: 123,
          height: 456,
          url: 'https://example.com/image.png',
          hash: '0x123',
          hashFunction: 'keccak256'
        }
      ]
    ])
    expect(result).toEqual([
      [
        {
          width: 123,
          height: 456,
          url: 'https://example.com/image.png',
          hash: '0x123',
          hashFunction: 'keccak256'
        }
      ]
    ])
  })

  test('handle invalid objects', () => {
    expect(
      validateImages([
        [
          {
            hashFunction: 'keccak256'
          }
        ]
      ])
    ).toEqual([])
    expect(
      validateImages([
        [
          {
            width: 223,
            height: 656
          }
        ]
      ])
    ).toEqual([])
    expect(validateImages([[]])).toEqual([])
    expect(validateImages(undefined)).toEqual([])
  })
})

describe('validateLinks', () => {
  test('should return an empty array if no links are provided', () => {
    expect(validateLinks([])).toEqual([])
    expect(validateLinks(undefined)).toEqual([])
  })

  test('should return an empty array if a link does not have a title or url', () => {
    const links = [
      {
        title: '',
        url: 'https://example.com'
      },
      {
        title: 'Example Link',
        url: ''
      }
    ]
    const result = validateLinks(links)
    expect(result).toEqual([])
  })

  test('should return an array of links if all links have a title and url', () => {
    const links = [
      {
        title: 'Example Link',
        url: 'https://example.com'
      },
      {
        title: 'Another Example Link',
        url: 'https://example.com/another'
      }
    ]
    const result = validateLinks(links)
    expect(result).toEqual(links)
  })
})

describe('validateAssets', () => {
  test('should return an empty array if no assets are provided', () => {
    expect(validateAssets([])).toEqual([])
    expect(validateAssets(undefined)).toEqual([])
  })

  test('should return an empty array if an asset does not have a url, fileType, hash, and hashFunction', () => {
    const assets = [
      {
        url: 'https://example.com',
        fileType: 'image/png'
      },
      {
        url: 'https://example.com',
        fileType: 'image/png',
        hash: '0x1234567890abcdef'
      },
      {
        url: 'https://example.com',
        fileType: 'image/png',
        hashFunction: 'sha256'
      }
    ]
    const result = validateAssets(assets)
    expect(result).toEqual([])
  })

  test('should return an array of assets if all assets have a url, fileType, hash, and hashFunction', () => {
    const assets = [
      {
        url: 'https://example.com',
        fileType: 'image/png',
        hash: '0x1234567890abcdef',
        hashFunction: 'sha256'
      },
      {
        url: 'https://example.com',
        fileType: 'image/png',
        verification: {
          data: '0x1234567890abcdef',
          method: 'sha256'
        }
      }
    ]
    const result = validateAssets(assets)
    expect(result).toEqual(assets)
  })
})

describe('validateIcon', () => {
  test('should return an empty array if no icon is provided', () => {
    expect(validateIcon([])).toEqual([])
    expect(validateIcon(undefined)).toEqual([])
  })

  test('should return an empty array if an icon does not have a url, width, and height', () => {
    const icon = [
      {
        width: 100
      },
      {
        url: ''
      },
      {
        url: undefined
      }
    ]
    const result = validateIcon(icon)
    expect(result).toEqual([])
  })

  test('should return an array of icons if all icons have at least url', () => {
    const icon = [
      {
        width: 123,
        height: 456,
        url: 'https://example.com/image.png',
        hash: '0x123',
        hashFunction: 'keccak256'
      },
      {
        url: 'https://example.com/image.png'
      }
    ]
    const result = validateIcon(icon)
    expect(result).toEqual(icon)
  })
})

test('validateTags', async () => {
  expect(validateTags(undefined)).toEqual([])
  expect(validateTags([])).toEqual([])
  expect(validateTags(['tag1', ''])).toEqual(['tag1'])
  expect(validateTags(['tag1', 'tag2', 'tag3', 'tag4'])).toEqual([
    'tag1',
    'tag2',
    'tag3'
  ])
  expect(validateTags([123, 'tag2', { test: '123' }, 'tag4'])).toEqual(['tag2'])
})

test('validateName', async () => {
  expect(validateName(undefined)).toEqual('')
  expect(validateName([])).toEqual('')
  expect(validateName(123)).toEqual('')
  expect(validateName('CoolBro')).toEqual('coolbro')
})

test('validateDescription', async () => {
  expect(validateDescription([])).toEqual('')
  expect(validateDescription(123)).toEqual('')
  expect(
    validateDescription(
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    )
  ).toEqual(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut a'
  )
})
