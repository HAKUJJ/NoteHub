import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useApproveSheet, useDeleteSheet, useSheets } from '../hooks/useSheets'
import { useNotes } from '../hooks/useNotes'
import { isUserNote } from '../api/notes'
import { useAuthStore } from '../store/authStore'
import type { Sheet } from '../types'

type Tab = 'dashboard' | 'sheets' | 'users' | 'reports'

const tabs: { id: Tab; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'sheets', label: 'จัดการโพสต์' },
  { id: 'users', label: 'จัดการผู้ใช้งาน' },
  { id: 'reports', label: 'รายงานปัญหา' },
]

type UserStatus = 'Active' | 'Inactive'
type ReportStatus = 'Pending' | 'Resolved'
type AdminUser = { id: number; name: string; email: string; role: string; status: UserStatus }
type AdminReport = { id: number; topic: string; reportedBy: string; date: string; status: ReportStatus }

const initialUsers: AdminUser[] = [
  { id: 1, name: 'สมชาย ใจดี', email: 'somchai@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'วิภา สุขสันต์', email: 'wipa@example.com', role: 'Student', status: 'Active' },
  { id: 3, name: 'ณัฐพล รักเรียน', email: 'nattaphon@example.com', role: 'Student', status: 'Inactive' },
  { id: 4, name: 'กานต์ มั่นคง', email: 'kan@example.com', role: 'Student', status: 'Active' },
  { id: 5, name: 'ปรียา ศรีสุข', email: 'preeya@example.com', role: 'Student', status: 'Inactive' },
]

const initialReports: AdminReport[] = [
  { id: 1, topic: 'เนื้อหาไม่ถูกต้อง', reportedBy: 'วิภา สุขสันต์', date: '2026-10-10', status: 'Pending' },
  { id: 2, topic: 'ลิงก์เสีย', reportedBy: 'กานต์ มั่นคง', date: '2026-10-11', status: 'Resolved' },
  { id: 3, topic: 'ไฟล์แนบเปิดไม่ได้', reportedBy: 'ณัฐพล รักเรียน', date: '2026-10-12', status: 'Pending' },
  { id: 4, topic: 'มีเนื้อหาซ้ำกัน', reportedBy: 'ปรียา ศรีสุข', date: '2026-10-13', status: 'Resolved' },
  { id: 5, topic: 'ข้อมูลผู้จัดทำผิดพลาด', reportedBy: 'สมชาย ใจดี', date: '2026-10-14', status: 'Pending' },
]

export default function AdminPage() {
  const isAdmin = useAuthStore((s) => s.isAdmin && s.user?.role === 'admin')
  if (!isAdmin) return <Navigate to="/" replace />
  return <AdminDashboard />
}

function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('dashboard')
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [reports, setReports] = useState<AdminReport[]>(initialReports)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  useEffect(() => {
    if (!toastMessage) return
    const timer = setTimeout(() => setToastMessage(null), 3000)
    return () => clearTimeout(timer)
  }, [toastMessage])

  const toggleUserStatus = (id: number) => {
    const user = users.find((u) => u.id === id)
    if (!user) return
    const next: UserStatus = user.status === 'Active' ? 'Inactive' : 'Active'
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: next } : u)))
    setToastMessage(next === 'Inactive' ? `ระงับสิทธิ์ผู้ใช้: ${user.name} เรียบร้อยแล้ว` : `ปลดระงับผู้ใช้: ${user.name} เรียบร้อยแล้ว`)
  }

  const resolveReport = (id: number) => {
    const report = reports.find((r) => r.id === id)
    if (!report || report.status === 'Resolved') return
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'Resolved' } : r)))
    setToastMessage(`ตรวจสอบปัญหา: ${report.topic} เรียบร้อยแล้ว`)
  }

  const deleteReport = (id: number) => {
    const report = reports.find((r) => r.id === id)
    if (!report) return
    setReports((prev) => prev.filter((r) => r.id !== id))
    setToastMessage(`ลบรายงานปัญหา: ${report.topic} เรียบร้อยแล้ว`)
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
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
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6">
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

      {tab === 'dashboard' && <DashboardPanel userCount={users.length} pendingReports={reports.filter((r) => r.status === 'Pending').length} />}
      {tab === 'sheets' && <SheetsPanel setToastMessage={setToastMessage} />}
      {tab === 'users' && <UsersPanel users={users} onToggleStatus={toggleUserStatus} />}
      {tab === 'reports' && <ReportsPanel reports={reports} onResolve={resolveReport} onDelete={deleteReport} />}

      {toastMessage && (
        <div className="toast toast-bottom toast-end z-50">
          <div className="alert alert-success text-white shadow-lg" role="status">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
      </main>
    </div>
  )
}

function DashboardPanel({ userCount, pendingReports }: { userCount: number; pendingReports: number }) {
  const { data: sheets = [] } = useSheets()
  const pending = sheets.filter((s) => s.status === 'pending').length
  const { data: notes = [] } = useNotes()
  const userPosts = notes.filter((n) => isUserNote(n.id)).length
  const stats = [
    { title: 'โพสต์ทั้งหมด', value: notes.length, desc: `ผู้ใช้สร้าง ${userPosts} โพสต์` },
    { title: 'ชีททั้งหมด', value: sheets.length, desc: 'ชีทในระบบ' },
    { title: 'รออนุมัติ', value: pending, desc: 'รอการตรวจสอบ' },
    { title: 'ผู้ใช้งาน', value: userCount, desc: 'สมาชิกทั้งหมด' },
    { title: 'รายงานปัญหา', value: pendingReports, desc: 'รอการตรวจสอบ' },
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

type SetToast = (message: string | null) => void

function SheetsPanel({ setToastMessage }: { setToastMessage: SetToast }) {
  const { data: sheets = [], isLoading } = useSheets()
  const approve = useApproveSheet()
  const remove = useDeleteSheet()
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleApprove = (sheet: Sheet) =>
    approve.mutate(sheet.id, { onSuccess: () => setToastMessage(`อนุมัติชีท "${sheet.title}" เรียบร้อยแล้ว`) })

  const confirmDelete = () => {
    if (deleteId === null) return
    remove.mutate(deleteId, {
      onSuccess: () => {
        setDeleteId(null)
        setToastMessage('ลบข้อมูลเรียบร้อยแล้ว')
      },
    })
  }

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold">โพสต์ที่รอการอนุมัติ</h2>
        <p className="opacity-70">ตรวจสอบและจัดการโพสต์ที่ผู้ใช้งานส่งเข้ามา</p>
      </div>

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
                  <span className={`badge badge-sm ${s.status === 'pending' ? 'badge-warning text-gray-900' : 'badge-success text-white'}`}>
                    {s.status === 'pending' ? 'รออนุมัติ' : 'อนุมัติแล้ว'}
                  </span>
                </td>
                <td>
                  <div className="flex gap-1">
                    <Link to={`/post/${s.id}`} className="btn btn-info btn-xs text-white rounded-full">ดูเนื้อหาโพสต์</Link>
                    {s.status === 'pending' && (
                      <button className="btn btn-success btn-xs text-white rounded-full" disabled={approve.isPending} onClick={() => handleApprove(s)}>อนุมัติ</button>
                    )}
                    <button className="btn btn-error btn-xs text-white rounded-full" onClick={() => setDeleteId(s.id)}>ลบ</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

function UsersPanel({ users, onToggleStatus }: { users: AdminUser[]; onToggleStatus: (id: number) => void }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">จัดการผู้ใช้งาน</h2>
      <div className="overflow-x-auto rounded-box bg-white p-4 shadow-md">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-primary/10 text-primary">
              <th>ชื่อผู้ใช้งาน</th>
              <th>อีเมล</th>
              <th>บทบาท</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="font-medium">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <span className={`badge badge-sm text-white ${u.status === 'Active' ? 'badge-success' : 'badge-error'}`}>{u.status}</span>
                </td>
                <td>
                  <div className="flex gap-1">
                    {u.status === 'Active' ? (
                      <button className="btn btn-error btn-xs text-white rounded-full" onClick={() => onToggleStatus(u.id)}>ระงับสิทธิ์</button>
                    ) : (
                      <button className="btn btn-success btn-xs text-white rounded-full" onClick={() => onToggleStatus(u.id)}>ปลดระงับ</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function ReportsPanel({ reports, onResolve, onDelete }: { reports: AdminReport[]; onResolve: (id: number) => void; onDelete: (id: number) => void }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="text-xl font-bold">รายงานปัญหา</h2>
      <div className="overflow-x-auto rounded-box bg-white p-4 shadow-md">
        <table className="table table-zebra w-full">
          <thead>
            <tr className="bg-primary/10 text-primary">
              <th>หัวข้อปัญหา</th>
              <th>ผู้รายงาน</th>
              <th>วันที่</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 && <tr><td colSpan={5} className="text-center opacity-70">ไม่มีรายงานปัญหา</td></tr>}
            {reports.map((r) => (
              <tr key={r.id}>
                <td className="font-medium">{r.topic}</td>
                <td>{r.reportedBy}</td>
                <td className="whitespace-nowrap">{r.date}</td>
                <td>
                  <span className={`badge badge-sm ${r.status === 'Resolved' ? 'badge-success text-white' : 'badge-warning text-gray-900'}`}>{r.status}</span>
                </td>
                <td>
                  <div className="flex gap-1">
                    {r.status === 'Pending' && (
                      <button className="btn btn-info btn-xs text-white rounded-full" onClick={() => onResolve(r.id)}>ตรวจสอบ</button>
                    )}
                    <button className="btn btn-error btn-xs text-white rounded-full" onClick={() => onDelete(r.id)}>ลบ</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
