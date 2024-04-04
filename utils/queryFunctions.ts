import { Buffer } from 'buffer'
import {
  type ERC725JSONSchema,
  decodeData,
  encodeKeyName,
  getDataFromExternalSources
} from '@erc725/erc725.js'
import LSP3Schema from '@erc725/erc725.js/schemas/LSP3ProfileMetadata.json'
import LSP4Schema from '@erc725/erc725.js/schemas/LSP4DigitalAsset.json'
import LSP8Schema from '@erc725/erc725.js/schemas/LSP8IdentifiableDigitalAsset.json'
import { INTERFACE_IDS } from '@lukso/lsp-smart-contracts'
import LSP4DigitalAssetMetadataContract from '@lukso/lsp-smart-contracts/artifacts/LSP4DigitalAssetMetadata.json'
import LSP7DigitalAssetContract from '@lukso/lsp-smart-contracts/artifacts/LSP7DigitalAsset.json'
import LSP8IdentifiableDigitalAssetContract from '@lukso/lsp-smart-contracts/artifacts/LSP8IdentifiableDigitalAsset.json'
import debug from 'debug'
import { RateLimiter } from 'limiter'
import ABICoder from 'web3-eth-abi'
import type { Address } from 'web3-types'
import { type AbiItem, type Hex, toNumber } from 'web3-utils'

import LSP2FetcherWithMulticall3Contract from '@/shared/abis/LSP2FetcherWithMulticall3.json'
import { LUKSO_PROXY_API } from '@/shared/config'

import type { LSP2FetcherWithMulticall3 } from '@/contracts/LSP2FetcherWithMulticall3'
import type { QueryFunction } from '@tanstack/query-core'

const queryLog = debug('tanstack:query')
const resultsLog = debug('tanstack:results')

const QUERY_TIMEOUT = 250
const MAX_PARALLEL_REQUESTS = 5
const MAX_AGGREGATE_COUNT = 20
const MAX_AGGREGATE_DATA_LIMIT = 75 * 1024

export type QueryPromiseCallOptions = {
  type: 'call'
  chainId: string
  address: Address
  method: string
  abi?: AbiItem
  args: readonly unknown[]
  queryKey?: readonly unknown[]
  priority?: number
  aggregateLimit?: number
  process?: (data: any) => Promise<any>
}
export type QueryPromiseDataOptions = {
  type: 'getData'
  chainId: string
  address: Address
  tokenId?: `0x${string}`
  keyName: string
  dynamicKeyParts?: string | string[]
  schema?: readonly ERC725JSONSchema[]
  queryKey?: readonly unknown[]
  priority?: number
  aggregateLimit?: number
  process?: (data: any) => Promise<any>
}
export type QueryPromiseOptions =
  | QueryPromiseCallOptions
  | QueryPromiseDataOptions

type DeferCapture<T = unknown, E = unknown> = {
  resolve(result: T): void
  reject(error: E): void
  process?: (data: T) => T
  promise: Promise<T>
  [key: string]: unknown
}

export type QueryPromise<
  T = unknown,
  O = QueryPromiseOptions
> = DeferCapture<T> & O

export type Multicall = {
  target: string
  call: string
  query?: QueryPromise<any>
  queries?: Array<QueryPromise<any>>
  selector?: (data: any) => any
  extract?: (data: string) => string
}

export type Remainder = {
  query: QueryPromise
  selector?: (data: any) => any
  data: string
}

function capture(): DeferCapture {
  const output: DeferCapture = {
    resolve: () => {},
    reject: () => {}
  } as unknown as DeferCapture
  output.promise = new Promise((resolve, reject) => {
    output.resolve = (value) => {
      if (output.process && value !== null) {
        try {
          const promise = output.process(value) as Promise<any>
          promise.then(resolve).catch(output.reject)
        } catch (error) {
          output.reject(error)
        }
        return
      }
      resolve(value)
    }
    output.reject = (error) => {
      reject(error)
    }
  })
  return output
}

