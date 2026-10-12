const team = [
  {
    name: 'นางสาว อภัคสรา บุพบุตร',
    initial: 'อ',
    studentId: '1660707488',
    role: 'Document Coordinator และ เขียนโค้ด ออกแบบ UX/UI',
  },
  {
    name: 'นาย ธิติวุฒิ ทางธนกุล',
    initial: 'ธ',
    studentId: '1660704642',
    role: 'Main Developer โครงสร้าง Routing และ พัฒนาฟังก์ชัน',
  },
  {
    name: 'นาย ณัฐพงษ์ จำจด',
    initial: 'ณ',
    studentId: '1660703206',
    role: 'จัดเตรียม Asset เชื่อมต่อ Public APIs จัดการข้อมูลที่ได้รับให้พร้อมสำหรับใช้งานในระบบ',
  },
]

export default function AboutPage() {
  return (
    <>
      <section className="bg-linear-to-br from-primary to-primary/70 px-6 py-14 text-center text-primary-content">
        <h1 className="text-3xl font-extrabold md:text-4xl">เกี่ยวกับ NotesHub</h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg opacity-90">
          พื้นที่แบ่งปันสรุปเนื้อหาและข้อสอบเก่า สร้างขึ้นเพื่อนักเรียนมัธยมศึกษาตอนต้นและตอนปลาย
        </p>
      </section>

      <div className="mx-auto max-w-5xl space-y-10 p-6 py-10">
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-primary">พันธกิจของเรา</h2>
          <p className="leading-relaxed">
            NotesHub เกิดขึ้นจากแนวคิดที่ว่าการเรียนรู้ควรเข้าถึงได้ง่ายและแบ่งปันกันได้ระหว่างรุ่นพี่รุ่นน้อง
            เราจึงรวบรวมสรุปเนื้อหา ข้อสอบเก่า และเอกสารประกอบการเรียนจากหลากหลายหมวดวิชาไว้ในที่เดียว
            เพื่อให้นักเรียนมัธยมศึกษาค้นหาและดาวน์โหลดได้อย่างสะดวก
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-primary">สิ่งที่เราให้บริการ</h2>
          <ul className="list-disc space-y-1 pl-6">
            <li>คลังสรุปเนื้อหาและข้อสอบเก่า แยกตามหมวดวิชาและระดับชั้นมัธยมศึกษา</li>
            <li>ระบบค้นหาและกรองหมวดหมู่ที่ใช้งานง่าย</li>
            <li>ระบบสมาชิกสำหรับอัปโหลดและดาวน์โหลดเอกสาร</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-bold text-primary">ทีมผู้พัฒนา</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {team.map((m) => (
              <div key={m.studentId} className="flex flex-col items-center gap-3 rounded-box border border-gray-200 bg-white p-6 text-center shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg">
                <div className="avatar avatar-placeholder">
                  <div className="w-24 rounded-full bg-primary text-3xl text-primary-content ring-4 ring-accent ring-offset-2 ring-offset-white">
                    <span>{m.initial}</span>
                  </div>
                </div>
                <h3 className="text-lg font-bold">{m.name}</h3>
                <p className="text-sm opacity-70">รหัสนักศึกษา {m.studentId}</p>
                <p className="mt-1 border-t border-gray-200 pt-3 text-sm leading-relaxed text-primary">{m.role}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
