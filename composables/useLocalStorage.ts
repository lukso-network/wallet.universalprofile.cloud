export const setItem = (key: string, value: string) => {
  if (globalThis?.localStorage) {
    return globalThis?.localStorage.setItem(key, value)
  }

  throw new Error('No local storage')
}

export const getItem = (key: string): string | null => {
  if (globalThis?.localStorage) {
    return globalThis?.localStorage.getItem(key)
  }

  throw new Error('No local storage')
}

export const removeItem = (key: string) => {
  if (globalThis?.localStorage) {
    return globalThis?.localStorage.removeItem(key)
  }

  throw new Error('No local storage')
}

export default function useLocalStorage() {
  return {
    setItem,
    getItem,
    removeItem,
  }
}
