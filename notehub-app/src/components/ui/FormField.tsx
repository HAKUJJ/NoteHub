import type { ReactNode } from 'react'

interface Props {
  label: string
  name: string
  error?: string
  children: ReactNode
}

export default function FormField({ label, name, error, children }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="font-medium">{label}</label>
      {children}
      {error && <p className="text-sm text-error" role="alert">{error}</p>}
    </div>
  )
}
