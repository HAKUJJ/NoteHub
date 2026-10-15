import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import FormField from '../components/ui/FormField'
import { useApproveSheet, useDeleteSheet, useSheets, useUpdateSheet } from '../hooks/useSheets'
import { useDeleteNote, useNotes } from '../hooks/useNotes'
import { isUserNote } from '../api/notes'
import { gradeLabels, subjectLabels, typeLabels } from '../data/labels'
import { useAuthStore } from '../store/authStore'
import { useFavoriteStore } from '../store/useFavoriteStore'
import type { Note, Sheet } from '../types'

type Tab = 'dashboard' | 'posts' | 'sheets' | 'users' | 'reports'

const tabs: { id: Tab; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'posts', label: 'จัดการโพสต์' },
  { id: 'sheets', label: 'จัดการชีทสรุป' },
  { id: 'users', label: 'จัดการผู้ใช้งาน' },
  { id: 'reports', label: 'รายงานปัญหา' },
]

// Placeholder counts until users/reports have a real source.
const TOTAL_USERS = 128
const TOTAL_REPORTS = 5

export default function AdminPage() {
  const isAdmin = useAuthStore((s) => s.isAdmin && s.user?.role === 'admin')
  if (!isAdmin) return <Navigate to="/" replace />
  return <AdminDashboard />
}

function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  return (
    <div className="mx-auto min-h-screen max-w-6xl p-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src="/images/logo.svg" alt="โลโก้ NotesHub" width={40} height={40} />
          <div>
            <p className="text-xs tracking-widest opacity-60">ADMIN PANEL</p>
            <h1 className="text-2xl font-bold">NotesHub</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary font-semibold text-primary-content">A</span>
          <span className="font-bold mr-1">Administrator</span>
          <Link to="/" className="btn btn-ghost btn-sm rounded-2xl border-none shadow hover:text-black hover:bg-accent">← กลับหน้าเว็บไซต์</Link>
          <button className="btn btn-outline btn-sm border-none rounded-2xl shadow hover:text-black hover:bg-accent" onClick={() => { logout(); navigate('/') }}>ออกจากระบบ</button>
        </div>
      </header>

      <div role="tablist" className="tabs tabs-border tabs-lg mb-8 flex-nowrap overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            className={`tab whitespace-nowrap px-6 ${tab === t.id ? 'tab-active font-bold text-primary' : 'opacity-70 hover:opacity-100'}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="alert alert-warning mb-6" role="note">
        <span><strong>โหมดสาธิต (Demo):</strong> ชีทสรุป ผู้ใช้งาน และรายงานปัญหาเป็นข้อมูลตัวอย่าง (รีเฟรชแล้วกลับเป็นค่าเดิม) ส่วนแท็บจัดการโพสต์ใช้โพสต์จริงที่เก็บในเบราว์เซอร์นี้</span>
      </div>

      {tab === 'dashboard' && <DashboardPanel />}
      {tab === 'posts' && <PostsPanel />}
      {tab === 'sheets' && <SheetsPanel />}
      {tab === 'users' && <EmptyPanel title="จัดการผู้ใช้งาน" text="ยังไม่มีข้อมูลผู้ใช้งาน" />}
      {tab === 'reports' && <EmptyPanel title="รายงานปัญหา" text="ยังไม่มีรายงานปัญหา" />}
    </div>
  )
}

