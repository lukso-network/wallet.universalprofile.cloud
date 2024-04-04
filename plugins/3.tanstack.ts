import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { persistQueryClient } from '@tanstack/query-persist-client-core'
import {
  QueryClient,
  VueQueryPlugin,
  dehydrate,
  hydrate
} from '@tanstack/vue-query'
import debug from 'debug'

// import { defaultQueryFn } from '@/utils/queryFunctions'
import { TANSTACK_DEFAULT_STALE_TIME, TANSTACK_GC_TIME } from '@/shared/config'

import type {
  DehydratedState,
  VueQueryPluginOptions
} from '@tanstack/vue-query'
import type { NuxtApp } from 'nuxt/app'

debug.enable(localStorage.getItem('debug') || '')

export default defineNuxtPlugin((nuxt: NuxtApp) => {
  const vueQueryState = useState<DehydratedState | null>('vue-query')
  const {
    public: { BUILD_VERSION: buster = 'debug' }
  } = useRuntimeConfig()
  // Modify your Vue Query global settings here
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: TANSTACK_DEFAULT_STALE_TIME,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        gcTime: TANSTACK_GC_TIME
        // queryFn: defaultQueryFn,
      }
    }
  })

  const options: VueQueryPluginOptions = {
    queryClient,
    clientPersister: (queryClient) =>
      persistQueryClient({
        queryClient,
        persister: createAsyncStoragePersister({ storage: localStorage }),
        buster: buster as string
      })
  }

  nuxt.vueApp.use(VueQueryPlugin, options)

  if (process.server) {
    nuxt.hooks.hook('app:rendered', () => {
      vueQueryState.value = dehydrate(queryClient)
    })
  }

  if (process.client) {
    nuxt.hooks.hook('app:created', () => {
      hydrate(queryClient, vueQueryState.value)
    })
  }
})
