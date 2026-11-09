import type { ReactNode } from 'react'

const accents = [
  { border: 'border-primary', text: 'text-primary', bg: 'bg-primary/10' },
  { border: 'border-secondary', text: 'text-secondary', bg: 'bg-secondary/10' },
  { border: 'border-accent', text: 'text-accent-content', bg: 'bg-accent/30' },
]

interface Props {
  coverText: string
  avatar?: string | null
  image?: string
  colorIndex: number
  title: string
  subtitle?: string
  tags: string[]
  action: ReactNode
  cornerAction?: ReactNode
}

export default function CoverCard({ coverText, avatar, image, colorIndex, title, subtitle, tags, action, cornerAction }: Props) {
  const accent = accents[colorIndex % accents.length]

  return (
    <article className={`card relative border-t-4 bg-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg ${accent.border}`}>
      {image && <img src={image} alt={`ปก ${title}`} loading="lazy" className="h-40 w-full rounded-t-box object-cover" />}
      {cornerAction}
      <div className="card-body gap-3">
        <div className={`flex items-start gap-3 ${!image && cornerAction ? 'pr-7' : ''}`}>
          <div className={`flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-box text-xl font-bold ${accent.bg} ${accent.text}`}>
            {avatar ? <img src={avatar} alt={subtitle ?? ''} loading="lazy" className="h-full w-full object-cover" /> : coverText}
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