function DashboardPanel() {
  const { data: sheets = [] } = useSheets()
  const pending = sheets.filter((s) => s.status === 'pending').length
  const { data: notes = [] } = useNotes()
  const userPosts = notes.filter((n) => isUserNote(n.id)).length
  const stats = [
    { title: 'โพสต์ทั้งหมด', value: notes.length, desc: `ผู้ใช้สร้าง ${userPosts} โพสต์` },
    { title: 'ชีททั้งหมด', value: sheets.length, desc: 'ชีทในระบบ' },
    { title: 'รออนุมัติ', value: pending, desc: 'รอการตรวจสอบ' },
    { title: 'ผู้ใช้งาน', value: TOTAL_USERS, desc: 'สมาชิกทั้งหมด (ตัวอย่าง)' },
    { title: 'รายงานปัญหา', value: TOTAL_REPORTS, desc: 'รายการที่ต้องตรวจสอบ (ตัวอย่าง)' },
  ]

  return (
    <section>
      <h2 className="text-xl font-bold">ภาพรวมระบบ</h2>
      <p className="mb-6 opacity-70">จัดการข้อมูลต่าง ๆ ของ NotesHub</p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.title} className="flex flex-col items-center justify-center rounded-box bg-white p-6 text-center shadow-md shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg">
            <div className="mb-2 text-5xl font-extrabold text-primary">{s.value}</div>
            <div className="font-semibold">{s.title}</div>
            <div className="text-sm text-gray-500">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function SheetsPanel() {
  const { data: sheets = [], isLoading } = useSheets()
  const approve = useApproveSheet()
  const remove = useDeleteSheet()
  const [editing, setEditing] = useState<Sheet | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [notice, setNotice] = useState('')

  const handleApprove = (sheet: Sheet) =>
    approve.mutate(sheet.id, { onSuccess: () => setNotice(`อนุมัติชีท "${sheet.title}" เรียบร้อยแล้ว`) })

  const confirmDelete = () => {
    if (deleteId === null) return
    remove.mutate(deleteId, {
      onSuccess: () => {
        if (editing?.id === deleteId) setEditing(null)
        setDeleteId(null)
        setNotice('ลบข้อมูลเรียบร้อยแล้ว')
      },
    })
  }

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">ชีทสรุปที่รอการอนุมัติ</h2>
        <p className="opacity-70">ตรวจสอบและจัดการชีทที่ผู้ใช้งานส่งเข้ามา</p>
      </div>

      {notice && (
        <div className="alert alert-success" role="status">
          <span>{notice}</span>
          <button className="btn btn-ghost btn-xs" onClick={() => setNotice('')}>ปิด</button>
        </div>
      )}

      <div className="overflow-x-auto rounded-box bg-white p-4 shadow-md">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-primary/10 text-primary">
              <th>ชื่อวิชา / ชีท</th>
              <th>ผู้จัดทำ</th>
              <th>ระดับชั้น</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={5} className="text-center"><span className="loading loading-spinner" /></td></tr>}
            {!isLoading && sheets.length === 0 && <tr><td colSpan={5} className="text-center">ไม่มีข้อมูลชีท</td></tr>}
            {sheets.map((s) => (
              <tr key={s.id}>
                <td>{s.title}</td>
                <td>{s.author}</td>
                <td>{s.grade}</td>
                <td>
                  <span className={`badge ${s.status === 'pending' ? 'badge-warning' : 'badge-success'}`}>
                    {s.status === 'pending' ? 'รออนุมัติ' : 'อนุมัติแล้ว'}
                  </span>
                </td>
                <td>
                  <div className="flex gap-1">
                    {s.status === 'pending' && (
                      <button className="btn btn-success btn-xs rounded-2xl border-none shadow hover:text-black hover:bg-accent" disabled={approve.isPending} onClick={() => handleApprove(s)}>อนุมัติ</button>
                    )}
                    <button className="btn btn-info btn-xs rounded-2xl border-none shadow hover:text-black hover:bg-accent" onClick={() => setEditing(s)}>แก้ไข</button>
                    <button className="btn btn-error btn-xs rounded-2xl border-none shadow hover:text-black hover:bg-accent" onClick={() => setDeleteId(s.id)}>ลบ</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditSheetForm
          key={editing.id}
          sheet={editing}
          onDone={(message) => {
            setEditing(null)
            if (message) setNotice(message)
          }}
        />
      )}

      {deleteId !== null && (
        <dialog className="modal modal-open">
          <div className="modal-box bg-white">
            <h3 className="text-lg font-bold">ยืนยันการลบ</h3>
            <p className="py-4">คุณต้องการลบชีทนี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
            <div className="modal-action">
              <button className="btn btn-error rounded-2xl border-none shadow hover:text-black hover:bg-accent" disabled={remove.isPending} onClick={confirmDelete}>ลบข้อมูล</button>
              <button className="btn bg-white rounded-2xl border-none shadow hover:text-black hover:bg-accent" onClick={() => setDeleteId(null)}>ยกเลิก</button>
            </div>
          </div>
        </dialog>
      )}
    </section>
  )
}

