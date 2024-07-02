/* eslint-disable @typescript-eslint/no-unused-vars */
type IndexedImageMetadata = Record<any, any> & {
  index?: number | null
}

export const unflatArray = (array?: IndexedImageMetadata[]) => {
  if (!array) {
    return []
  }

  const result = []
  let currentGroup: any[] = []

  for (let i = 0; i < array.length; i++) {
    if (array[i].index === array[i - 1]?.index) {
      const { index, ...rest } = array[i]
      currentGroup.push(rest)
    } else {
      if (currentGroup.length > 0) {
        result.push(currentGroup)
      }
      const { index, ...rest } = array[i]
      currentGroup = [rest]
    }
  }

  if (currentGroup.length > 0) {
    result.push(currentGroup)
  }

  return result
}
