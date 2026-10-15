import { Link } from 'react-router'
import CoverCard from './CoverCard'
import { gradeLabels, subjectLabels, typeLabels } from '../../data/labels'
import type { Note } from '../../types'
import FavoriteButton from './FavoriteButton'

export default function NoteCard({ note, colorIndex }: { note: Note; colorIndex: number }) {
  return (
    <CoverCard
      coverText={note.subject.charAt(0)}
      colorIndex={colorIndex}
      title={note.title}
      subtitle={`โพสต์โดย: ${note.author}`}
      tags={[subjectLabels[note.category], gradeLabels[note.grade], typeLabels[note.type]]}
      action={
        <>
          <FavoriteButton
            kind="note"
            id={String(note.id)}
            title={note.title}
            subtitle={`โพสต์โดย: ${note.author}`}
            note={note}
          />
          <Link to={`/post/${note.id}`} className="btn btn-primary btn-sm rounded-box border-none shadow hover:text-black hover:bg-accent">
            ดูรายละเอียด
          </Link>
        </>
      }
    />
  )
}
