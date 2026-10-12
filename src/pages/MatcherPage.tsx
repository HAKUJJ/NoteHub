import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import CoverCard from '../components/ui/CoverCard'
import CardGrid from '../components/ui/CardGrid'
import { calculateMatches, matcherGroups, type MatchResult } from '../lib/matcher'

export default function MatcherPage() {
  const [selected, setSelected] = useState<string[]>([])
  const [error, setError] = useState('')
  const [results, setResults] = useState<MatchResult[] | null>(null)
  const resultRef = useRef<HTMLElement>(null)
  const topRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (results) resultRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [results])

  const toggle = (value: string) =>
    setSelected((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (selected.length === 0) {
      setError('กรุณาเลือกอย่างน้อย 1 ตัวเลือก ก่อนกด Match')
      return
    }
    setError('')
    setResults(calculateMatches(selected))
  }

  const restart = () => {
    setSelected([])
    setResults(null)
    setError('')
    topRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <section ref={topRef} className="mb-6 text-center">
        <h1 className="text-3xl font-bold">ค้นหาสาขาที่ใช่สำหรับคุณ</h1>
        <p className="mt-2">เลือกทักษะ ความสนใจ และงานอดิเรกของคุณ แล้วให้ NotesHub ช่วยแนะนำสาขาวิชาที่เหมาะกับคุณที่สุด</p>
      </section>

      <form onSubmit={handleSubmit} className="mx-auto flex max-w-4xl flex-col gap-8 rounded-box bg-white p-6 shadow-md">
        {matcherGroups.map((group, gi) => (
          <div key={group.title} role="group" aria-labelledby={`matcher-group-${gi}`}>
            <h2 id={`matcher-group-${gi}`} className="mb-4 text-lg font-bold text-primary">{group.title}</h2>
            <div className="flex flex-wrap gap-3">
              {group.options.map((o) => {
                const active = selected.includes(o.value)
                return (
                  <button
                    key={o.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggle(o.value)}
                    className={`badge badge-lg cursor-pointer px-4 py-4 text-sm md:text-base ${
                      active
                        ? 'border-primary bg-primary text-white'
                        : 'border border-gray-300 bg-white hover:bg-gray-100'
                    }`}
                  >
                    {o.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
        {error && <p className="text-sm text-error" role="alert">{error}</p>}
        <button type="submit" className="btn btn-primary btn-lg mt-8 self-center rounded-full px-12">Match</button>
      </form>

      {results && (
        <section ref={resultRef} className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">ผลการจับคู่ของคุณ</h2>
            <button type="button" className="btn btn-outline btn-sm" onClick={restart}>เริ่มใหม่</button>
          </div>
          {results.length === 0 ? (
            <p className="py-6 text-center opacity-70">ยังไม่พบสาขาที่ตรงกับตัวเลือกของคุณ ลองเลือกเพิ่มเติมดูนะ</p>
          ) : (
            <CardGrid>
              {results.map((r, i) => (
                <CoverCard
                  key={r.id}
                  coverText={`${r.percent}%`}
                  colorIndex={i}
                  title={r.name}
                  tags={r.subjects}
                  action={<Link to={`/fields/${r.id}`} className="btn btn-primary btn-sm">ดูรายละเอียดสาขา</Link>}
                />
              ))}
            </CardGrid>
          )}
        </section>
      )}
    </div>
  )
}
