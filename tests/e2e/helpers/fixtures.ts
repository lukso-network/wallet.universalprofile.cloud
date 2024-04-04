import { type TestInfo, test as base } from '@playwright/test'

type TestFixtures = Record<string, unknown>

export const test = base.extend<TestFixtures>({
  // overrides default page fixture
  page: async ({ page }, use, testInfo: TestInfo) => {
    const originalSnapshotPath = testInfo.snapshotPath

    // fixes fail test issue with snapshot files that contain platform name (ie. OSX adds "darwin" while CI uses "linux")
    testInfo.snapshotPath = (snapshotName) => {
      const result = originalSnapshotPath
        .apply(testInfo, [snapshotName])
        .replace('.txt', '.json')
        .replace('-chromium', '')
        .replace('-linux', '')
        .replace('-darwin', '')

      return result
    }

    await use(page)
  }
})
