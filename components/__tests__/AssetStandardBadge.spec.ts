import { renderSuspended } from '@nuxt/test-utils/runtime'
import { fireEvent, screen } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import AssetStandardBadge from '@/components/AssetStandardBadge.vue'

describe('AssetStandardBadge', () => {
  beforeEach(() => {
    useIntl().setupIntl(defaultConfig)
  })

  it('should render loading state', async () => {
    const component = await renderSuspended(AssetStandardBadge)

    expect(component.html()).toMatchSnapshot()
  })

  it('should render slot content', async () => {
    const component = await renderSuspended(AssetStandardBadge, {
      slots: {
        default: 'Slot content',
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render collection badge', async () => {
    const asset: Asset = {
      standard: 'LSP8IdentifiableDigitalAsset',
      tokenIdsData: [
        {
          tokenId: '0x1',
        },
      ],
    }
    const component = await renderSuspended(AssetStandardBadge, {
      props: {
        asset,
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render LSP8 badge', async () => {
    const asset: Asset = {
      standard: 'LSP8IdentifiableDigitalAsset',
    }
    const component = await renderSuspended(AssetStandardBadge, {
      props: {
        asset,
      },
    })

    expect(component.html()).toMatchSnapshot()
  })

  it('should render LSP7 badge', async () => {
    const asset: Asset = {
      standard: 'LSP7DigitalAsset',
    }
    const component = await renderSuspended(AssetStandardBadge, {
      props: {
        asset,
      },
    })

    expect(component.html()).toMatchSnapshot()
  })
})