export function createQueryPromise<T = unknown, O = QueryPromiseOptions>(
  options: O
): DeferCapture<T> & O {
  const output = capture()
  Object.assign(output, options)
  return output as unknown as DeferCapture<T> & O
}

let queryTimer: NodeJS.Timeout | undefined
const queryList: Array<
  QueryPromise<unknown, QueryPromiseCallOptions | QueryPromiseDataOptions>
> = []
export const defaultSchema: readonly ERC725JSONSchema[] = [
  ...LSP4Schema,
  ...LSP3Schema,
  ...LSP8Schema
]
export const defaultAbi: readonly AbiItem[] = [
  ...(LSP8IdentifiableDigitalAssetContract.abi as AbiItem[]),
  ...(LSP7DigitalAssetContract.abi as AbiItem[]),
  ...(LSP4DigitalAssetMetadataContract.abi as AbiItem[])
]

// Allow 150 requests per hour (the Twitter search limit). Also understands
// 'second', 'minute', 'day', or a number of milliseconds
const limiter = new RateLimiter({ tokensPerInterval: 80, interval: 'second' })

async function convert<T = any>(
  query: QueryPromise<unknown, QueryPromiseDataOptions>,
  data: string | null,
  overrideSchema?: readonly ERC725JSONSchema[]
): Promise<T | null> {
  if (data == null) {
    return null
  }
  const { keyName, schema, dynamicKeyParts } = query
  if (keyName === 'LSP8ReferenceContract') {
    if (data === '0x') {
      return null
    }
    const address = `0x${data.slice(2).slice(0, 40)}`
    const tokenId = `0x${data.slice(2).slice(40)}`
    return {
      address,
      tokenId
    } as any
  }
  let info = decodeData(
    [
      {
        keyName: keyName as string,
        value: data,
        dynamicKeyParts
      }
    ],
    overrideSchema || schema || (defaultSchema as any)
  )
  const value = info.find(({ name }) => name === keyName)?.value
  if (value == null) {
    return null
  }
  try {
    info = await getDataFromExternalSources(
      (overrideSchema || defaultSchema) as any,
      info,
      `${LUKSO_PROXY_API}/ipfs/`,
      true
    )
  } catch {
    if (typeof info[0]?.value === 'object' && (info[0]?.value as any)?.url) {
      const [, encoding, data] =
        (info[0]?.value as any)?.url.match(/^data:.*?;(.*?),(.*)$/) || []
      if (data) {
        let output =
          encoding === 'base64' ? Buffer.from(data, 'base64').toString() : data
        try {
          output = JSON.parse(output)
        } catch {
          // ignore
        }
        return output as T
      }
    }
  }
  return info[0]?.value as T
}

const multicall: Multicall[] = []
const singlecall: Multicall[] = []
let running = 0

export enum Priorities {
  High = 100,
  Normal = 0,
  Low = -100
}

