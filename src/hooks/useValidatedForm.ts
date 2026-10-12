import { useState, type ChangeEvent, type FocusEvent } from 'react'

type Rule<T> = (value: string, values: T) => string
type Rules<T> = { [K in keyof T]?: Rule<T> | Rule<T>[] }
type Errors<T> = Partial<Record<keyof T, string>>
type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export function useValidatedForm<T extends Record<string, string>>(initial: T, rules: Rules<T>) {
  const [values, setValues] = useState<T>(initial)
  const [errors, setErrors] = useState<Errors<T>>({})

  const check = (name: keyof T, vals: T): string => {
    const rule = rules[name]
    const list = Array.isArray(rule) ? rule : rule ? [rule] : []
    for (const fn of list) {
      const message = fn(vals[name], vals)
      if (message) return message
    }
    return ''
  }

  const handleChange = (e: ChangeEvent<Field>) => {
    const name = e.target.name as keyof T
    const next = { ...values, [name]: e.target.value }
    setValues(next)
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: check(name, next) }))
  }

  const handleBlur = (e: FocusEvent<Field>) => {
    const name = e.target.name as keyof T
    setErrors((prev) => ({ ...prev, [name]: check(name, values) }))
  }

  const validateAll = (): boolean => {
    const next: Errors<T> = {}
    let ok = true
    for (const name of Object.keys(rules) as (keyof T)[]) {
      const message = check(name, values)
      next[name] = message
      if (message) ok = false
    }
    setErrors(next)
    return ok
  }

  const reset = () => {
    setValues(initial)
    setErrors({})
  }

  return { values, errors, handleChange, handleBlur, validateAll, reset }
}
