import { renderSuspended } from '@nuxt/test-utils/runtime'
import { beforeEach, describe, expect, it } from 'vitest'

import ProfileShowcaseCardGraph from '../ProfileShowcaseCardGraph.vue'

describe('ProfileShowcaseCardGraph', () => {
  beforeEach(() => {
    useIntl().setupIntl(defaultConfig)
  })

  it('should render empty state', async () => {
    const component = await renderSuspended(ProfileShowcaseCardGraph)

    expect(component.html()).toMatchSnapshot()
  })

  it('should render profile', async () => {
    const component = await renderSuspended(ProfileShowcaseCardGraph, {
      props: {
        profile: {
          address: '0x123',
          name: 'John Doe',
          backgroundImage: [
            {
              url: 'https://example.com/background-image.jpg',
              width: 100,
              height: 100,
            },
          ],
          profileImage: [
            {
              url: 'https://example.com/profile-image.jpg',
              width: 100,
              height: 100,
            },
          ],
        } as Profile,
      },
    })

    expect(component.html()).toMatchSnapshot()
  })
})
