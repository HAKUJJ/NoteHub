import { fieldProfiles, type FieldId } from '../data/fields'

interface Option {
  value: string
  label: string
}

export interface MatcherGroup {
  title: string
  /** true = เลือกได้หลายข้อ, false = เลือกได้ข้อเดียว */
  multi: boolean
  options: Option[]
}

export const matcherGroups: MatcherGroup[] = [
  {
    title: 'ทักษะของคุณ',
    multi: true,
    options: [
      { value: 'programming', label: 'การเขียนโปรแกรม' },
      { value: 'data_analysis', label: 'การวิเคราะห์ข้อมูล' },
      { value: 'design', label: 'การออกแบบ' },
      { value: 'communication', label: 'การสื่อสาร' },
      { value: 'problem_solving', label: 'การแก้ปัญหา' },
      { value: 'math', label: 'คณิตศาสตร์' },
    ],
  },
  {
    title: 'สิ่งที่คุณสนใจ',
    multi: true,
    options: [
      { value: 'technology', label: 'เทคโนโลยี' },
      { value: 'business', label: 'ธุรกิจ' },
      { value: 'art', label: 'ศิลปะ' },
      { value: 'health', label: 'วิทยาศาสตร์สุขภาพ' },
      { value: 'law', label: 'กฎหมาย' },
      { value: 'environment', label: 'สิ่งแวดล้อม' },
    ],
  },
  {
    title: 'งานอดิเรก',
    multi: true,
    options: [
      { value: 'gaming', label: 'เล่นเกม' },
      { value: 'reading', label: 'อ่านหนังสือ' },
      { value: 'drawing', label: 'วาดภาพ' },
      { value: 'sports', label: 'เล่นกีฬา' },
      { value: 'photography', label: 'ถ่ายภาพ' },
      { value: 'blogging', label: 'เขียนบล็อก' },
    ],
  },
  {
    title: 'วิชาที่คุณชอบที่สุดในโรงเรียน',
    multi: false,
    options: [
      { value: 'subj_computer', label: 'วิทยาการคำนวณ' },
      { value: 'subj_math', label: 'คณิตศาสตร์ / สถิติ' },
      { value: 'subj_social', label: 'สังคมศึกษา / เศรษฐศาสตร์' },
      { value: 'subj_art', label: 'ศิลปะ' },
      { value: 'subj_biology', label: 'ชีววิทยา' },
      { value: 'subj_thai', label: 'ภาษาไทย / ประวัติศาสตร์' },
    ],
  },
  {
    title: 'อยากทำงานลักษณะไหน',
    multi: false,
    options: [
      { value: 'work_build', label: 'สร้างแอปหรือระบบ' },
      { value: 'work_insight', label: 'หาคำตอบจากตัวเลข' },
      { value: 'work_lead', label: 'วางแผนและนำทีม' },
      { value: 'work_create', label: 'สร้างสรรค์ผลงาน' },
      { value: 'work_care', label: 'ดูแลช่วยเหลือผู้คน' },
      { value: 'work_debate', label: 'ถกเถียงด้วยเหตุผล' },
    ],
  },
  {
    title: 'ข้อไหนตรงกับนิสัยของคุณ',
    multi: false,
    options: [
      { value: 'trait_logical', label: 'คิดเป็นขั้นเป็นตอน' },
      { value: 'trait_detail', label: 'ช่างสังเกตรายละเอียด' },
      { value: 'trait_social', label: 'ชอบพบปะผู้คน' },
      { value: 'trait_creative', label: 'มีไอเดียแปลกใหม่' },
      { value: 'trait_empathy', label: 'ใจเย็น เข้าใจผู้อื่น' },
      { value: 'trait_justice', label: 'ยึดความถูกต้อง' },
    ],
  },
  {
    title: 'ถ้ามีวันว่าง 1 วัน อยากทำอะไร',
    multi: false,
    options: [
      { value: 'free_project', label: 'ลองเขียนโค้ดทำเว็บ' },
      { value: 'free_puzzle', label: 'เล่นเกมปริศนา / ซูโดกุ' },
      { value: 'free_sell', label: 'ขายของออนไลน์' },
      { value: 'free_exhibit', label: 'ไปดูนิทรรศการศิลปะ' },
      { value: 'free_volunteer', label: 'ทำจิตอาสา' },
      { value: 'free_news', label: 'ติดตามข่าวสังคมและคดีดัง' },
    ],
  },
  {
    title: 'เป้าหมายในอนาคตของคุณ',
    multi: false,
    options: [
      { value: 'goal_tech', label: 'สร้างเทคโนโลยีที่คนใช้ทั่วโลก' },
      { value: 'goal_predict', label: 'ใช้ข้อมูลทำนายอนาคต' },
      { value: 'goal_owner', label: 'มีธุรกิจของตัวเอง' },
      { value: 'goal_portfolio', label: 'มีผลงานให้คนจดจำ' },
      { value: 'goal_heal', label: 'ช่วยให้คนมีสุขภาพดี' },
      { value: 'goal_fair', label: 'ทำให้สังคมยุติธรรม' },
    ],
  },
]

export interface MatchResult {
  id: FieldId
  name: string
  subjects: string[]
  percent: number
}

export function calculateMatches(selected: string[]): MatchResult[] {
  return fieldProfiles
    .map((f) => ({
      id: f.id,
      name: f.name,
      subjects: f.subjects,
      percent: Math.round((f.tags.filter((t) => selected.includes(t)).length / f.tags.length) * 100),
    }))
    .filter((f) => f.percent > 0)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3)
}
