import type { Grade, NoteType, Subject } from '../types'

export const subjectLabels: Record<Subject, string> = {
  math: 'คณิตศาสตร์',
  science: 'วิทยาศาสตร์',
  english: 'ภาษาอังกฤษ',
  thai: 'ภาษาไทย',
  social: 'สังคมศึกษา',
}

export const gradeLabels: Record<Grade, string> = {
  m1: 'ม.1',
  m2: 'ม.2',
  m3: 'ม.3',
  m4: 'ม.4',
  m5: 'ม.5',
  m6: 'ม.6',
  junior: 'ม.ต้น',
  senior: 'ม.ปลาย',
}

export const typeLabels: Record<NoteType, string> = {
  note: 'สรุปเนื้อหา',
  exam: 'ข้อสอบเก่า',
}
