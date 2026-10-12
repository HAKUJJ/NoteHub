export const required = (message: string) => (value: string) => (value.trim() ? '' : message)

export const email = (message: string) => (value: string) => (/^\S+@\S+\.\S+$/.test(value.trim()) ? '' : message)

export const minLength = (min: number, message: string) => (value: string) =>
  value.length >= min ? '' : message
