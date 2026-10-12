import { Link } from 'react-router'
import { gradeLabels, subjectLabels, typeLabels } from '../data/labels'
import { useFavoriteStore } from '../store/useFavoriteStore'
import CoverCard from '../components/ui/CoverCard'
import FavoriteButton from '../components/ui/FavoriteButton'
import { getBookCoverUrl } from '../api/openLibrary'

export default function FavoritesPage() {
  const items = useFavoriteStore((state) => state.items)

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-6">
      <header>
        <p className="text-sm font-semibold uppercase tracking-widest text-secondary">Your collection</p>
        <h1 className="mt-1 text-3xl font-extrabold text-primary">รายการโปรด</h1>
        <p className="mt-2 text-gray-600">โน้ตและหนังสือที่บันทึกไว้ ({items.length})</p>
      </header>

      {items.length === 0 ? (
        <section className="rounded-box bg-white p-12 text-center shadow-sm">
          <div className="mb-3 text-4xl text-secondary" aria-hidden>♡</div>
          <h2 className="text-xl font-bold">ยังไม่มีรายการโปรด</h2>
          <p className="mt-2 text-gray-500">กดสัญลักษณ์หัวใจบนการ์ดโน้ตหรือหนังสือเพื่อบันทึกไว้ที่นี่</p>
          <div className="mt-5 flex justify-center gap-2">
            <Link to="/" className="btn btn-primary">ดูโน้ต</Link>
            <Link to="/books" className="btn btn-outline">ค้นหาหนังสือ</Link>
          </div>
        </section>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item, index) => item.kind === 'note' && item.note ? (
            <div key={`${item.kind}-${item.id}`} className="relative">
              <CoverCard
                coverText={item.note.subject.charAt(0)}
                colorIndex={index}
                title={item.note.title}
                subtitle={`โพสต์โดย: ${item.note.author}`}
                tags={[
                  subjectLabels[item.note.category],
                  gradeLabels[item.note.grade],
                  typeLabels[item.note.type],
                ]}
                action={<Link to={`/post/${item.id}`} className="btn btn-primary btn-sm">ดูรายละเอียด</Link>}
              />
              <FavoriteButton
                kind="note"
                id={item.id}
                title={item.title}
                subtitle={item.subtitle}
                note={item.note}
                className="absolute right-3 top-3"
              />
            </div>
          ) : item.kind === 'book' ? (
            <article key={`${item.kind}-${item.id}`} className="card border-t-4 border-primary bg-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="relative flex h-56 items-center justify-center bg-base-200/50 p-3">
                {item.coverId ? (
                  <img src={getBookCoverUrl(item.coverId, 'M')} alt={`ปกหนังสือ ${item.title}`} className="h-full max-w-full object-contain shadow" />
                ) : <span className="text-sm text-gray-500">ไม่มีภาพปก</span>}
                <FavoriteButton kind="book" id={item.id} title={item.title} subtitle={item.subtitle} coverId={item.coverId} className="absolute right-2 top-2 bg-white shadow" />
              </div>
              <div className="card-body gap-2 p-4">
                <span className="badge badge-outline w-fit">หนังสือ</span>
                <h2 className="card-title line-clamp-2 text-base">{item.title}</h2>
                <p className="line-clamp-1 text-sm text-gray-600">{item.subtitle || 'ไม่ระบุผู้เขียน'}</p>
                <div className="card-actions mt-2 justify-end">
                  <Link to={`/books/${item.id}`} className="btn btn-primary btn-sm">รายละเอียด</Link>
                </div>
              </div>
            </article>
          ) : (
            <div key={`${item.kind}-${item.id}`} className="relative">
              <CoverCard
                coverText={item.title.charAt(0)}
                colorIndex={index}
                title={item.title}
                subtitle={item.subtitle}
                tags={[]}
                action={<Link to={`/post/${item.id}`} className="btn btn-primary btn-sm">ดูรายละเอียด</Link>}
              />
              <FavoriteButton kind="note" id={item.id} title={item.title} subtitle={item.subtitle} className="absolute right-3 top-3" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
