import { expect } from '@playwright/test'

import { test } from './helpers/fixtures'

test.skip('user can see lyx details page when not connected', async ({
  page
}) => {
  await page.goto('/0x64DE43F67e533b59A5791E6aB1e5a80626E10710/lyx-details')
  await page.waitForLoadState('networkidle')
  await expect(page).toHaveScreenshot('lyx-details-disconnected.png')
  await expect(page).toHaveURL(
    '/0x64DE43F67e533b59A5791E6aB1e5a80626E10710/lyx-details'
  )
})
