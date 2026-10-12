import SearchBar from '../components/ui/SearchBar'
import NoteResults from '../components/ui/NoteResults'

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <section className="relative overflow-hidden rounded-box bg-linear-to-br from-primary/15 via-base-100 to-accent/30 py-8 shadow-sm">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(var(--color-primary)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom_left,black,transparent_70%)]" />
        <div className="relative flex flex-col items-center gap-8 px-6 lg:flex-row lg:px-10">
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold leading-tight text-primary md:text-4xl">
              คลังโน้ตและข้อสอบเก่า สำหรับนักเรียน <span className="whitespace-nowrap text-secondary">ม.1 - ม.6</span>
            </h1>
            <p className="mb-6 mt-3 text-lg opacity-80">ค้นหา แชร์ และดาวน์โหลดสรุปเนื้อหาจากรุ่นพี่ ครบทุกวิชา อัปเดตทุกภาคการศึกษา</p>
            <SearchBar large />
          </div>
          <img src="/images/banner.png" alt="ภาพประกอบกองหนังสือและสมุดโน้ต" className="max-w-xs drop-shadow-lg lg:max-w-sm" />
        </div>
      </section>
      <NoteResults title="โน้ตแนะนำ" />
    </div>
  )
}
