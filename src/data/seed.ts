import type { Note, Sheet } from '../types'

export const notesSeed: Note[] = [
  { id: 1, title: 'สรุปคณิตศาสตร์ ม.4', subject: 'คณิตศาสตร์เพิ่มเติม', category: 'math', grade: 'm4', type: 'note', author: 'สมชาย ใจดี' },
  { id: 2, title: 'ข้อสอบเก่า ฟิสิกส์ ม.5', subject: 'ฟิสิกส์', category: 'science', grade: 'm5', type: 'exam', author: 'วิชัย ตั้งใจ' },
  { id: 3, title: 'สรุปชีววิทยา ม.ปลาย', subject: 'ชีววิทยา', category: 'science', grade: 'senior', type: 'note', author: 'สมหญิง รักเรียน' },
  { id: 4, title: 'แกรมมาร์ภาษาอังกฤษ ม.3', subject: 'ภาษาอังกฤษ', category: 'english', grade: 'm3', type: 'note', author: 'น้ำผึ้ง สดใส' },
  { id: 5, title: 'ข้อสอบเก่า เคมี ม.6', subject: 'เคมี', category: 'science', grade: 'm6', type: 'exam', author: 'วิชัย ตั้งใจ' },
  { id: 6, title: 'สรุปหลักภาษาไทย ม.2', subject: 'ภาษาไทย', category: 'thai', grade: 'm2', type: 'note', author: 'สมหญิง รักเรียน' },
  { id: 7, title: 'สรุปประวัติศาสตร์ไทย ม.1', subject: 'ประวัติศาสตร์ไทย', category: 'social', grade: 'm1', type: 'note', author: 'สมชาย ใจดี' },
  { id: 8, title: 'ข้อสอบเก่า เรขาคณิต ม.ต้น', subject: 'เรขาคณิต', category: 'math', grade: 'junior', type: 'exam', author: 'น้ำผึ้ง สดใส' },
  { id: 9, title: 'สรุปวรรณคดีไทย ม.4', subject: 'วรรณคดีไทย', category: 'thai', grade: 'm4', type: 'note', author: 'สมหญิง รักเรียน' },
  { id: 10, title: 'ข้อสอบเก่า หน้าที่พลเมือง ม.5', subject: 'หน้าที่พลเมือง', category: 'social', grade: 'm5', type: 'exam', author: 'วิชัย ตั้งใจ' },
  { id: 11, title: 'สรุปการอ่านจับใจความภาษาอังกฤษ ม.6', subject: 'ภาษาอังกฤษ', category: 'english', grade: 'm6', type: 'note', author: 'น้ำผึ้ง สดใส' },
  { id: 12, title: 'สรุปเซตและตรรกศาสตร์ ม.4', subject: 'คณิตศาสตร์เพิ่มเติม', category: 'math', grade: 'm4', type: 'note', author: 'สมชาย ใจดี' },
]

export const sheetsSeed: Sheet[] = [
  { id: 1, title: 'สรุปสูตรฟิสิกส์ ม.4', author: 'User_A', grade: 'ม.4', status: 'pending' },
  { id: 2, title: 'เคมีอินทรีย์พื้นฐาน', author: 'User_B', grade: 'ม.5', status: 'pending' },
  { id: 3, title: 'ชีววิทยา ระบบนิเวศ', author: 'User_C', grade: 'ม.6', status: 'pending' },
  { id: 4, title: 'คณิตศาสตร์ เรื่องฟังก์ชัน', author: 'User_D', grade: 'ม.4', status: 'approved' },
]
