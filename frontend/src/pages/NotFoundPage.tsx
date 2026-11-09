import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <section className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-20 text-center">
      <p className="text-7xl font-extrabold text-primary">404</p>
      <h1 className="text-2xl font-bold">ไม่พบหน้าที่คุณต้องการ</h1>
      <p className="opacity-70">ลิงก์อาจพิมพ์ผิด หรือหน้านี้ถูกย้าย/ลบไปแล้ว</p>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        <Link to="/" className="btn btn-primary">กลับหน้าแรก</Link>
        <Link to="/books" className="btn btn-outline">ไปคลังหนังสือ</Link>
      </div>
    </section>
  )
}
