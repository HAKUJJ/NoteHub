import { fieldProfiles, type FieldId } from '../data/fields'

interface Option {
  value: string
  label: string
}

export const matcherGroups: { title: string; options: Option[] }[] = [
  {
    title: 'Your Skills',
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
    title: 'Interests',
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
    title: 'Hobbies',
    options: [
      { value: 'gaming', label: 'เล่นเกม' },
      { value: 'reading', label: 'อ่านหนังสือ' },
      { value: 'drawing', label: 'วาดภาพ' },
      { value: 'sports', label: 'เล่นกีฬา' },
      { value: 'photography', label: 'ถ่ายภาพ' },
      { value: 'blogging', label: 'เขียนบล็อก' },
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
