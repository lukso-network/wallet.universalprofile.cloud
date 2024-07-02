import { useInfiniteScroll } from '@vueuse/core'

export type LoadMoreParams = {
  data: any[]
  meta: { total: number }
}

export type LoadMoreOptions = {
  distance?: number
  limit?: number
  delay?: number
}

export const useLoadMoreData = (
  queryCall: () => Promise<LoadMoreParams>,
  options?: LoadMoreOptions
) => {
  const optionsDefaults = {
    distance: 500,
    limit: 60,
    delay: 250,
  }
  const {
    delay,
    distance,
    limit: _limit,
  } = Object.assign(optionsDefaults, options)
  const isLoading = ref(true)
  const limit = ref(_limit)
  const offset = ref(0)
  const total = ref<number | null>(null)
  const data = ref<Asset[]>([])
  const el = ref<Document | null>(null)
  const hasData = computed(() => data.value.length > 0)

  const loadMore = async () => {
    if (total.value !== null && offset.value >= total.value) {
      return
    }

    isLoading.value = true
    await sleep(delay)

    try {
      const { data: _data, meta } = await queryCall()
      offset.value = offset.value + limit.value
      total.value = meta.total
      data.value = data.value.concat(_data)
    } catch (error) {
      //
    }

    isLoading.value = false
  }

  useInfiniteScroll(el, loadMore, { distance })

  onMounted(() => {
    el.value = document
  })

  return { total, offset, limit, isLoading, hasData, data, loadMore }
}
