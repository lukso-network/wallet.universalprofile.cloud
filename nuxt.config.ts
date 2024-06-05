import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
// @ts-ignore
import { assets } from '@lukso/web-components/tools/assets'
import { copyAssets } from '@lukso/web-components/tools/copy-assets'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import nodePolyfills from 'rollup-plugin-polyfill-node'

import siteMeta from './site.meta.json'

copyAssets('./public', assets)

const isProduction = process.env.NODE_ENV === 'production'

if (isProduction) {
  console.log('🚢 🚢 Building for Production')
}

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: !isProduction },
  app: {
    head: siteMeta,
  },
  typescript: {
    strict: true,
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/device',
    '@nuxtjs/plausible',
    '@nuxtjs/algolia',
    '@pinia-orm/nuxt',
    '@nuxt/test-utils/module',
    '@vite-pwa/nuxt',
  ],
  ...({
    plausible: {
      domain: 'universalprofile.cloud',
    },
  } as any),
  device: {
    refreshOnResize: true,
  },
  tailwindcss: {
    config: {
      presets: [require('./tailwind.config')],
      content: [], // it already merges with nuxt default config https://tailwindcss.nuxt.dev/tailwind/config#merging-strategy
    },
    cssPath: '~/assets/styles/main.scss',
  },
  vite: {
    server: {
      fs: {
        allow: ['..'],
      },
    },
    plugins: [
      // ↓ Needed for development mode
      !isProduction &&
        nodePolyfills({
          include: ['node_modules/**/*.js', /node_modules\/.vite\/.*js/],
        }),
      sentryVitePlugin({
        authToken: process.env.NUXT_PUBLIC_SENTRY_AUTH_TOKEN,
        debug: true,
        org: 'lukso',
        project: 'wallet-universalprofile-cloud',
        sourcemaps: {
          assets: ['./.nuxt/dist/client/**'],
        },
        telemetry: false,
      }),
    ],
    build: {
      rollupOptions: {
        plugins: [
          // ↓ Needed for build
          nodePolyfills(),
        ],
      },
      commonjsOptions: {
        transformMixedEsModules: true,
      },
      sourcemap: true,
      target: ['esnext'],
    },
    resolve: {
      alias: {
        process: 'process/browser',
        stream: 'stream-browserify',
        http: 'stream-http',
        https: 'agent-base',
        zlib: 'browserify-zlib',
        util: 'util',
        buffer: 'buffer',
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
        // Enable esbuild polyfill plugins
        plugins: [
          // @ts-ignore
          NodeGlobalsPolyfillPlugin({
            buffer: true, // fixes `Buffer is not defined` error
          }),
        ],
        target: 'esnext',
        supported: {
          bigint: true,
        },
      },
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => {
        return tag.startsWith('lukso-')
      },
    },
  },
  imports: {
    dirs: ['stores/**', 'shared/**', 'utils/**', 'types/**'],
  },
  ssr: true,
  spaLoadingTemplate: 'public/loading-template.html',
  piniaPersistedstate: {
    storage: 'localStorage',
  },
  runtimeConfig: {
    public: {
      SENTRY_ENABLED: process.env.NUXT_PUBLIC_SENTRY_ENABLED,
      SENTRY_DSN: process.env.NUXT_PUBLIC_SENTRY_DSN,
      SENTRY_ENVIRONMENT: process.env.NUXT_PUBLIC_SENTRY_ENVIRONMENT,
      TRANSAK_API_KEY: process.env.NUXT_PUBLIC_TRANSAK_API_KEY,
      RAMP_API_KEY: process.env.NUXT_PUBLIC_RAMP_API_KEY,
      BUILD_VERSION: process.env.GITHUB_SHA || 'debug',
    },
  },
  pwa: {
    strategies: 'injectManifest',
    srcDir: 'service-worker',
    filename: 'sw.ts',
    registerType: 'autoUpdate',
    manifest: {
      name: 'UP dApp Caching PWA',
      short_name: 'up-dapp-pwa',
      theme_color: '#ffffff',
      icons: [
        {
          src: '/favicon.png',
          sizes: '256x256',
          type: 'image/png',
        },
        {
          src: '/apple-touch-icon.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    },
    injectManifest: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
      // you don't need to include this: only for testing purposes
      // if enabling periodic sync for update use 1 hour or so (periodicSyncForUpdates: 3600)
      // periodicSyncForUpdates: 20,
    },
    resolve: {
      alias: {
        process: 'process/browser',
        stream: 'stream-browserify',
        http: 'stream-http',
        https: 'agent-base',
        zlib: 'browserify-zlib',
        util: 'util',
        buffer: 'buffer',
      },
    },
    devOptions: isProduction
      ? {}
      : {
          enabled: true,
          disableDevLogs: true,
          suppressWarnings: true,
          navigateFallback: '/',
          navigateFallbackAllowlist: [/^\/$/],
          type: 'module',
        },
  },
  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },
})
