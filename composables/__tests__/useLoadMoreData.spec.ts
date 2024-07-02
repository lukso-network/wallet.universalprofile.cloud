import { describe, expect, test, vi } from 'vitest'

import { useLoadMoreData } from '../useLoadMoreData'

vi.mock('@/utils/sleep')

describe('useLoadMoreData', () => {
  test('should initialize state correctly with default options', () => {
    const queryCall = vi.fn()
    const loadMoreData = useLoadMoreData(queryCall)

    expect(loadMoreData.isLoading.value).toBe(true)
    expect(loadMoreData.offset.value).toBe(0)
    expect(loadMoreData.limit.value).toBe(60)
    expect(loadMoreData.total.value).toBeNull()
    expect(loadMoreData.data.value).toEqual([])
    expect(loadMoreData.hasData.value).toBe(false)
  })

  test('should initialize state correctly with custom options', () => {
    const queryCall = vi.fn()
    const loadMoreData = useLoadMoreData(queryCall, {
      distance: 1000,
      limit: 100,
      delay: 500,
    })

    expect(loadMoreData.isLoading.value).toBe(true)
    expect(loadMoreData.offset.value).toBe(0)
    expect(loadMoreData.limit.value).toBe(100)
    expect(loadMoreData.total.value).toBeNull()
    expect(loadMoreData.data.value).toEqual([])
    expect(loadMoreData.hasData.value).toBe(false)
  })

  test('should load more data when called', async () => {
    const queryCall = vi.fn()
    const mockData = ['test']
    const mockMeta = { total: 20 }
    queryCall.mockResolvedValue({ data: mockData, meta: mockMeta })
    const loadMoreData = useLoadMoreData(queryCall, {
      limit: 10,
    })

    // we simulate the infinite scroll
    await loadMoreData.loadMore()
    await loadMoreData.loadMore()
    await loadMoreData.loadMore()

    expect(queryCall).toHaveBeenCalledTimes(2)
    expect(loadMoreData.offset.value).toBe(20)
    expect(loadMoreData.total.value).toBe(20)
    expect(loadMoreData.data.value).toEqual(['test', 'test'])
    expect(loadMoreData.hasData.value).toBe(true)
  })

  test('should load more data when called', async () => {
    const queryCall = vi.fn()
    const mockData = [{ id: 1 }, { id: 2 }]
    const mockMeta = { total: 10 }
    queryCall.mockResolvedValue({ data: mockData, meta: mockMeta })
    const loadMoreData = useLoadMoreData(queryCall)

    // we simulate the infinite scroll
    await loadMoreData.loadMore()
    await loadMoreData.loadMore()
    await loadMoreData.loadMore()

    expect(queryCall).toHaveBeenCalledTimes(1)
    expect(loadMoreData.offset.value).toBe(60)
    expect(loadMoreData.total.value).toBe(10)
    expect(loadMoreData.data.value).toEqual(mockData)
    expect(loadMoreData.hasData.value).toBe(true)
  })

  test('should not load more data if total is reached', async () => {
    const queryCall = vi.fn()
    queryCall.mockResolvedValue({ data: [], meta: { total: 0 } })
    const loadMoreData = useLoadMoreData(queryCall)
    loadMoreData.total.value = 0

    await loadMoreData.loadMore()

    expect(queryCall).not.toHaveBeenCalled()
  })

  test('should handle errors during data loading', async () => {
    const queryCall = vi.fn()
    queryCall.mockRejectedValue(new Error('Test error'))
    const loadMoreData = useLoadMoreData(queryCall)

    await loadMoreData.loadMore()

    expect(queryCall).toHaveBeenCalled()
    expect(loadMoreData.isLoading.value).toBe(false)
  })
})
