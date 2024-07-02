import { renderSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import AssetCreatorsGraph from '@/domains/graph/components/AssetCreatorsGraph.vue'

describe('AssetCreatorsGraph', () => {
  beforeEach(() => {
    useIntl().setupIntl(defaultConfig)
  })

  it('should render loading state', async () => {
    const component = await renderSuspended(AssetCreatorsGraph)

    expect(component.html()).toMatchSnapshot()
  })

  it('should render empty state', async () => {
    const component = await renderSuspended(AssetCreatorsGraph, {
      props: {
        asset: {
          tokenCreatorsData: [],
        },
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render creators', async () => {
    const component = await renderSuspended(AssetCreatorsGraph, {
      props: {
        asset: {
          tokenCreatorsData: [
            {
              address: '0x123',
              name: 'John Doe',
              issuedAssets: ['0x456'],
            },
            {
              address: '0x789',
              name: 'Jane Doe',
              issuedAssets: ['0xabc'],
            },
          ],
        },
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should fallback to owner', async () => {
    const component = await renderSuspended(AssetCreatorsGraph, {
      props: {
        asset: {
          tokenCreatorsData: [],
          ownerData: {
            address: '0x123',
            name: 'John Doe',
            issuedAssets: ['0x456'],
          },
        },
      },
    })

    expect(component.html()).toMatchSnapshot()
  })
})
