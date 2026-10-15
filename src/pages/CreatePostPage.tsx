import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link } from 'react-router'
import FormField from '../components/ui/FormField'
import { subjectLabels } from '../data/labels'
import { useCreateNote } from '../hooks/useNotes'
import { useValidatedForm } from '../hooks/useValidatedForm'
import { required } from '../lib/validators'
import type { Grade, NoteType, Subject } from '../types'
import { useAuthStore, type AuthUser } from '../store/authStore'
import { useUiStore } from '../store/uiStore'
import { formatFileSize, saveFile, validateFile } from '../lib/fileStore'

const cls = (error?: string) => `w-full border bg-white ${error ? 'border-error' : 'border-gray-300'}`
const years: Grade[] = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6']

export default function CreatePostPage() {
  const user = useAuthStore((s) => s.user)
  // ยังไม่ล็อกอิน → ไม่แสดงฟอร์ม ให้ล็อกอินก่อน
  if (!user) return <LoginRequired />
  return <CreatePostForm user={user} />
}

function LoginRequired() {
  const openAuthModal = useUiStore((s) => s.openAuthModal)
  return (
    <div className="p-4 md:p-6">
      <div className="card mx-auto max-w-xl items-center gap-4 bg-white p-10 text-center shadow-xl">
        <h1 className="text-2xl font-bold text-primary">กรุณาเข้าสู่ระบบก่อนโพสต์</h1>
        <p className="opacity-70">ต้องเป็นสมาชิกถึงจะแบ่งปันสรุปเนื้อหาหรือข้อสอบเก่าได้</p>
        <div className="flex gap-2">
          <button className="btn btn-primary rounded-box border-none shadow hover:text-black hover:bg-accent" onClick={() => openAuthModal('login')}>เข้าสู่ระบบ</button>
          <button className="btn btn-outline rounded-box border-none shadow hover:text-black hover:bg-accent" onClick={() => openAuthModal('register')}>สมัครสมาชิก</button>
        </div>
      </div>
    </div>
  )
}

