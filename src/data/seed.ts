import type { Note, Sheet } from '../types'

export const notesSeed: Note[] = [
  {
    id: 1, title: 'สรุปคณิตศาสตร์ ม.4', subject: 'คณิตศาสตร์เพิ่มเติม', category: 'math', grade: 'm4', type: 'note', author: 'สมชาย ใจดี',
    pages: 24, image: 'photo-1453733190371-0a9bedd82893', relatedBookSubject: 'mathematics_textbooks',
    description: 'สรุปเนื้อหาคณิตศาสตร์เพิ่มเติม ม.4 เทอม 1 ครบทุกบท มีสูตรสำคัญและตัวอย่างโจทย์พร้อมวิธีทำ',
    topics: ['เซต', 'ตรรกศาสตร์', 'จำนวนจริง', 'ทฤษฎีจำนวนเบื้องต้น'],
  },
  {
    id: 2, title: 'ข้อสอบเก่า ฟิสิกส์ ม.5', subject: 'ฟิสิกส์', category: 'science', grade: 'm5', type: 'exam', author: 'วิชัย ตั้งใจ',
    pages: 32, image: 'photo-1633493702341-4d04841df53b', relatedBookSubject: 'physics_textbooks',
    description: 'รวมข้อสอบกลางภาคและปลายภาค ฟิสิกส์ ม.5 ย้อนหลัง 3 ปี พร้อมเฉลยละเอียด',
    topics: ['การเคลื่อนที่แบบฮาร์มอนิก', 'คลื่น', 'เสียง', 'ไฟฟ้าสถิต'],
  },
  {
    id: 3, title: 'สรุปชีววิทยา ม.ปลาย', subject: 'ชีววิทยา', category: 'science', grade: 'senior', type: 'note', author: 'สมหญิง รักเรียน',
    pages: 40, image: 'photo-1526930382372-67bf22c0fce2', relatedBookSubject: 'biology_textbooks',
    description: 'สรุปชีววิทยา ม.ปลาย ฉบับย่อสำหรับทบทวนก่อนสอบ มีแผนภาพประกอบเข้าใจง่าย',
    topics: ['เซลล์', 'พันธุศาสตร์', 'วิวัฒนาการ', 'ระบบในร่างกายมนุษย์'],
  },
  {
    id: 4, title: 'แกรมมาร์ภาษาอังกฤษ ม.3', subject: 'ภาษาอังกฤษ', category: 'english', grade: 'm3', type: 'note', author: 'น้ำผึ้ง สดใส',
    pages: 18, image: 'photo-1543165796-5426273eaab3', relatedBookSubject: 'english_language_textbooks_for_foreign_speakers',
    description: 'สรุปแกรมมาร์ภาษาอังกฤษ ม.3 ที่ออกสอบบ่อย พร้อมแบบฝึกหัดท้ายบท',
    topics: ['Tenses', 'Passive Voice', 'Conditional Sentences', 'Relative Clauses'],
  },
  {
    id: 5, title: 'ข้อสอบเก่า เคมี ม.6', subject: 'เคมี', category: 'science', grade: 'm6', type: 'exam', author: 'วิชัย ตั้งใจ',
    pages: 36, image: 'photo-1532094349884-543bc11b234d', relatedBookSubject: 'chemistry_textbooks',
    description: 'ข้อสอบเก่าเคมี ม.6 แนวข้อสอบเข้ามหาวิทยาลัย พร้อมเฉลยและเทคนิคทำโจทย์',
    topics: ['ปริมาณสารสัมพันธ์', 'กรด-เบส', 'เคมีอินทรีย์', 'ไฟฟ้าเคมี'],
  },
  {
    id: 6, title: 'สรุปหลักภาษาไทย ม.2', subject: 'ภาษาไทย', category: 'thai', grade: 'm2', type: 'note', author: 'สมหญิง รักเรียน',
    pages: 16, image: 'photo-1579017308347-e53e0d2fc5e9', relatedBookSubject: 'thai_language_grammar',
    description: 'สรุปหลักภาษาไทย ม.2 อ่านง่าย มีตารางสรุปและตัวอย่างประโยค',
    topics: ['ชนิดของคำ', 'ประโยค', 'คำยืมภาษาต่างประเทศ', 'การเขียนเรียงความ'],
  },
  {
    id: 7, title: 'สรุปประวัติศาสตร์ไทย ม.1', subject: 'ประวัติศาสตร์ไทย', category: 'social', grade: 'm1', type: 'note', author: 'สมชาย ใจดี',
    pages: 20, image: 'photo-1679430255152-d1b0fec90432', relatedBookSubject: 'history_of_thailand',
    description: 'สรุปประวัติศาสตร์ไทย ม.1 เรียงตามยุคสมัย พร้อมไทม์ไลน์เหตุการณ์สำคัญ',
    topics: ['สมัยก่อนประวัติศาสตร์', 'สมัยสุโขทัย', 'หลักฐานทางประวัติศาสตร์', 'ศักราช'],
  },
  {
    id: 8, title: 'ข้อสอบเก่า เรขาคณิต ม.ต้น', subject: 'เรขาคณิต', category: 'math', grade: 'junior', type: 'exam', author: 'น้ำผึ้ง สดใส',
    pages: 22, image: 'photo-1764948620396-45f5b5fdd73e', relatedBookSubject: 'mathematics_textbooks',
    description: 'รวมข้อสอบเก่าเรขาคณิต ม.ต้น เน้นโจทย์พิสูจน์และการคำนวณพื้นที่',
    topics: ['ความเท่ากันทุกประการ', 'ทฤษฎีบทพีทาโกรัส', 'เส้นขนาน', 'พื้นที่ผิวและปริมาตร'],
  },
  {
    id: 9, title: 'สรุปวรรณคดีไทย ม.4', subject: 'วรรณคดีไทย', category: 'thai', grade: 'm4', type: 'note', author: 'สมหญิง รักเรียน',
    pages: 28, image: 'photo-1702753390015-d4abffb87306', relatedBookSubject: 'thai_language_grammar',
    description: 'สรุปวรรณคดีไทย ม.4 ทุกเรื่องในหนังสือเรียน พร้อมคุณค่าและข้อคิด',
    topics: ['นิราศนรินทร์', 'หัวใจชายหนุ่ม', 'มัทนะพาธา', 'ไตรภูมิพระร่วง'],
  },
  {
    id: 10, title: 'ข้อสอบเก่า หน้าที่พลเมือง ม.5', subject: 'หน้าที่พลเมือง', category: 'social', grade: 'm5', type: 'exam', author: 'วิชัย ตั้งใจ',
    pages: 18, image: 'photo-1589391886645-d51941baf7fb', relatedBookSubject: 'history_of_thailand',
    description: 'ข้อสอบเก่าหน้าที่พลเมือง ม.5 พร้อมเฉลย ครอบคลุมรัฐธรรมนูญและกฎหมายใกล้ตัว',
    topics: ['รัฐธรรมนูญ', 'สิทธิและหน้าที่', 'กฎหมายแพ่ง', 'กฎหมายอาญา'],
  },
  {
    id: 11, title: 'สรุปการอ่านจับใจความภาษาอังกฤษ ม.6', subject: 'ภาษาอังกฤษ', category: 'english', grade: 'm6', type: 'note', author: 'น้ำผึ้ง สดใส',
    pages: 26, image: 'photo-1514369118554-e20d93546b30', relatedBookSubject: 'english_language_textbooks_for_foreign_speakers',
    description: 'สรุปเทคนิคการอ่านจับใจความภาษาอังกฤษ ม.6 สำหรับเตรียมสอบ พร้อมบทความฝึกอ่าน',
    topics: ['Main Idea', 'Skimming & Scanning', 'Inference', 'Vocabulary in Context'],
  },
  {
    id: 12, title: 'สรุปเซตและตรรกศาสตร์ ม.4', subject: 'คณิตศาสตร์เพิ่มเติม', category: 'math', grade: 'm4', type: 'note', author: 'สมชาย ใจดี',
    pages: 20, image: 'photo-1635372722656-389f87a941b7', relatedBookSubject: 'mathematics_textbooks',
    description: 'สรุปเซตและตรรกศาสตร์ ม.4 แบบละเอียด มีแผนภาพเวนน์และตารางค่าความจริง',
    topics: ['เซตและสับเซต', 'แผนภาพเวนน์-ออยเลอร์', 'ตัวเชื่อมทางตรรกศาสตร์', 'ตัวบ่งปริมาณ'],
  },
]

export const sheetsSeed: Sheet[] = [
  { id: 1, title: 'สรุปสูตรฟิสิกส์ ม.4', author: 'User_A', grade: 'ม.4', status: 'pending' },
  { id: 2, title: 'เคมีอินทรีย์พื้นฐาน', author: 'User_B', grade: 'ม.5', status: 'pending' },
  { id: 3, title: 'ชีววิทยา ระบบนิเวศ', author: 'User_C', grade: 'ม.6', status: 'pending' },
  { id: 4, title: 'คณิตศาสตร์ เรื่องฟังก์ชัน', author: 'User_D', grade: 'ม.4', status: 'approved' },
]
