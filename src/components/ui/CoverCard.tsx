import type { ReactNode } from 'react'

const accents = [
  { border: 'border-primary', text: 'text-primary', bg: 'bg-primary/10' },
  { border: 'border-secondary', text: 'text-secondary', bg: 'bg-secondary/10' },
  { border: 'border-accent', text: 'text-accent-content', bg: 'bg-accent/30' },
]

interface Props {
  coverText: string
  colorIndex: number
  title: string
  subtitle?: string
  tags: string[]
  action: ReactNode
}

export default function CoverCard({ coverText, colorIndex, title, subtitle, tags, action }: Props) {
  const accent = accents[colorIndex % accents.length]

  return (
    <article className={`card border-t-4 bg-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg ${accent.border}`}>
      <div className="card-body gap-3">
        <div className="flex items-start gap-3">
          <div className={`flex size-12 shrink-0 items-center justify-center rounded-box text-xl font-bold ${accent.bg} ${accent.text}`}>
            {coverText}
          </div>
          <div className="min-w-0">
            <h3 className="card-title text-base leading-snug">{title}</h3>
            {subtitle && <p className="mt-1 text-sm opacity-70">{subtitle}</p>}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="badge badge-outline badge-sm border-gray-300 bg-transparent text-gray-600">{tag}</span>
          ))}
        </div>
        <div className="card-actions mt-1 justify-end">{action}</div>
      </div>
    </article>
  )
}
