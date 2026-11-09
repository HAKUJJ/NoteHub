import { subjectLabels } from '../../data/labels'
import { useFilterStore, type GradeFilter, type SubjectFilter } from '../../store/filterStore'

const subjectOptions: { value: SubjectFilter; label: string }[] = [
  { value: 'all', label: 'ทั้งหมด' },
  ...(Object.entries(subjectLabels) as [SubjectFilter, string][]).map(([value, label]) => ({ value, label })),
]

const gradeOptions: { value: GradeFilter; label: string }[] = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'junior', label: 'มัธยมต้น (ม.1 - ม.3)' },
  { value: 'senior', label: 'มัธยมปลาย (ม.4 - ม.6)' },
  { value: 'm1', label: 'ม.1' },
  { value: 'm2', label: 'ม.2' },
  { value: 'm3', label: 'ม.3' },
  { value: 'm4', label: 'ม.4' },
  { value: 'm5', label: 'ม.5' },
  { value: 'm6', label: 'ม.6' },
]

interface GroupProps<T extends string> {
  title: string
  options: { value: T; label: string }[]
  selected: T
  onSelect: (value: T) => void
}

function FilterGroup<T extends string>({ title, options, selected, onSelect }: GroupProps<T>) {
  return (
    <div className="mb-4">
      <h3 className="mb-1 font-semibold">{title}</h3>
      <ul className="menu w-full p-0">
        {options.map((o) => (
          <li key={o.value}>
            <button type="button" className={selected === o.value ? 'menu-active' : ''} onClick={() => onSelect(o.value)}>
              {o.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function FilterSidebar() {
  const { subject, grade, setSubject, setGrade } = useFilterStore()

  return (
    <>
      <h2 className="mb-3 text-lg font-bold">หมวดหมู่</h2>
      <FilterGroup title="หมวดวิชา" options={subjectOptions} selected={subject} onSelect={setSubject} />
      <FilterGroup title="ระดับชั้น" options={gradeOptions} selected={grade} onSelect={setGrade} />
    </>
  )
}
