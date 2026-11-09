import SearchBar from '../components/ui/SearchBar'
import NoteResults from '../components/ui/NoteResults'

export default function CoursesPage() {
  return (
    <div className="flex flex-col gap-4">
      <SearchBar />
      <NoteResults title="วิชาทั้งหมด" />
    </div>
  )
}
