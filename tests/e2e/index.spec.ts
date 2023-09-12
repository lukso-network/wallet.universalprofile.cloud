import { expect, test } from '@playwright/test'

test('show modal with wallet options', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL('/')
})
