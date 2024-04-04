import {
  HttpClient as HttpClientIntegration,
  ReportingObserver as ReportingObserverIntegration
} from '@sentry/integrations'
import * as Sentry from '@sentry/vue'
import { Scope, withScope } from '@sentry/vue'

import type { Breadcrumb, CaptureContext, Primitive, User } from '@sentry/types'
import type { NuxtApp } from 'nuxt/app'
import type { Router } from 'vue-router'

export default defineNuxtPlugin({
  parallel: true,
  setup: (nuxtApp: NuxtApp) => {
    if (
      typeof window === 'undefined' ||
      !['true', true].includes(nuxtApp.$config.public.SENTRY_ENABLED as string)
    ) {
      return {
        provide: {
          sentrySetContext: (
            _name: string,
            _context: {
              [key: string]: any
            } | null
          ) => {},
          sentrySetUser: (_user: User | null) => {},
          sentrySetTag: (_key: string, _value: Primitive) => {},
          sentryAddBreadcrumb: (_breadcrumb: Breadcrumb) => {},
          sentryCaptureException: (
            _exception: any,
            _captureContext?: CaptureContext
          ) => {}
        }
      }
    }

    Sentry.init({
      app: nuxtApp.vueApp,
      autoSessionTracking: true,
      dsn: nuxtApp.$config.public.SENTRY_DSN as string,
      environment: nuxtApp.$config.public.SENTRY_ENVIRONMENT as string,
      integrations: [
        new Sentry.BrowserTracing({
          routingInstrumentation: Sentry.vueRouterInstrumentation(
            nuxtApp.$router as Router,
            {
              routeLabel: 'path'
            }
          )
        }),
        new Sentry.Replay({
          networkDetailAllowUrls: [`https//${nuxtApp.$config.public.HOST_NAME}`]
        }),
        new HttpClientIntegration(),
        new ReportingObserverIntegration()
      ],
      tracePropagationTargets: [
        nuxtApp.$config.public.SENTRY_TRACE_PROPAGATION_TARGET as string
      ],
      trackComponents: true,
      hooks: ['activate', 'create', 'destroy', 'mount', 'update'],
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 0.2,

      // Capture Replay for 10% of all sessions,
      // plus for 100% of sessions with an error
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1
    })

    nuxtApp.vueApp.config.errorHandler = (err, context) => {
      withScope((scope: Scope) => {
        scope.setExtra('context', context)
        Sentry.captureException(err)
      })
    }

    nuxtApp.hook('app:error', (err) => {
      Sentry.captureException(err)
    })

    return {
      provide: {
        sentrySetContext: Sentry.setContext,
        sentrySetUser: Sentry.setUser,
        sentrySetTag: Sentry.setTag,
        sentryAddBreadcrumb: Sentry.addBreadcrumb,
        sentryCaptureException: Sentry.captureException
      }
    }
  }
})
