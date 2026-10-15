import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import FormField from '../components/ui/FormField'
import { useApproveSheet, useDeleteSheet, useSheets, useUpdateSheet } from '../hooks/useSheets'
import { useAuthStore } from '../store/authStore'
import type { Sheet } from '../types'

type Tab = 'dashboard' | 'sheets' | 'users' | 'reports'

const tabs: { id: Tab; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
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
          <img src="/images/logo.svg" alt="NoteHub Logo" width={40} height={40} />
          <div>
            <p className="text-xs tracking-widest opacity-60">ADMIN PANEL</p>
            <h1 className="text-2xl font-bold">NoteHub</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold mr-1">Administrator</span>
          <Link to="/" className="btn btn-ghost btn-sm rounded-2xl border-none shadow hover:text-black hover:bg-accent">← กลับหน้าเว็บไซต์</Link>
          <button className="btn btn-outline btn-sm border-none rounded-2xl shadow hover:text-black hover:bg-accent" onClick={() => { logout(); navigate('/') }}>ออกจากระบบ</button>
        </div>
      </header>

      <div role="tablist" className="tabs tabs-border tabs-lg mb-8">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            className={`tab px-6 ${tab === t.id ? 'tab-active font-bold text-primary' : 'opacity-70 hover:opacity-100'}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="alert alert-warning mb-6" role="note">
        <span><strong>โหมดสาธิต (Demo):</strong> ข้อมูลในหน้านี้เป็นข้อมูลตัวอย่าง ยังไม่ได้เชื่อมต่อฐานข้อมูลจริง รีเฟรชแล้วการแก้ไขจะกลับเป็นค่าเดิม</span>
      </div>

      {tab === 'dashboard' && <DashboardPanel />}
      {tab === 'sheets' && <SheetsPanel />}
      {tab === 'users' && <EmptyPanel title="จัดการผู้ใช้งาน" text="ยังไม่มีข้อมูลผู้ใช้งาน" />}
      {tab === 'reports' && <EmptyPanel title="รายงานปัญหา" text="ยังไม่มีรายงานปัญหา" />}
    </div>
  )
}

function DashboardPanel() {
  const { data: sheets = [] } = useSheets()
  const pending = sheets.filter((s) => s.status === 'pending').length
  const stats = [
    { title: 'ชีททั้งหมด', value: sheets.length, desc: 'ชีทในระบบ' },
    { title: 'รออนุมัติ', value: pending, desc: 'รอการตรวจสอบ' },
    { title: 'ผู้ใช้งาน', value: TOTAL_USERS, desc: 'สมาชิกทั้งหมด (ตัวอย่าง)' },
    { title: 'รายงานปัญหา', value: TOTAL_REPORTS, desc: 'รายการที่ต้องตรวจสอบ (ตัวอย่าง)' },
  ]

  return (
    <section>
      <h2 className="text-xl font-bold">ภาพรวมระบบ</h2>
      <p className="mb-6 opacity-70">จัดการข้อมูลต่าง ๆ ของ NoteHub</p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
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
              <th>Action</th>
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
                      <button className="btn btn-success btn-xs rounded-2xl border-none shadow hover:text-black hover:bg-accent" disabled={approve.isPending} onClick={() => handleApprove(s)}>Approve</button>
                    )}
                    <button className="btn btn-info btn-xs rounded-2xl border-none shadow hover:text-black hover:bg-accent" onClick={() => setEditing(s)}>Edit</button>
                    <button className="btn btn-error btn-xs rounded-2xl border-none shadow hover:text-black hover:bg-accent" onClick={() => setDeleteId(s.id)}>Delete</button>
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
          <option value="ม.4">ม.4</option>
          <option value="ม.5">ม.5</option>
          <option value="ม.6">ม.6</option>
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
