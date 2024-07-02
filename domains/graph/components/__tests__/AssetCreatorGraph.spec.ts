import { renderSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it } from 'vitest'

import AssetCreatorGraph from '@/domains/graph/components/AssetCreatorGraph.vue'

describe('AssetCreatorGraph', () => {
  beforeEach(() => {
    useIntl().setupIntl(defaultConfig)
  })

  it('should render empty state', async () => {
    const component = await renderSuspended(AssetCreatorGraph)

    expect(component.html()).toMatchSnapshot()
  })

  it('should render unverified creator', async () => {
    const component = await renderSuspended(AssetCreatorGraph, {
      props: {
        creator: {
          address: '0x123',
          name: 'John Doe',
          issuedAssets: ['0x456'],
        },
        asset: {},
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render verified creator', async () => {
    const component = await renderSuspended(AssetCreatorGraph, {
      props: {
        creator: {
          address: '0x123',
          name: 'John Doe',
          issuedAssets: ['0x456'],
        },
        asset: {
          address: '0x456',
        },
      },
    })

    expect(component.html()).toMatchSnapshot()
  })
})
