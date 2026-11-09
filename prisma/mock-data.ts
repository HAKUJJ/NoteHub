// Week 12 fixtures. Codes match the existing Prisma seed; no frontend changes.
export const subjects = [
  { code: 'math', name: 'คณิตศาสตร์' },
  { code: 'science', name: 'วิทยาศาสตร์' },
  { code: 'english', name: 'ภาษาอังกฤษ' },
  { code: 'thai', name: 'ภาษาไทย' },
  { code: 'social', name: 'สังคมศึกษา' },
]

export const gradeLevels = Array.from({ length: 6 }, (_, index) => ({
  code: `m${index + 1}`, name: `ม.${index + 1}`, sortOrder: index + 1,
}))

// A separate fixed UUID namespace preserves the original three sample notes.
export const notes = [
  { id: '31912001-0000-4000-8000-000000000001', title: 'สรุปสมการเชิงเส้น ม.1', subjectCode: 'math', gradeCode: 'm1', type: 'note', description: 'สมการตัวแปรเดียว การย้ายข้าง และตัวอย่างโจทย์พร้อมวิธีทำ' },
  { id: '31912001-0000-4000-8000-000000000002', title: 'สรุปพีชคณิต ม.2', subjectCode: 'math', gradeCode: 'm2', type: 'note', description: 'พหุนาม การแยกตัวประกอบ และการดำเนินการทางพีชคณิต' },
  { id: '31912001-0000-4000-8000-000000000003', title: 'สรุปภาษาอังกฤษ Grammar ม.3', subjectCode: 'english', gradeCode: 'm3', type: 'note', description: 'Tenses, Passive Voice และ Conditional Sentences พร้อมแบบฝึกหัด' },
  { id: '31912001-0000-4000-8000-000000000004', title: 'สรุปฟังก์ชันและกราฟ ม.4', subjectCode: 'math', gradeCode: 'm4', type: 'note', description: 'โดเมน เรนจ์ ฟังก์ชันเชิงเส้น และกราฟพาราโบลา' },
  { id: '31912001-0000-4000-8000-000000000005', title: 'ข้อสอบเก่าคณิตศาสตร์ ม.4', subjectCode: 'math', gradeCode: 'm4', type: 'exam', description: 'ข้อสอบตัวอย่างเรื่องเซต ตรรกศาสตร์ และจำนวนจริงพร้อมแนวเฉลย' },
  { id: '31912001-0000-4000-8000-000000000006', title: 'สรุปฟิสิกส์เรื่องแรงและการเคลื่อนที่ ม.5', subjectCode: 'science', gradeCode: 'm5', type: 'note', description: 'กฎของนิวตัน แผนภาพแรง และการคำนวณการเคลื่อนที่' },
  { id: '31912001-0000-4000-8000-000000000007', title: 'ข้อสอบเก่าเคมี ม.5', subjectCode: 'science', gradeCode: 'm5', type: 'exam', description: 'แบบทดสอบตัวอย่างปริมาณสารสัมพันธ์และสมดุลเคมีพร้อมแนวเฉลย' },
  { id: '31912001-0000-4000-8000-000000000008', title: 'สรุปชีววิทยา ม.6', subjectCode: 'science', gradeCode: 'm6', type: 'note', description: 'พันธุศาสตร์ วิวัฒนาการ และระบบนิเวศสำหรับทบทวนก่อนสอบ' },
  { id: '31912001-0000-4000-8000-000000000009', title: 'สรุปหลักภาษาไทย ม.2', subjectCode: 'thai', gradeCode: 'm2', type: 'note', description: 'ชนิดของคำ โครงสร้างประโยค และคำยืมภาษาต่างประเทศ' },
  { id: '31912001-0000-4000-8000-000000000010', title: 'สรุปประวัติศาสตร์ไทย ม.3', subjectCode: 'social', gradeCode: 'm3', type: 'note', description: 'ลำดับเหตุการณ์สำคัญและการวิเคราะห์หลักฐานทางประวัติศาสตร์' },
]

export const favoriteNoteIds = notes.slice(0, 4).map((note) => note.id)