async function doQueries() {
  if (running++ > MAX_PARALLEL_REQUESTS) {
    running--
    return
  }
  try {
    const { currentNetwork } = storeToRefs(useAppStore())
    const { customLSP2ContractAddress: LSP2ContractAddress, chainId } =
      currentNetwork.value
    const { contract, getWeb3 } = useWeb3(PROVIDERS.RPC)
    const lsp2CustomContract = contract<LSP2FetcherWithMulticall3>(
      LSP2FetcherWithMulticall3Contract.abi as AbiItem[],
      LSP2ContractAddress
    )
    const web3 = getWeb3()
    if (!web3.currentProvider) {
      return
    }
    const startLength = queryList.length
    const singleCallQueries: QueryPromise<
      unknown,
      QueryPromiseDataOptions | QueryPromiseCallOptions
    >[] = []
    const queries: QueryPromise<
      unknown,
      QueryPromiseDataOptions | QueryPromiseCallOptions
    >[] = []
    queryList.sort((a, b) => {
      const apriority = a.priority ?? Priorities.Normal
      const bpriority = b.priority ?? Priorities.Normal
      return bpriority - apriority
    })
    while (true) {
      const query = queryList.shift()
      if (!query) {
        break
      }
      if (query.chainId !== chainId) {
        try {
          query.reject(new Error('Query cancelled'))
        } catch {
          // Ignore
        }
        continue
      }
      if (query.aggregateLimit === 1) {
        singleCallQueries.push(query)
        if (singleCallQueries.length >= MAX_PARALLEL_REQUESTS - 1) {
          break
        }
      } else {
        if (query.aggregateLimit && queries.length > query.aggregateLimit) {
          queryList.splice(0, 0, query)
          break
        }
        queries.push(query)
      }
    }
    if (queryLog.enabled) {
      queryLog(
        'doQueries',
        `digested ${startLength - queryList.length} queries into ${
          queries.length
        } queries and ${singleCallQueries.length} single queries`,
        toRaw(queries),
        toRaw(singleCallQueries)
      )
    }

    const split: Record<
      string,
      {
        call?: QueryPromise<unknown, QueryPromiseCallOptions>[]
        getData?: QueryPromise<unknown, QueryPromiseDataOptions>[]
        getDataForTokenId?: QueryPromise<unknown, QueryPromiseDataOptions>[]
      }
    > = queries.reduce(
      (acc, query) => {
        if (!acc[query.address]) {
          acc[query.address] = {}
        }
        const type =
          query.type === 'getData' && query.tokenId
            ? 'getDataForTokenId'
            : query.type
        let items = acc[query.address][type] as QueryPromise<
          unknown,
          QueryPromiseCallOptions | QueryPromiseDataOptions
        >[]
        if (!items) {
          items = acc[query.address][type] = []
        }
        items.push(query)
        return acc
      },
      {} as Record<
        string,
        {
          call?: QueryPromise<unknown, QueryPromiseCallOptions>[]
          getData?: QueryPromise<unknown, QueryPromiseDataOptions>[]
          getDataForTokenId?: QueryPromise<unknown, QueryPromiseDataOptions>[]
        }
      >
    )

    try {
      for (const [
        address,
        { getData, getDataForTokenId, call }
      ] of Object.entries(split)) {
        if (getDataForTokenId) {
          const tokenIds = getDataForTokenId.reduce(
            (
              tokenIds: Record<
                string,
                QueryPromise<unknown, QueryPromiseDataOptions>[]
              >,
              query
            ) => {
              const { address } = query
              if (!tokenIds[address]) {
                tokenIds[address] = []
              }
              tokenIds[address].push(query)
              return tokenIds
            },
            {} as Record<
              string,
              QueryPromise<unknown, QueryPromiseDataOptions>[]
            >
          )
          for (const tokenQueries of Object.values(tokenIds)) {
            const { address } = tokenQueries[0]
            const abi = LSP4DigitalAssetMetadataContract.abi.find(
              (item) =>
                item.type === 'function' &&
                item.name === 'getDataBatchForTokenIds'
            )
            if (abi) {
              const call = ABICoder.encodeFunctionCall(
                abi as unknown as AbiItem,
                [
                  tokenQueries.map(
                    ({ tokenId }) => tokenId
                  ) as unknown as string,
                  tokenQueries.map(({ keyName, dynamicKeyParts }) =>
                    encodeKeyName(keyName, dynamicKeyParts)
                  ) as unknown as string
                ]
              )
              multicall.push({
                target: address,
                call,
                queries: tokenQueries as unknown as QueryPromise<any>[],
                selector(data: string) {
                  if (data === '0x') {
                    return null
                  }
                  try {
                    return ABICoder.decodeParameters(
                      (abi?.outputs || []).slice(),
                      data
                    )[0]
                  } catch (error) {
                    console.error('decodeParameters', error)
                    return null
                  }
                }
              })
            }
          }
        }

        if (getData) {
          const plainKeys = getData.filter(
            ({ keyName, tokenId }) => !/\[\]$/.test(keyName) || tokenId
          )
          const arrayKeys = getData.filter(
            ({ keyName, tokenId }) => /\[\]$/.test(keyName) && !tokenId
          )
          if (queryLog.enabled) {
            queryLog('getData', { plainKeys, arrayKeys })
          }
          if (plainKeys.length > 0) {
            const abi = LSP8IdentifiableDigitalAssetContract.abi.find(
              ({ name }) => name === 'getDataBatch'
            )
            const call = ABICoder.encodeFunctionCall(
              abi as AbiItem,
              [
                plainKeys.map(({ keyName, dynamicKeyParts }) =>
                  encodeKeyName(keyName, dynamicKeyParts)
                )
              ] as unknown as string[]
            )
            multicall.push({
              target: address,
              call,
              queries: plainKeys,
              selector(data: string) {
                if (data === '0x') {
                  return null
                }
                return ABICoder.decodeParameters(abi?.outputs || [], data)[0]
              }
            })
          }
          if (arrayKeys.length > 0) {
            for (const query of arrayKeys) {
              const { keyName, dynamicKeyParts, address } = query
              const abi = LSP2FetcherWithMulticall3Contract.abi.find(
                ({ name }) => name === 'fetchArrayWithElements'
              )
              const call = ABICoder.encodeFunctionCall(abi as AbiItem, [
                address,
                encodeKeyName(keyName, dynamicKeyParts)
              ])
              multicall.push({
                target: '0x0000000000000000000000000000000000000000',
                call,
                query,
                selector(data: string) {
                  if (data === '0x') {
                    if (resultsLog.enabled) {
                      resultsLog('array', { query, data, result: null })
                    }
                    return null
                  }
                  const result = ABICoder.decodeParameters(
                    abi?.outputs || [],
                    data
                  )[0]
                  if (resultsLog.enabled) {
                    resultsLog('array', { query, data, result })
                  }
                  return result
                }
              })
            }
          }
        }

        if (call) {
          for (const query of call) {
            if (address === LSP2ContractAddress) {
              const abi = defaultAbi.find((item) => {
                if (item.type !== 'function') {
                  return false
                }
                const { name, inputs } = item
                return (
                  name === query.method.replace(/\(.*$/, '') &&
                  `${name}(${inputs?.map(({ type }) => type).join(',')})` ===
                    query.method
                )
              })
              if (abi) {
                const call = ABICoder.encodeFunctionCall(
                  abi as AbiItem,
                  (query.args || []) as string[]
                )
                multicall.push({
                  target: '0x0000000000000000000000000000000000000000',
                  call,
                  query,
                  selector(data: string) {
                    return ABICoder.decodeParameters(
                      abi?.outputs || [],
                      data
                    )[0]
                  }
                })
              } else {
                query.reject(new Error('Method not found'))
              }
            } else {
              const abi =
                query.abi ||
                defaultAbi.find((item) => {
                  if (item.type !== 'function') {
                    return false
                  }
                  const { name, inputs } = item
                  return (
                    name === query.method.replace(/\(.*$/, '') &&
                    `${name}(${inputs?.map(({ type }) => type).join(',')})` ===
                      query.method
                  )
                })
              if (abi) {
                const call = ABICoder.encodeFunctionCall(
                  abi as AbiItem,
                  (query.args || []) as string[]
                )
                multicall.push({
                  target: address,
                  call,
                  query,
                  selector(data: string) {
                    if (data === '0x') {
                      return null
                    }
                    return ABICoder.decodeParameters(
                      (abi?.outputs || []) as any,
                      data
                    )[0]
                  }
                })
              } else {
                query.reject(new Error('Method not found'))
              }
            }
          }
        }
      }

      for (const query of singleCallQueries) {
        const { keyName, dynamicKeyParts, address, type, tokenId } = query
        if (type === 'getData') {
          const abi = LSP8IdentifiableDigitalAssetContract.abi.find(
            ({ name }) => name === (tokenId ? 'getDataForTokenId' : 'getData')
          )
          const key = encodeKeyName(keyName, dynamicKeyParts)
          const call = ABICoder.encodeFunctionCall(
            abi as AbiItem,
            (tokenId ? [tokenId, key] : [key]) as unknown as string[]
          )
          singlecall.push({
            target: address,
            call,
            query,
            selector(data: string) {
              if (data === '0x') {
                return null
              }
              return ABICoder.decodeParameters(
                (abi?.outputs || []) as any,
                data
              )[0]
            }
          })
        } else if (type === 'call') {
          const abi =
            query.abi ||
            defaultAbi.find((item) => {
              if (item.type !== 'function') {
                return false
              }
              const { name, inputs } = item
              return (
                name === query.method.replace(/\(.*$/, '') &&
                `${name}(${inputs?.map(({ type }) => type).join(',')})` ===
                  query.method
              )
            })
          if (abi) {
            const call = ABICoder.encodeFunctionCall(
              abi as AbiItem,
              (query.args || []) as string[]
            )
            singlecall.push({
              target: address,
              call,
              query,
              selector(data: string) {
                if (data === '0x') {
                  return null
                }
                return ABICoder.decodeParameters(
                  (abi?.outputs || []) as any,
                  data
                )[0]
              }
            })
          } else {
            query.reject(new Error('Method not found'))
          }
        }
      }
      await limiter.removeTokens(1)
      const doSinglecall = async (singlecall: Multicall) => {
        const { query, extract, selector } = singlecall
        const start = Date.now()
        const web3 = getWeb3()
        const { target, call } = singlecall
        try {
          await limiter.removeTokens(1)
          let data: any = await web3.eth.call({
            to: target,
            data: call
          })
          if (extract) {
            data = extract.call(singlecall, data)
          }
          if (selector) {
            data = selector.call(singlecall, data)
          }
          if ('getData' === query?.type) {
            data = await convert(
              query as QueryPromise<unknown, QueryPromiseDataOptions>,
              data
            )
          }
          if (resultsLog.enabled) {
            resultsLog(
              'single-call',
              `${Math.round((Date.now() - start) / 100) / 10}s`,
              {
                query,
                data
              }
            )
          }
          singlecall.query?.resolve(data)
        } catch (error) {
          if (resultsLog.enabled) {
            resultsLog(
              'single-call-reject',
              `${Math.round((Date.now() - start) / 100) / 10}s`,
              { query, error }
            )
          }
          singlecall.query?.reject(error)
        }
      }
      const doMulticall = async () => {
        const currentMulticalls = multicall.splice(
          0,
          Math.min(MAX_AGGREGATE_COUNT, multicall.length)
        )
        const resolved: any[] | undefined = resultsLog.enabled ? [] : undefined
        const start = Date.now()
        await lsp2CustomContract.methods
          .aggregate4(
            currentMulticalls.map(({ target, call }) => [target, true, call]),
            MAX_AGGREGATE_DATA_LIMIT
          )
          .call()
          .then(
            async (result: [string | number, string | number, string][]) => {
              for (const [i, multiItem] of currentMulticalls.entries()) {
                const { query, queries, selector, extract } = multiItem
                const [_success, , _data] = result[i]
                const success = toNumber(_success, false) as number
                if (success === 3) {
                  multicall.push(multiItem)
                  triggerQuery()
                  continue
                }
                if (success === 2) {
                  const _queries = query ? [query] : queries || []
                  for (const query of _queries) {
                    query.aggregateLimit = 1
                    queryList.splice(0, 0, query)
                  }
                  triggerQuery()
                  continue
                }
                let rawData = _data
                if (extract) {
                  rawData = extract.call(multiItem, rawData)
                  if (resultsLog.enabled) {
                    resultsLog('extract', { data: rawData, origin: _data })
                  }
                }
                const data = rawData
                if (queries) {
                  if (!success) {
                    for (const query of queries) {
                      // Normal success=false means the call is not supported
                      if (resultsLog.enabled) {
                        resolved?.push({
                          query,
                          error: 'not successful (assume null)'
                        })
                      }
                      query.resolve(null)
                    }
                    continue
                  }
                  let items = data
                  try {
                    if (selector) {
                      items = selector.call(multiItem, data)
                      if (resultsLog.enabled) {
                        resultsLog('item-selector', { items, data })
                      }
                    }
                  } catch (error) {
                    for (const query of queries) {
                      if (resultsLog.enabled) {
                        resolved?.push({
                          query,
                          error
                        })
                      }
                      query.reject(error)
                    }
                    continue
                  }
                  for (const [j, query] of queries.entries()) {
                    let item: string | null = items?.[j] || null
                    const _data = item
                    try {
                      if ('getData' === query.type) {
                        item = await convert(
                          query as QueryPromise<
                            unknown,
                            QueryPromiseDataOptions
                          >,
                          item
                        )
                      }
                      if (success) {
                        if (resultsLog.enabled) {
                          resolved?.push({
                            query,
                            data: item,
                            raw: _data,
                            items
                          })
                        }
                        query.resolve(item)
                      } else {
                        // Normal success=false means the call is not supported
                        if (resultsLog.enabled) {
                          resolved?.push({
                            query,
                            error: 'not successful (assume null)',
                            raw: _data,
                            items,
                            index: j
                          })
                        }
                        query.resolve(null)
                      }
                    } catch (error) {
                      try {
                        if (resultsLog.enabled) {
                          resolved?.push({
                            query,
                            error,
                            raw: _data,
                            items,
                            index: j
                          })
                        }
                        query.reject(error)
                      } catch {
                        // Really ignore, we tried our best
                      }
                    }
                  }
                  continue
                }
                try {
                  if (success) {
                    let item: string | null = data
                    if ('getData' === query?.type) {
                      let schema = (
                        (query?.schema as ERC725JSONSchema[]) || defaultSchema
                      ).find(({ name }) => name === query?.keyName)
                      if (schema && schema.keyType === 'Array') {
                        const array = ABICoder.decodeParameters(
                          ['bytes[]'],
                          item
                        )[0] as string[]
                        schema = { ...schema, keyType: 'Singleton' }
                        query?.resolve(
                          await Promise.all(
                            array.map((value) =>
                              convert(
                                query as QueryPromise<
                                  unknown,
                                  QueryPromiseDataOptions
                                >,
                                value,
                                schema ? [schema] : undefined
                              )
                            )
                          )
                        )
                        continue
                      }
                      if (selector) {
                        item = selector.call(multiItem, item)
                      }
                      item = await convert(
                        query as QueryPromise<unknown, QueryPromiseDataOptions>,
                        item
                      )
                    } else if (selector) {
                      item = selector.call(multiItem, item)
                    }
                    if (resultsLog.enabled) {
                      resolved?.push({
                        query,
                        data: item,
                        raw: _data
                      })
                    }
                    query?.resolve(item)
                  } else {
                    // Normal success=false means the call is not supported
                    resolved?.push({
                      query,
                      error: 'not successful (assume null)',
                      raw: _data
                    })
                    query?.resolve(null)
                  }
                } catch (error) {
                  try {
                    // This is an actual error so reject
                    if (resultsLog.enabled) {
                      resolved?.push({
                        query,
                        error,
                        raw: _data
                      })
                    }
                    query?.reject(error)
                  } catch {
                    // Really ignore, we tried our best
                  }
                }
              }
            }
          )
          .catch((error: Error) => {
            // console.error(
            //   'failure',
            //   error,
            //   multicall.length,
            //   multicall.map(({ query, queries }) => ({
            //     type: query?.type || queries?.[0].type + 'Batch',
            //     keyName:
            //       query?.keyName || queries?.map(({ keyName }) => keyName),
            //   }))
            // )
            if (resultsLog.enabled) {
              resultsLog(
                'error',
                error,
                multicall.length,
                multicall.map(({ query, queries }) => ({
                  type: query?.type || `${queries?.[0].type} (Batch)`,
                  keyName:
                    query?.keyName || queries?.map(({ keyName }) => keyName)
                }))
              )
            }
            throw error
          })
          .finally(() => {
            if (resultsLog.enabled) {
              resultsLog(
                'results',
                `${Math.round((Date.now() - start) / 100) / 10}s`,
                resolved
              )
            }
          })
      }
      running++
      try {
        await doMulticall()
      } finally {
        running--
      }
      while (running < MAX_PARALLEL_REQUESTS && singlecall.length > 0) {
        running++
        try {
          await doSinglecall(singlecall.shift() as Multicall)
        } finally {
          running--
        }
      }
      while (running < MAX_PARALLEL_REQUESTS && multicall.length > 0) {
        running++
        try {
          await doMulticall()
        } finally {
          running--
        }
      }
    } catch (error) {
      for (const query of queries) {
        query.reject(error)
      }
    }
  } finally {
    running--
    if (queryList.length > 0 || multicall.length > 0 || singlecall.length > 0) {
      triggerQuery()
    }
  }
}

// TODO: import this from next release of `@lukso/lsp-smart-contracts@0.15.0
const INTERFACE_ID_LSP7_PREVIOUS = {
  '0xb3c4928f': 'v0.14.0',
  '0xdaa746b7': 'v0.12.0'
}

// TODO: import this from next release of `@lukso/lsp-smart-contracts@0.15.0
const INTERFACE_ID_LSP8_PREVIOUS = {
  '0xecad9f75': 'v0.13.0',
  '0x30dc5278': 'v0.12.0'
}

const LSP7_INTERFACE_IDS = [
  INTERFACE_IDS.LSP7DigitalAsset,
  ...Object.keys(INTERFACE_ID_LSP7_PREVIOUS)
] as `0x${string}`[]

const LSP8_INTERFACE_IDS = [
  INTERFACE_IDS.LSP8IdentifiableDigitalAsset,
  ...Object.keys(INTERFACE_ID_LSP8_PREVIOUS)
] as `0x${string}`[]

export type Interface = {
  interfaceId: `0x${string}`
  standard: 'LSP3Profile' | 'LSP7DigitalAsset' | 'LSP8IdentifiableDigitalAsset'
}

export const interfacesToCheck: Interface[] = [
  {
    interfaceId: INTERFACE_IDS.LSP0ERC725Account as `0x${string}`,
    standard: 'LSP3Profile'
  },
  ...LSP7_INTERFACE_IDS.map<Interface>((interfaceId) => ({
    interfaceId,
    standard: 'LSP7DigitalAsset'
  })),
  ...LSP8_INTERFACE_IDS.map<Interface>((interfaceId) => ({
    interfaceId,
    standard: 'LSP8IdentifiableDigitalAsset'
  }))
]

export function triggerQuery() {
  if (queryTimer) {
    clearTimeout(queryTimer)
  }
  queryTimer = setTimeout(() => {
    queryTimer = undefined
    doQueries()
  }, QUERY_TIMEOUT)
}

/**
 * Gets a base64 encoded image from cache.
 * If there is no image in cache, it will use original image url and do caching afterwards.
 *
 * @param image - image to get from cache
 * @returns
 */
// export const getCachedImageUrl = async (image?: Image) => {
//   const cache = await caches.open(CACHE_KEY.IMAGE_CACHE)

//   if (!image || !image.url) {
//     return ''
//   }

//   const imageUrl = resolveUrl(image.url)
//   const cachedImage = await cache.match(imageUrl)

//   if (cachedImage) {
//     const imageObjectCache: ImageObjectCache = await cachedImage.json()
//     return imageObjectCache.encodedImage
//   } else {
//     const fetchedImage = await fetchAndConvertImage(imageUrl)
//     const imageObjectCache: ImageObjectCache = {
//       encodedImage: fetchedImage,
//       url: imageUrl,
//     }
//     await cache.put(
//       imageUrl,
//       new Response(JSON.stringify(imageObjectCache), {
//         headers: {
//           'Content-Length': imageObjectCache.encodedImage.length.toString(),
//         },
//       })
//     )
//   }

//   return imageUrl
// }

export type QFQueryOptions<T = unknown> = {
  queryKey: readonly unknown[]
  queryFn: QueryFunction<T, readonly unknown[]>
  staleTime?: number
  refetchInterval?: number
  retry?: number | boolean
}

export type CallContractQueryOptions = {
  abi?: readonly AbiItem[]
  address: Address
  method: string
  args?: readonly unknown[]
  chainId: string
  staleTime?: number
  refetchInterval?: number
  retry?: number | boolean
  aggregateLimit?: number
  priority?: number
  process?: (data: any) => Promise<any>
}

export function queryCallContract<T>({
  abi,
  address,
  method,
  args = [],
  chainId,
  aggregateLimit = MAX_AGGREGATE_COUNT,
  priority = Priorities.Normal,
  staleTime,
  refetchInterval,
  retry,
  process
}: CallContractQueryOptions): QFQueryOptions<T> {
  const methodName = method.replace(/\(.*$/, '')
  const methodItem = (abi || defaultAbi).find((item) => {
    if (item.type !== 'function') {
      return false
    }
    const { name, inputs } = item
    return (
      name === methodName &&
      `${name}(${inputs?.map(({ type }) => type).join(',')})` === method
    )
  })
  const queryKey = [
    'call',
    chainId,
    address,
    method,
    ...(args ? (args as unknown as unknown[]) : [])
  ] as readonly unknown[]
  if (!methodItem) {
    console.warn(
      `Method ${method} not found in abi so we will not decode result data`
    )
    return {
      queryFn: async () => {
        console.error('Method not found in abi')
        return '0x' as any
      },
      queryKey
    }
  }
  return {
    ...(staleTime ? { staleTime } : {}),
    ...(refetchInterval ? { refetchInterval } : {}),
    ...(retry ? { retry } : { retry: false }),
    queryKey,
    queryFn: async (): Promise<T> => {
      const query = createQueryPromise<T>({
        type: 'call',
        aggregateLimit,
        priority,
        chainId,
        abi: methodItem,
        address,
        method,
        args,
        queryKey,
        process
      })
      queryList.push(query as QueryPromise<T, QueryPromiseCallOptions>)
      triggerQuery()
      return query.promise
    }
  }
}

export type GetDataQueryOptions = {
  address: Address
  chainId: string
  keyName: string
  schema?: readonly ERC725JSONSchema[]
  tokenId?: string
  staleTime?: number
  refetchInterval?: number
  retry?: number | boolean
  aggregateLimit?: number
  priority?: number
  process?: (data: any) => Promise<any>
}

export type VerifiableURI = {
  verification: {
    method: Hex | 'keccak256(utf8)' | 'keccak256(bytes)'
    data: Hex
  }
  url: string
}

export function queryNull(): QFQueryOptions<null> {
  return {
    queryKey: ['null'],
    queryFn: async () => null
  }
}

export function queryGetData<T>({
  address,
  chainId,
  keyName,
  schema,
  tokenId,
  staleTime,
  refetchInterval,
  retry,
  aggregateLimit = MAX_AGGREGATE_COUNT,
  priority = Priorities.Normal,
  process
}: GetDataQueryOptions): QFQueryOptions<T> {
  const schemaItem = (schema || defaultSchema).find(
    ({ name }) => name === keyName
  )
  const queryKey = [
    tokenId ? 'getDataForTokenId' : 'getData',
    chainId,
    address,
    ...(tokenId ? [tokenId] : []),
    keyName
  ] as readonly unknown[]
  return {
    ...(staleTime ? { staleTime } : {}),
    ...(refetchInterval ? { refetchInterval } : {}),
    ...(retry ? { retry } : { retry: false }),
    queryKey,
    queryFn: async (): Promise<T> => {
      const query = createQueryPromise({
        type: 'getData',
        aggregateLimit,
        priority,
        chainId,
        address,
        tokenId,
        keyName,
        schema: [schemaItem],
        queryKey,
        process
      })
      queryList.push(query as QueryPromise<unknown, QueryPromiseDataOptions>)
      triggerQuery()
      return query.promise as Promise<T>
    }
  }
}