function PostsPanel() {
  const { data: notes = [], isLoading } = useNotes()
  const deleteNote = useDeleteNote()
  const removeEverywhere = useFavoriteStore((s) => s.removeEverywhere)
  const [deleting, setDeleting] = useState<Note | null>(null)
  const [notice, setNotice] = useState('')
  const [showOnlyUser, setShowOnlyUser] = useState(false)

  const rows = showOnlyUser ? notes.filter((n) => isUserNote(n.id)) : notes

  const confirmDelete = () => {
    if (!deleting) return
    const target = deleting
    deleteNote.mutate(target.id, {
      onSuccess: () => {
        removeEverywhere('note', String(target.id))
        setDeleting(null)
        setNotice(`ลบโพสต์ "${target.title}" เรียบร้อยแล้ว`)
      },
    })
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">โพสต์ทั้งหมดในระบบ</h2>
          <p className="opacity-70">โพสต์ที่แสดงในหน้าแรก ลบได้เฉพาะโพสต์ที่ผู้ใช้สร้าง (โน้ตตัวอย่างลบไม่ได้)</p>
        </div>
        <label className="label cursor-pointer gap-2">
          <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" checked={showOnlyUser}
            onChange={(e) => setShowOnlyUser(e.target.checked)} />
          <span className="text-sm">แสดงเฉพาะโพสต์ที่ผู้ใช้สร้าง</span>
        </label>
      </div>

      {notice && (
        <div className="alert alert-success" role="status">
          <span>{notice}</span>
          <button className="btn btn-ghost btn-xs" onClick={() => setNotice('')}>ปิด</button>
        </div>
      )}

      <div className="overflow-x-auto rounded-box bg-white p-4 shadow-md">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-primary/10 text-primary">
              <th>ชื่อโพสต์</th>
              <th>หมวด / ระดับชั้น</th>
              <th>ประเภท</th>
              <th>ผู้โพสต์</th>
              <th>ที่มา</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={6} className="text-center"><span className="loading loading-spinner" /></td></tr>}
            {!isLoading && rows.length === 0 && (
              <tr><td colSpan={6} className="text-center opacity-70">{showOnlyUser ? 'ยังไม่มีโพสต์ที่ผู้ใช้สร้าง' : 'ไม่มีโพสต์'}</td></tr>
            )}
            {rows.map((n) => {
              const userMade = isUserNote(n.id)
              return (
                <tr key={n.id}>
                  <td className="font-medium">{n.title}</td>
                  <td className="whitespace-nowrap">{subjectLabels[n.category]} · {gradeLabels[n.grade]}</td>
                  <td>{typeLabels[n.type]}</td>
                  <td>{n.author}</td>
                  <td>
                    <span className={`badge whitespace-nowrap ${userMade ? 'badge-info' : 'badge-ghost'}`}>
                      {userMade ? 'ผู้ใช้สร้าง' : 'ตัวอย่าง'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <Link to={`/post/${n.id}`} className="btn btn-outline btn-xs">ดู</Link>
                      <button className="btn btn-error btn-xs" disabled={!userMade}
                        title={userMade ? 'ลบโพสต์นี้' : 'โน้ตตัวอย่างลบไม่ได้'} onClick={() => setDeleting(n)}>
                        ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {deleting && (
        <dialog className="modal modal-open">
          <div className="modal-box bg-white">
            <h3 className="text-lg font-bold">ยืนยันการลบโพสต์</h3>
            <p className="py-4">ลบโพสต์ "{deleting.title}" ของ {deleting.author} ใช่หรือไม่? ลบแล้วกู้คืนไม่ได้</p>
            {deleteNote.isError && <p className="text-sm text-error">ลบไม่สำเร็จ ลองอีกครั้ง</p>}
            <div className="modal-action">
              <button className="btn btn-error" disabled={deleteNote.isPending} onClick={confirmDelete}>
                {deleteNote.isPending ? 'กำลังลบ...' : 'ลบโพสต์'}
              </button>
              <button className="btn" onClick={() => setDeleting(null)}>ยกเลิก</button>
            </div>
          </div>
        </dialog>
      )}
    </section>
  )
}

function EditSheetForm({ sheet, onDone }: { sheet: Sheet; onDone: (message?: string) => void }) {
  const update = useUpdateSheet()
  const [draft, setDraft] = useState({ title: sheet.title, author: sheet.author, grade: sheet.grade })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    update.mutate({ id: sheet.id, patch: draft }, { onSuccess: () => onDone('แก้ไขข้อมูลเรียบร้อยแล้ว') })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-box bg-white p-6 shadow-md">
      <div>
        <h2 className="text-xl font-bold">แก้ไขข้อมูลชีท</h2>
        <p className="opacity-70">แก้ไขรายละเอียดก่อนเผยแพร่ในระบบ</p>
      </div>
      <FormField label="ชื่อชีท" name="editTitle">
        <input id="editTitle" required className="input input-bordered w-full border border-gray-300 bg-white" value={draft.title}
          onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
      </FormField>
      <FormField label="ผู้จัดทำ" name="editAuthor">
        <input id="editAuthor" required className="input input-bordered w-full border border-gray-300 bg-white" value={draft.author}
          onChange={(e) => setDraft({ ...draft, author: e.target.value })} />
      </FormField>
      <FormField label="ระดับชั้น" name="editGrade">
        <select id="editGrade" required className="select select-bordered w-full border border-gray-300 bg-white" value={draft.grade}
          onChange={(e) => setDraft({ ...draft, grade: e.target.value })}>
          <option value="">เลือกระดับชั้น</option>
          {['ม.1', 'ม.2', 'ม.3', 'ม.4', 'ม.5', 'ม.6'].map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </FormField>
      <div className="flex gap-2">
        <button type="submit" className="btn btn-primary rounded-2xl border-none shadow hover:text-black hover:bg-accent" disabled={update.isPending}>บันทึกการแก้ไข</button>
        <button type="button" className="btn bg-white rounded-2xl border-none shadow hover:text-black hover:bg-accent" onClick={() => onDone()}>ยกเลิก</button>
      </div>
    </form>
  )
}

function EmptyPanel({ title, text }: { title: string; text: string }) {
  return (
    <section>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-4 rounded-box bg-white p-12 text-center text-gray-500 shadow-sm">{text}</p>
    </section>
  )
}
