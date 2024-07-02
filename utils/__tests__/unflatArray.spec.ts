import { describe, expect, test } from 'vitest'
import { unflatArray } from '../unflatArray'

test('handles consecutive indexes', () => {
  const input = [
    { index: 0, url: 'https://example.com/image1.jpg', width: 300 },
    { index: 0, url: 'https://example.com/image1.jpg' },
    { index: 1, url: 'https://example.com/image2.jpg' },
    { index: 2, url: 'https://example.com/image3.jpg' },
  ]

  const expectedOutput = [
    [
      { url: 'https://example.com/image1.jpg', width: 300 },
      { url: 'https://example.com/image1.jpg' },
    ],
    [{ url: 'https://example.com/image2.jpg' }],
    [{ url: 'https://example.com/image3.jpg' }],
  ]

  expect(unflatArray(input)).toEqual(expectedOutput)
})

test('handles missing indexes', () => {
  const input = [
    { index: null, url: 'https://example.com/image1.jpg', width: 300 },
    { url: 'https://example.com/image1.jpg' },
    { index: undefined, url: 'https://example.com/image2.jpg' },
    { url: 'https://example.com/image3.jpg' },
  ]

  const expectedOutput = [
    [{ url: 'https://example.com/image1.jpg', width: 300 }],
    [
      { url: 'https://example.com/image1.jpg' },
      { url: 'https://example.com/image2.jpg' },
      { url: 'https://example.com/image3.jpg' },
    ],
  ]

  expect(unflatArray(input)).toEqual(expectedOutput)
})

test('handles empty array', () => {
  expect(unflatArray([])).toEqual([])
  expect(unflatArray(undefined)).toEqual([])
})
