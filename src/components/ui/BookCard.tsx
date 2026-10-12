import { Link } from 'react-router'
import { getBookCoverUrl, type BookSearchResult } from '../../api/openLibrary'
import FavoriteButton from './FavoriteButton'

export default function BookCard({ book }: { book: BookSearchResult }) {
  const author = book.authors.slice(0, 2).join(', ') || 'ไม่ระบุผู้เขียน'

  return (
    <article className="card border-t-4 border-primary bg-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="relative flex h-56 items-center justify-center bg-base-200/50 p-3">
        {book.coverId ? (
          <img
            src={getBookCoverUrl(book.coverId, 'M')}
            alt={`ปกหนังสือ ${book.title}`}
            loading="lazy"
            className="h-full max-w-full object-contain shadow"
          />
        ) : (
          <span className="text-sm text-gray-500">ไม่มีภาพปก</span>
        )}
        <FavoriteButton
          kind="book"
          id={book.id}
          title={book.title}
          subtitle={author}
          coverId={book.coverId}
          className="absolute right-2 top-2 bg-white shadow"
        />
      </div>
      <div className="card-body gap-2 p-4">
        <h2 className="card-title line-clamp-2 text-base">{book.title}</h2>
        <p className="line-clamp-1 text-sm text-gray-600">{author}</p>
        {book.firstPublished && <p className="text-xs text-gray-500">พิมพ์ครั้งแรก {book.firstPublished}</p>}
        <div className="card-actions mt-2 justify-end">
          <Link to={`/books/${book.id}`} className="btn btn-primary btn-sm">รายละเอียด</Link>
        </div>
      </div>
    </article>
  )
}
