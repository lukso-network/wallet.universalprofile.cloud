import { renderSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import AssetLinks from '@/components/AssetLinks.vue'

describe('AssetLinks', () => {
  beforeEach(() => {
    useIntl().setupIntl(defaultConfig)
  })

  it('should render loading state for medium buttons', async () => {
    const component = await renderSuspended(AssetLinks)

    expect(component.html()).toMatchSnapshot()
  })

  it('should render loading state for small buttons', async () => {
    const component = await renderSuspended(AssetLinks, {
      props: {
        buttonSize: 'small',
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render links for medium buttons', async () => {
    const component = await renderSuspended(AssetLinks, {
      props: {
        buttonSize: 'small',
        asset: {
          resolvedMetadata: {
            links: [
              {
                url: 'https://link1.example.com',
                title: 'Link 1',
              },
              {
                url: 'https://link2.example.com',
                title: 'Link 2',
              },
            ],
          },
        },
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render links for small buttons', async () => {
    const component = await renderSuspended(AssetLinks, {
      props: {
        buttonSize: 'small',
        asset: {
          resolvedMetadata: {
            links: [
              {
                url: 'https://link1.example.com',
                title: 'Link 1',
              },
              {
                url: 'https://link2.example.com',
                title: 'Link 2',
              },
            ],
          },
        },
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render for no links', async () => {
    const component = await renderSuspended(AssetLinks, {
      props: {
        asset: {
          resolvedMetadata: {
            links: [],
          },
        },
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render without title', async () => {
    const component = await renderSuspended(AssetLinks, {
      props: {
        withoutTitle: true,
        asset: {
          resolvedMetadata: {
            links: [
              {
                url: 'https://link1.example.com',
                title: 'Link 1',
              },
            ],
          },
        },
      },
    })

    expect(component.html()).toMatchSnapshot()
  })
})
