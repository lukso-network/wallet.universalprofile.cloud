export const setItem = (key: string, value: string) => {
  if (localStorage) localStorage.setItem(key, value)
  else throw new Error('No local storage')
}

export const getItem = (key: string): string | null => {
  if (localStorage) return localStorage.getItem(key)
  else throw new Error('No local storage')
}

export const removeItem = (key: string) => {
  if (localStorage) return localStorage.removeItem(key)
  else throw new Error('No local storage')
}

export default function useLocalStorage() {
  return {
    setItem,
    getItem,
    removeItem,
  }
}
