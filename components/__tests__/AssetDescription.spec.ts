import { renderSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import AssetDescription from '@/components/AssetDescription.vue'

describe('AssetDescription', () => {
  beforeEach(() => {
    useIntl().setupIntl(defaultConfig)
  })

  it('should render loading state', async () => {
    const component = await renderSuspended(AssetDescription)

    expect(component.html()).toMatchSnapshot()
  })

  it('should render description', async () => {
    const component = await renderSuspended(AssetDescription, {
      props: {
        asset: {
          resolvedMetadata: {
            description: 'Lorem ipsum dolor sit amet',
          },
        },
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render for no description', async () => {
    const component = await renderSuspended(AssetDescription, {
      props: {
        asset: {
          resolvedMetadata: {
            description: undefined,
          },
        },
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render without title', async () => {
    const component = await renderSuspended(AssetDescription, {
      props: {
        withoutTitle: true,
        asset: {
          resolvedMetadata: {
            description: 'Lorem ipsum dolor sit amet',
          },
        },
      },
    })

    expect(component.html()).toMatchSnapshot()
  })
})
