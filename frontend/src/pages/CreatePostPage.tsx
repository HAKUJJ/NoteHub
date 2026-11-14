import { useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import FormField from '../components/ui/FormField'
import { useSubjects, useGrades } from '../hooks/useCatalog'
import { useSaveNote, useNote } from '../hooks/useNotes'
import { useValidatedForm } from '../hooks/useValidatedForm'
import { required } from '../lib/validators'
import type { Grade, NoteType, Subject, Note } from '../types'
import { useAuthStore, type AuthUser } from '../store/authStore'
import { useUiStore } from '../store/uiStore'
import { formatFileSize, validateFile, encodeFile } from '../lib/fileStore'
import { encodeCover, noteCoverUrl } from '../lib/noteCover'

const cls = (error?: string) => `w-full border bg-white ${error ? 'border-error' : 'border-gray-300'}`

export default function CreatePostPage() {
  const user = useAuthStore((s) => s.user)
  const { id } = useParams()
  const result = useNote(id ?? '')

  if (id && result.isPending) {
    return <div className="p-6" role="status">กำลังโหลด...</div>
  }
  if (id && (result.isError || !result.data)) {
    return <div className="p-6" role="alert">ไม่พบโน้ตหรือโหลดข้อมูลไม่สำเร็จ</div>
  }
  // ยังไม่ล็อกอิน → ไม่แสดงฟอร์ม ให้ล็อกอินก่อน
  if (!user) return <LoginRequired />
  if (id && result.data?.authorId !== user.id && user.role !== 'admin') {
    return <div className="p-6" role="alert">ไม่มีสิทธิ์แก้ไขโน้ตนี้</div>
  }
  return <CreatePostForm key={id ?? 'new'} user={user} note={id ? result.data : undefined} />
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

function CreatePostForm({ user, note }: { user: AuthUser; note?: Note }) {
  const focusCover = useLocation().hash === '#cover'
  const createNote = useSaveNote(note?.id)
  const subjects = useSubjects()
  const grades = useGrades()
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const coverRef = useRef<HTMLInputElement>(null)
  const [image, setImage] = useState<string | null | undefined>(undefined)
  const [coverError, setCoverError] = useState('')
  const [readingCover, setReadingCover] = useState(false)
  const cover = image === undefined ? note?.image : image

  const handleCoverChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0]
    if (!picked) return
    setReadingCover(true)
    setCoverError('')
    try {
      setImage(await encodeCover(picked))
    } catch (error) {
      setCoverError(error instanceof Error ? error.message : 'อ่านรูปปกไม่สำเร็จ')
    } finally {
      setReadingCover(false)
      if (coverRef.current) coverRef.current.value = ''
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null
    const error = picked ? validateFile(picked) : ''
    setFileError(error)
    setFile(error ? null : picked)
    if (error && fileRef.current) fileRef.current.value = ''
  }
  const { values, errors, handleChange, handleBlur, validateAll, reset } = useValidatedForm(
    {
      title: note?.title ?? '',
      subject: note?.subject ?? '',
      faculty: note?.category ?? '',
      year: note?.grade ?? '',
      type: note?.type ?? '',
      description: note?.description ?? '',
      content: note?.content ?? '',
    },
    {
      title: required('กรุณากรอกชื่อโน้ต'),
      subject: required('กรุณากรอกชื่อวิชา'),
      faculty: required('กรุณาเลือกหมวดวิชา'),
      year: required('กรุณาเลือกระดับชั้น'),
      type: required('กรุณาเลือกประเภท'),
    },
  )

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateAll() || fileError || coverError || readingCover) return
    setSubmitting(true)
    try {
      const attachment = file ? await encodeFile(file) : undefined
      createNote.mutate(
        {
          title: values.title.trim(),
          subject: values.subject.trim(),
          category: values.faculty as Subject,
          grade: values.year as Grade,
          type: values.type as NoteType,
          author: user.name, // ใช้ชื่อคนที่ล็อกอินอยู่

          description: values.description.trim() || undefined,
          content: values.content.trim(),
          attachment,
          image,
        },
        {
          onSuccess: () => {
            if (!note) {
              reset()
              setImage(undefined)
            }
            setFile(null)
            if (fileRef.current) fileRef.current.value = ''
          },
        },
      )
    } catch (error) {
      setFileError(error instanceof Error ? error.message : 'อ่านไฟล์ไม่สำเร็จ')
    } finally {
      setSubmitting(false)
    }
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
          <h1 className="text-3xl font-bold text-primary">
            {note ? 'แก้ไขโพสต์' : 'สร้างโพสต์ใหม่'}
          </h1>
          <p className="mt-1 opacity-70">
            แบ่งปันสรุปเนื้อหาหรือข้อสอบเก่าของคุณให้เพื่อน ๆ ได้ใช้ประโยชน์
          </p>
        </section>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
          <FormField label="รูปปกโพสต์" name="cover" error={coverError}>
            {cover && (
              <img
                src={noteCoverUrl(cover)}
                alt="ตัวอย่างรูปปก"
                className="mb-3 max-h-64 w-full rounded-box object-contain bg-base-200"
              />
            )}
            <input
              ref={coverRef}
              id="cover"
              name="cover"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              autoFocus={focusCover}
              onChange={handleCoverChange}
              disabled={readingCover || submitting || createNote.isPending}
              aria-invalid={!!coverError}
              aria-describedby="cover-help"
              className="file-input file-input-bordered w-full border border-gray-300 bg-white"
            />
            <p id="cover-help" className="mt-1 text-sm opacity-60">
              {readingCover
                ? 'กำลังเตรียมรูปปก...'
                : 'ไม่บังคับ · JPG, PNG, WebP ไม่เกิน 10 MB · ระบบย่อรูปก่อนบันทึก'}
            </p>
            {(cover || coverError) && (
              <button
                type="button"
                className="btn btn-ghost btn-sm mt-2"
                disabled={readingCover || submitting || createNote.isPending}
                onClick={() => {
                  setImage(null)
                  setCoverError('')
                }}
              >
                ลบรูปปก
              </button>
            )}
          </FormField>
          <FormField label="ชื่อโน้ต" name="title" error={errors.title}>
            <input
              {...common('title')}
              placeholder="เช่น สรุปคณิตศาสตร์ ม.4"
              className={`input input-bordered ${cls(errors.title)}`}
            />
          </FormField>
          <FormField label="รายวิชา" name="subject" error={errors.subject}>
            <input
              {...common('subject')}
              placeholder="เช่น คณิตศาสตร์เพิ่มเติม"
              className={`input input-bordered ${cls(errors.subject)}`}
            />
          </FormField>

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="หมวดวิชา" name="faculty" error={errors.faculty}>
              <select
                {...common('faculty')}
                className={`select select-bordered ${cls(errors.faculty)}`}
              >
                <option value="">-- เลือกหมวดวิชา --</option>
                {(subjects.data ?? []).map(({ code: value, name: label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </FormField>
            <FormField label="ระดับชั้น" name="year" error={errors.year}>
              <select
                {...common('year')}
                className={`select select-bordered ${cls(errors.year)}`}
              >
                <option value="">-- เลือกระดับชั้น --</option>
                {(grades.data ?? []).map(({ code: year, name: label }) => (
                  <option key={year} value={year}>
                    {label}
                  </option>
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
            <input
              id="author"
              name="author"
              value={user.name}
              readOnly
              className={`input input-bordered ${cls()} bg-gray-100`}
            />
          </FormField>
          <FormField label="รายละเอียดเพิ่มเติม" name="description">
            <textarea
              {...common('description')}
              rows={4}
              placeholder="อธิบายเนื้อหาโดยสังเขป (ไม่บังคับ)"
              className={`textarea textarea-bordered ${cls(errors.description)}`}
            />
          </FormField>
          <FormField label="เนื้อหา" name="content">
            <textarea
              {...common('content')}
              rows={8}
              className="textarea textarea-bordered w-full border border-gray-300 bg-white"
            />
          </FormField>
          {note?.attachment && (
            <p className="text-sm">
              ไฟล์ปัจจุบัน: {note.attachment.name} (เลือกไฟล์ใหม่เพื่อแทนที่)
            </p>
          )}
          {(subjects.isError || grades.isError) && (
            <p role="alert" className="text-error">
              โหลดวิชาหรือระดับชั้นไม่สำเร็จ
            </p>
          )}
          <FormField label="แนบไฟล์เอกสาร" name="file">
            <input
              ref={fileRef}
              id="file"
              name="file"
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              aria-invalid={!!fileError}
              className={`file-input file-input-bordered w-full border bg-white ${fileError ? 'border-error' : 'border-gray-300'}`}
            />
            {fileError ? (
              <p className="mt-1 text-sm text-error" role="alert">
                {fileError}
              </p>
            ) : (
              <p className="mt-1 text-sm opacity-60">
                {file
                  ? `${file.name} (${formatFileSize(file.size)})`
                  : 'ไม่บังคับ · .pdf .doc .docx .png .jpg · ไม่เกิน 3 MB'}
              </p>
            )}
          </FormField>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={
              createNote.isPending || submitting || readingCover || !subjects.data || !grades.data
            }
          >
            {createNote.isPending || submitting
              ? 'กำลังบันทึก...'
              : note
                ? 'บันทึกการแก้ไข'
                : 'เผยแพร่โพสต์'}
          </button>

          {createNote.isSuccess && (
            <div className="alert alert-success" role="status">
              <span>{note ? 'แก้ไขโพสต์สำเร็จ' : 'เผยแพร่โพสต์สำเร็จ'}</span>
              <Link to={`/post/${createNote.data.id}`} className="link">
                ดูโพสต์
              </Link>
            </div>
          )}
          {createNote.isError && (
            <div className="alert alert-error" role="alert">
              {createNote.error.message}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
