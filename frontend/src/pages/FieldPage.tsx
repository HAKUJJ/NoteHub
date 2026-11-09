import { Link, useParams } from 'react-router'
import { fieldProfiles } from '../data/fields'
import { subjectLabels } from '../data/labels'
import { useFilterStore } from '../store/filterStore'

export default function FieldPage() {
  const { id } = useParams()
  const field = fieldProfiles.find((profile) => profile.id === id)
  const { resetFilters, setSubject } = useFilterStore()

  if (!field) {
    return (
      <section className="mx-auto max-w-2xl p-8 text-center">
        <h1 className="text-2xl font-bold">ไม่พบข้อมูลสาขาวิชา</h1>
        <Link to="/matcher" className="btn btn-primary mt-4">กลับไปทำ Matcher</Link>
      </section>
    )
  }

  return (
    <article className="mx-auto max-w-6xl space-y-8 p-4 md:p-8">
      <Link to="/matcher" className="link link-primary">← กลับไปผลการจับคู่</Link>

      <header className="rounded-box bg-linear-to-br from-primary to-primary/75 p-8 text-primary-content shadow-md md:p-12">
        <p className="text-sm font-semibold uppercase tracking-widest opacity-80">Field profile</p>
        <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">{field.name}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed">{field.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {field.subjects.map((subject) => <span key={subject} className="badge badge-lg border-white/40 bg-white/10 text-white">{subject}</span>)}
        </div>
      </header>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-primary">ตัวอย่างรายวิชา</h2>
            <p className="mt-1 text-gray-600">หัวข้อที่อาจได้เรียนในสาขานี้</p>
          </div>
          <Link to={`/books?subject=${encodeURIComponent(field.bookSubject)}`} className="btn btn-outline btn-sm">
            ค้นหาหนังสือที่เกี่ยวข้อง
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {field.courses.map((course, index) => (
            <article key={course.name} className="card border-t-4 border-primary bg-white shadow-sm">
              <div className="card-body">
                <span className="badge badge-outline w-fit">วิชา {index + 1}</span>
                <h3 className="card-title text-lg">{course.name}</h3>
                <p className="text-gray-600">{course.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-box bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-primary">แนวทางเตรียมตัว</h2>
          <p className="mt-1 text-sm text-gray-600">หมวดวิชาที่ควรทบทวน กดเพื่อดูโน้ตในคลัง NotesHub</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {field.prepare.map((subject) => (
              <Link
                key={subject}
                to="/"
                // ไปหน้าแรกพร้อมกรองโน้ตวิชานี้ให้เลย
                onClick={() => { resetFilters(); setSubject(subject) }}
                className="badge badge-primary badge-lg hover:opacity-80"
              >
                {subjectLabels[subject]} →
              </Link>
            ))}
          </div>
        </section>
        <section className="rounded-box bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-primary">เส้นทางอาชีพ</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {field.careers.map((career) => <span key={career} className="badge badge-outline badge-lg">{career}</span>)}
          </div>
        </section>
      </div>
    </article>
  )
}
