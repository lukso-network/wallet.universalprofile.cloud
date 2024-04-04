export const setItem = (key: string, value: string) => {
  if (localStorage) {
    return localStorage.setItem(key, value)
  }

  throw new Error('No local storage')
}

export const getItem = (key: string): string | null => {
  if (localStorage) {
    return localStorage.getItem(key)
  }

  throw new Error('No local storage')
}

export const removeItem = (key: string) => {
  if (localStorage) {
    return localStorage.removeItem(key)
  }

  throw new Error('No local storage')
}

export default function useLocalStorage() {
  return {
    setItem,
    getItem,
    removeItem
  }
}
