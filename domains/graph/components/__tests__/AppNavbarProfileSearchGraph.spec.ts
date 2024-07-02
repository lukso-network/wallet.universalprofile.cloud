import { renderSuspended } from '@nuxt/test-utils/runtime'
import { fireEvent, screen } from '@testing-library/vue'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import AppNavbarProfileSearchGraph from '../AppNavbarProfileSearchGraph.vue'

describe('AppNavbarProfileSearchGraph', () => {
  beforeEach(() => {
    useIntl().setupIntl(defaultConfig)
  })

  it('should render', async () => {
    const component = await renderSuspended(AppNavbarProfileSearchGraph)

    expect(component.html()).toMatchSnapshot()
  })
})
