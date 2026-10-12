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

const fields = [
  {
    name: 'วิทยาการคอมพิวเตอร์',
    tags: ['programming', 'technology', 'problem_solving', 'gaming'],
    subjects: ['Computer Science', 'Software Engineering', 'Information Technology'],
  },
  {
    name: 'วิทยาศาสตร์ข้อมูล',
    tags: ['data_analysis', 'math', 'technology', 'problem_solving'],
    subjects: ['Data Science', 'Data Analytics', 'Business Intelligence'],
  },
  {
    name: 'บริหารธุรกิจ',
    tags: ['communication', 'business', 'blogging'],
    subjects: ['Business Administration', 'Marketing', 'Entrepreneurship'],
  },
  {
    name: 'ศิลปะและการออกแบบ',
    tags: ['design', 'art', 'drawing', 'photography'],
    subjects: ['Visual Arts', 'Graphic Design', 'Digital Media'],
  },
  {
    name: 'วิทยาศาสตร์สุขภาพ',
    tags: ['health', 'problem_solving', 'sports'],
    subjects: ['Nursing', 'Public Health', 'Sports Science'],
  },
  {
    name: 'นิติศาสตร์',
    tags: ['communication', 'law', 'reading'],
    subjects: ['Law', 'Political Science', 'Public Administration'],
  },
]

export interface MatchResult {
  name: string
  subjects: string[]
  percent: number
}

export function calculateMatches(selected: string[]): MatchResult[] {
  return fields
    .map((f) => ({
      name: f.name,
      subjects: f.subjects,
      percent: Math.round((f.tags.filter((t) => selected.includes(t)).length / f.tags.length) * 100),
    }))
    .filter((f) => f.percent > 0)
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 3)
}
