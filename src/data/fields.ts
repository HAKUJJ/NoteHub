import type { Subject } from '../types'

export type FieldId = 'cs' | 'data' | 'business' | 'art' | 'health' | 'law'

export interface FieldCourse {
  name: string
  detail: string
}

export interface FieldProfile {
  id: FieldId
  name: string
  tags: string[]
  subjects: string[]
  description: string
  courses: FieldCourse[]
  careers: string[]
  prepare: Subject[]
  bookSubject: string
}

export const fieldProfiles: FieldProfile[] = [
  {
    id: 'cs',
    name: 'วิทยาการคอมพิวเตอร์',
    tags: ['programming', 'technology', 'problem_solving', 'gaming', 'subj_computer', 'work_build', 'trait_logical', 'free_project', 'goal_tech'],
    subjects: ['Computer Science', 'Software Engineering', 'Information Technology'],
    description: 'เรียนรู้หลักการทำงานของคอมพิวเตอร์ การเขียนโปรแกรม และการออกแบบระบบซอฟต์แวร์ เหมาะกับคนที่ชอบแก้ปัญหาด้วยตรรกะและสนใจเทคโนโลยี',
    courses: [
      { name: 'การเขียนโปรแกรมเบื้องต้น', detail: 'พื้นฐานการคิดเชิงคำนวณ ตัวแปร เงื่อนไข ลูป และฟังก์ชัน' },
      { name: 'โครงสร้างข้อมูลและอัลกอริทึม', detail: 'การจัดเก็บข้อมูลอย่างมีประสิทธิภาพ เช่น ลิสต์ สแตก ทรี และการค้นหา' },
      { name: 'ระบบฐานข้อมูล', detail: 'การออกแบบฐานข้อมูลและการใช้ภาษา SQL' },
      { name: 'เครือข่ายคอมพิวเตอร์', detail: 'การรับส่งข้อมูลผ่านอินเทอร์เน็ตและความปลอดภัยของเครือข่าย' },
      { name: 'วิศวกรรมซอฟต์แวร์', detail: 'กระบวนการพัฒนาซอฟต์แวร์เป็นทีม ตั้งแต่เก็บความต้องการจนถึงทดสอบ' },
      { name: 'ปัญญาประดิษฐ์เบื้องต้น', detail: 'แนวคิดของ AI และ Machine Learning' },
    ],
    careers: ['Software Developer', 'Web Developer', 'System Analyst', 'Game Developer'],
    prepare: ['math', 'english'],
    bookSubject: 'computer_science_textbooks',
  },
  {
    id: 'data',
    name: 'วิทยาศาสตร์ข้อมูล',
    tags: ['data_analysis', 'math', 'technology', 'problem_solving', 'subj_math', 'work_insight', 'trait_detail', 'free_puzzle', 'goal_predict'],
    subjects: ['Data Science', 'Data Analytics', 'Business Intelligence'],
    description: 'นำข้อมูลจำนวนมากมาวิเคราะห์ด้วยสถิติและการเขียนโปรแกรม เพื่อหาข้อมูลเชิงลึกที่ช่วยในการตัดสินใจ',
    courses: [
      { name: 'สถิติสำหรับวิทยาการข้อมูล', detail: 'ความน่าจะเป็น การแจกแจง และการทดสอบสมมติฐาน' },
      { name: 'การเขียนโปรแกรม Python', detail: 'ใช้ Pandas และ NumPy จัดการข้อมูล' },
      { name: 'ฐานข้อมูลและ SQL', detail: 'ดึง กรอง และสรุปข้อมูลจากฐานข้อมูล' },
      { name: 'การเรียนรู้ของเครื่อง', detail: 'สร้างโมเดลทำนายผลจากข้อมูล' },
      { name: 'การนำเสนอข้อมูลด้วยภาพ', detail: 'ทำกราฟและ Dashboard ให้เข้าใจง่าย' },
    ],
    careers: ['Data Analyst', 'Data Scientist', 'BI Developer', 'Data Engineer'],
    prepare: ['math', 'english'],
    bookSubject: 'statistics_textbooks',
  },
  {
    id: 'business',
    name: 'บริหารธุรกิจ',
    tags: ['communication', 'business', 'blogging', 'subj_social', 'work_lead', 'trait_social', 'free_sell', 'goal_owner'],
    subjects: ['Business Administration', 'Marketing', 'Entrepreneurship'],
    description: 'เรียนรู้การบริหารองค์กร การตลาด การเงิน และการสร้างธุรกิจของตัวเอง เหมาะกับคนที่ชอบสื่อสารและวางแผน',
    courses: [
      { name: 'หลักการตลาด', detail: 'เข้าใจลูกค้า สินค้า ราคา และช่องทางการขาย' },
      { name: 'การบัญชีเบื้องต้น', detail: 'อ่านงบการเงินและบันทึกรายรับรายจ่าย' },
      { name: 'เศรษฐศาสตร์จุลภาค', detail: 'อุปสงค์ อุปทาน และพฤติกรรมผู้บริโภค' },
      { name: 'การจัดการองค์กร', detail: 'การวางแผน การนำทีม และการตัดสินใจ' },
      { name: 'การเป็นผู้ประกอบการ', detail: 'เริ่มต้นธุรกิจและเขียนแผนธุรกิจ' },
    ],
    careers: ['นักการตลาด', 'ผู้จัดการฝ่ายขาย', 'นักวิเคราะห์ธุรกิจ', 'เจ้าของกิจการ'],
    prepare: ['math', 'social', 'english'],
    bookSubject: 'management_textbooks',
  },
  {
    id: 'art',
    name: 'ศิลปะและการออกแบบ',
    tags: ['design', 'art', 'drawing', 'photography', 'subj_art', 'work_create', 'trait_creative', 'free_exhibit', 'goal_portfolio'],
    subjects: ['Visual Arts', 'Graphic Design', 'Digital Media'],
    description: 'พัฒนาทักษะการออกแบบและสื่อสารด้วยภาพ ทั้งงานกราฟิก ภาพถ่าย และสื่อดิจิทัล',
    courses: [
      { name: 'องค์ประกอบศิลป์', detail: 'เส้น รูปร่าง พื้นที่ว่าง และการจัดวาง' },
      { name: 'ทฤษฎีสี', detail: 'การเลือกและจับคู่สีให้สื่ออารมณ์' },
      { name: 'การออกแบบกราฟิก', detail: 'โลโก้ โปสเตอร์ และอัตลักษณ์องค์กร' },
      { name: 'การถ่ายภาพดิจิทัล', detail: 'การจัดแสง มุมกล้อง และการแต่งภาพ' },
      { name: 'การออกแบบ UX/UI', detail: 'ออกแบบหน้าจอแอปและเว็บให้ใช้งานง่าย' },
    ],
    careers: ['Graphic Designer', 'UX/UI Designer', 'ช่างภาพ', 'Content Creator'],
    prepare: ['thai', 'english'],
    bookSubject: 'graphic_design',
  },
  {
    id: 'health',
    name: 'วิทยาศาสตร์สุขภาพ',
    tags: ['health', 'problem_solving', 'sports', 'subj_biology', 'work_care', 'trait_empathy', 'free_volunteer', 'goal_heal'],
    subjects: ['Nursing', 'Public Health', 'Sports Science'],
    description: 'ศึกษาร่างกายมนุษย์ การดูแลสุขภาพ และการป้องกันโรค เพื่อทำงานด้านการแพทย์และสาธารณสุข',
    courses: [
      { name: 'กายวิภาคศาสตร์', detail: 'โครงสร้างและอวัยวะต่าง ๆ ของร่างกาย' },
      { name: 'สรีรวิทยา', detail: 'การทำงานของระบบต่าง ๆ ในร่างกาย' },
      { name: 'โภชนาการ', detail: 'อาหารกับสุขภาพและการวางแผนมื้ออาหาร' },
      { name: 'ระบาดวิทยา', detail: 'การเกิดและการแพร่กระจายของโรคในชุมชน' },
      { name: 'วิทยาศาสตร์การกีฬา', detail: 'การออกกำลังกายและการฟื้นฟูร่างกาย' },
    ],
    careers: ['พยาบาล', 'นักสาธารณสุข', 'นักกายภาพบำบัด', 'โค้ชกีฬา'],
    prepare: ['science', 'english'],
    bookSubject: 'nursing_textbooks',
  },
  {
    id: 'law',
    name: 'นิติศาสตร์',
    tags: ['communication', 'law', 'reading', 'subj_thai', 'work_debate', 'trait_justice', 'free_news', 'goal_fair'],
    subjects: ['Law', 'Political Science', 'Public Administration'],
    description: 'เรียนรู้กฎหมายและการใช้เหตุผลทางกฎหมาย เพื่อปกป้องสิทธิและความยุติธรรมในสังคม',
    courses: [
      { name: 'กฎหมายแพ่งและพาณิชย์', detail: 'สัญญา หนี้ ทรัพย์สิน และครอบครัว' },
      { name: 'กฎหมายอาญา', detail: 'ความผิดและโทษทางอาญา' },
      { name: 'กฎหมายรัฐธรรมนูญ', detail: 'โครงสร้างการปกครองและสิทธิเสรีภาพ' },
      { name: 'กฎหมายปกครอง', detail: 'ความสัมพันธ์ระหว่างรัฐกับประชาชน' },
      { name: 'การให้เหตุผลทางกฎหมาย', detail: 'การตีความและการเขียนคำวินิจฉัย' },
    ],
    careers: ['ทนายความ', 'นิติกร', 'อัยการ', 'ผู้พิพากษา'],
    prepare: ['social', 'thai'],
    bookSubject: 'law_textbooks',
  },
]
