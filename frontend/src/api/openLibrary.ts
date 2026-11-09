const API = 'https://openlibrary.org'
const COVER_API = 'https://covers.openlibrary.org/b/id'

export const bookSubjects = [
  { key: 'math', label: 'คณิตศาสตร์', subject: 'mathematics_textbooks' },
  { key: 'physics', label: 'ฟิสิกส์', subject: 'physics_textbooks' },
  { key: 'chemistry', label: 'เคมี', subject: 'chemistry_textbooks' },
  { key: 'biology', label: 'ชีววิทยา', subject: 'biology_textbooks' },
  { key: 'english', label: 'ภาษาอังกฤษ', subject: 'english_language_textbooks_for_foreign_speakers' },
  { key: 'thai', label: 'ภาษาไทย', subject: 'thai_language_grammar' },
  { key: 'social', label: 'สังคมศึกษา / ประวัติศาสตร์ไทย', subject: 'history_of_thailand' },
] as const

export type BookSubjectKey = (typeof bookSubjects)[number]['key']

export interface BookSearchResult {
  id: string
  title: string
  authors: string[]
  coverId: number | null
  firstPublished?: number
}

export interface BookDetails {
  id: string
  title: string
  authors: string[]
  description: string
  subjects: string[]
  coverId: number | null
  firstPublished: string
  url: string
}

interface SearchResponse {
  numFound: number
  docs: {
    key?: string
    title?: string
    author_name?: string[]
    cover_i?: number
    first_publish_year?: number
  }[]
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal })
  if (!response.ok) throw new Error(`Open Library request failed (${response.status})`)
  return response.json() as Promise<T>
}

export function getBookCoverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'M') {
  return `${COVER_API}/${coverId}-${size}.jpg`
}

export async function searchBooks({
  subject = '',
  query = '',
  limit = 25,
  signal,
}: {
  subject?: string
  query?: string
  limit?: number
  signal?: AbortSignal
}): Promise<{ total: number; books: BookSearchResult[] }> {
  const params = new URLSearchParams({
    fields: 'key,title,author_name,cover_i,first_publish_year',
    limit: String(limit),
  })
  if (subject) params.set('subject', subject)
  if (query.trim()) params.set('q', query.trim())

  const data = await fetchJson<SearchResponse>(`${API}/search.json?${params}`, signal)
  const books = (data.docs ?? []).flatMap((doc) => {
    const id = doc.key?.match(/^\/works\/(.+)$/)?.[1]
    if (!id || !doc.title) return []
    return [{
      id,
      title: doc.title,
      authors: doc.author_name ?? [],
      coverId: doc.cover_i ?? null,
      firstPublished: doc.first_publish_year,
    }]
  })
  return { total: books.length, books }
}

interface WorkResponse {
  title?: string
  authors?: { author?: { key?: string } }[]
  description?: string | { value?: string }
  subjects?: string[]
  covers?: number[]
  first_publish_date?: string
}

interface AuthorResponse {
  name?: string
}

export async function fetchBook(id: string, signal?: AbortSignal): Promise<BookDetails> {
  if (!/^OL\d+W$/.test(id)) throw new Error('รหัสหนังสือไม่ถูกต้อง')

  const work = await fetchJson<WorkResponse>(`${API}/works/${encodeURIComponent(id)}.json`, signal)
  const authorKeys = (work.authors ?? [])
    .map((entry) => entry.author?.key)
    .filter((key): key is string => Boolean(key))
    .slice(0, 3)

  const authors = await Promise.all(
    authorKeys.map(async (key) => {
      try {
        const author = await fetchJson<AuthorResponse>(`${API}${key}.json`, signal)
        return author.name ?? ''
      } catch {
        return ''
      }
    }),
  )

  const description = typeof work.description === 'string'
    ? work.description
    : work.description?.value ?? ''

  return {
    id,
    title: work.title ?? 'ไม่ระบุชื่อหนังสือ',
    authors: authors.filter(Boolean),
    description,
    subjects: (work.subjects ?? []).slice(0, 12),
    coverId: work.covers?.find((cover) => cover > 0) ?? null,
    firstPublished: work.first_publish_date ?? '',
    url: `${API}/works/${id}`,
  }
}
