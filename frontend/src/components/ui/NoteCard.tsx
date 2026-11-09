import { Link } from 'react-router'
import CoverCard from './CoverCard'
import { gradeLabels, subjectLabels, typeLabels } from '../../data/labels'
import type { Note } from '../../types'
import FavoriteButton from './FavoriteButton'
import { noteCoverUrl } from '../../lib/noteCover'

export default function NoteCard({ note, colorIndex }: { note: Note; colorIndex: number }) {
  return (
    <CoverCard
      coverText={note.author.charAt(0).toUpperCase()}
      avatar={note.authorAvatar}
      image={note.image ? noteCoverUrl(note.image) : undefined}
      colorIndex={colorIndex}
      title={note.title}
      subtitle={`โพสต์โดย: ${note.author}`}
      tags={[subjectLabels[note.category], gradeLabels[note.grade], typeLabels[note.type]]}
      cornerAction={
          <FavoriteButton
            kind="note"
            id={String(note.id)}
            title={note.title}
            subtitle={`โพสต์โดย: ${note.author}`}
            note={note}
            className="absolute right-2 top-2 bg-white shadow"
          />
      }
      action={
          <Link to={`/post/${note.id}`} className="btn btn-primary btn-sm rounded-box border-none shadow hover:text-black hover:bg-accent">
            ดูรายละเอียด
          </Link>
      }
    />
  )
}
