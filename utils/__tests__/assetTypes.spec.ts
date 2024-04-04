import { expect, test } from 'vitest'
import { getAssetType } from '../assetTypes'

test('getAssetType', () => {
  expect(
    getAssetType({
      fileType: 'doc',
      url: 'example.url'
    })
  ).toEqual('document')
  expect(
    getAssetType({
      fileType: 'png',
      url: 'example.url'
    })
  ).toEqual('image')
  expect(
    getAssetType({
      url: 'example.com',
      fileType: ''
    })
  ).toEqual('other')
  expect(
    getAssetType({
      address: '0xA5467dfe7019bF2C7C5F7A707711B9d4cAD118c8'
    })
  ).toEqual('contract')
})

test('getFileExtension', () => {
  expect(getFileExtension('application/pdf')).toEqual('pdf')
  expect(getFileExtension('pdf')).toEqual('pdf')
  expect(getFileExtension('audio/mpeg')).toEqual('mpga')
  expect(getFileExtension('wav')).toEqual('wav')
  expect(getFileExtension('mp3')).toEqual('mp3')
  expect(getFileExtension('video/mp4')).toEqual('mp4')
  expect(getFileExtension('avi')).toEqual('avi')
  expect(getFileExtension('video/x-msvideo')).toEqual('avi')
  expect(getFileExtension('image/png')).toEqual('png')
  expect(getFileExtension('png')).toEqual('png')
})