function CreatePostForm({ user }: { user: AuthUser }) {
  const createNote = useCreateNote()
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [fileSaveFailed, setFileSaveFailed] = useState(false)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null
    const error = picked ? validateFile(picked) : ''
    setFileError(error)
    setFile(error ? null : picked)
    if (error && fileRef.current) fileRef.current.value = ''
  }
  const { values, errors, handleChange, handleBlur, validateAll, reset } = useValidatedForm(
    { title: '', subject: '', faculty: '', year: '', type: '', description: '' },
    {
      title: required('กรุณากรอกชื่อโน้ต'),
      subject: required('กรุณากรอกชื่อวิชา'),
      faculty: required('กรุณาเลือกหมวดวิชา'),
      year: required('กรุณาเลือกระดับชั้น'),
      type: required('กรุณาเลือกประเภท'),
    },
  )

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validateAll() || fileError) return
    setFileSaveFailed(false)
    createNote.mutate(
      {
        title: values.title.trim(),
        subject: values.subject.trim(),
        category: values.faculty as Subject,
        grade: values.year as Grade,
        type: values.type as NoteType,
        author: user.name, // ใช้ชื่อคนที่ล็อกอินอยู่
        authorEmail: user.email,
        description: values.description.trim() || undefined,
        attachment: file ? { name: file.name, size: file.size, type: file.type } : undefined,
      },
      {
        onSuccess: async (note) => {
          // บันทึกตัวไฟล์ลง IndexedDB โดยใช้ id ของโพสต์เป็นกุญแจ
          if (file) await saveFile(note.id, file).catch(() => setFileSaveFailed(true))
          reset()
          setFile(null)
          if (fileRef.current) fileRef.current.value = ''
        },
      },
    )
  }

  const common = (name: keyof typeof values) => ({
    id: name,
    name,
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
    'aria-invalid': !!errors[name],
  })

  return (
    <div className="p-4 md:p-6">
    <div className="card mx-auto max-w-3xl bg-white p-8 shadow-xl">
      <section className="mb-6">
        <h1 className="text-3xl font-bold text-primary">สร้างโพสต์ใหม่</h1>
        <p className="mt-1 opacity-70">แบ่งปันสรุปเนื้อหาหรือข้อสอบเก่าของคุณให้เพื่อน ๆ ได้ใช้ประโยชน์</p>
      </section>

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <FormField label="ชื่อโน้ต" name="title" error={errors.title}>
          <input {...common('title')} placeholder="เช่น สรุปคณิตศาสตร์ ม.4" className={`input input-bordered ${cls(errors.title)}`} />
        </FormField>
        <FormField label="รายวิชา" name="subject" error={errors.subject}>
          <input {...common('subject')} placeholder="เช่น คณิตศาสตร์เพิ่มเติม" className={`input input-bordered ${cls(errors.subject)}`} />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="หมวดวิชา" name="faculty" error={errors.faculty}>
            <select {...common('faculty')} className={`select select-bordered ${cls(errors.faculty)}`}>
              <option value="">-- เลือกหมวดวิชา --</option>
              {(Object.entries(subjectLabels) as [Subject, string][]).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </FormField>
          <FormField label="ระดับชั้น" name="year" error={errors.year}>
            <select {...common('year')} className={`select select-bordered ${cls(errors.year)}`}>
              <option value="">-- เลือกระดับชั้น --</option>
              {years.map((y) => (
                <option key={y} value={y}>ม.{y.slice(1)}</option>
              ))}
            </select>
          </FormField>
          <FormField label="ประเภท" name="type" error={errors.type}>
            <select {...common('type')} className={`select select-bordered ${cls(errors.type)}`}>
              <option value="">-- เลือกประเภท --</option>
              <option value="note">สรุปเนื้อหา</option>
              <option value="exam">ข้อสอบเก่า</option>
            </select>
          </FormField>
        </div>

        <FormField label="โพสต์โดย" name="author">
          <input id="author" name="author" value={user.name} readOnly className={`input input-bordered ${cls()} bg-gray-100`} />
        </FormField>
        <FormField label="รายละเอียดเพิ่มเติม" name="description">
          <textarea {...common('description')} rows={4} placeholder="อธิบายเนื้อหาโดยสังเขป (ไม่บังคับ)" className={`textarea textarea-bordered  ${cls(errors.description)}`} />
        </FormField>
        <FormField label="แนบไฟล์เอกสาร" name="file">
          <input ref={fileRef} id="file" name="file" type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={handleFileChange}
            aria-invalid={!!fileError} className={`file-input file-input-bordered w-full border bg-white ${fileError ? 'border-error' : 'border-gray-300'}`} />
          {fileError
            ? <p className="mt-1 text-sm text-error" role="alert">{fileError}</p>
            : <p className="mt-1 text-sm opacity-60">{file ? `${file.name} (${formatFileSize(file.size)})` : 'ไม่บังคับ · .pdf .doc .docx .png .jpg · ไม่เกิน 5 MB'}</p>}
        </FormField>

        <button type="submit" className="btn btn-primary btn-block" disabled={createNote.isPending}>
          {createNote.isPending ? 'กำลังเผยแพร่...' : 'เผยแพร่โพสต์'}
        </button>

        {createNote.isSuccess && (
          <div className="alert alert-success" role="status">
            <span>เผยแพร่โพสต์สำเร็จ (บันทึกไว้ในเบราว์เซอร์นี้)</span>
            <Link to={`/post/${createNote.data.id}`} className="link">ดูโพสต์</Link>
          </div>
        )}
        {fileSaveFailed && <div className="alert alert-warning" role="alert">โพสต์สำเร็จ แต่บันทึกไฟล์แนบไม่สำเร็จ (พื้นที่ในเบราว์เซอร์อาจเต็ม)</div>}
        {createNote.isError && <div className="alert alert-error" role="alert">เผยแพร่โพสต์ไม่สำเร็จ</div>}
      </form>
    </div>
    </div>
  )
}
