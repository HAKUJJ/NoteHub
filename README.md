# NotesHub

React + Vite + TypeScript frontend และ Express + Prisma backend สำหรับ Supabase PostgreSQL

## รันในเครื่อง

ใช้ Node.js 24+ และ npm 11+ ตั้งค่า `backend/.env` ตาม `.env.example` โดยเก็บ credentials ไว้เฉพาะในเครื่อง

```bash
npm ci
npm run dev
```

- Frontend: http://localhost:5173 (Vite อาจเลือก 5174/5175 เมื่อพอร์ตถูกใช้อยู่)
- Backend: http://localhost:3000/api
- ตรวจ API: http://localhost:3000/api/health
- หยุดด้วย Ctrl+C

รันแยกด้วย `npm run dev --workspace frontend` และ `npm run dev --workspace backend`

## คำสั่งตรวจสอบ

```bash
npm run typecheck
npm run lint
npm run build
npm test
npm run db --workspace backend
npm run test:integration --workspace backend
```

Integration test ใช้ TEST_EMAIL/TEST_PASSWORD ของบัญชีที่ได้รับอนุญาต และลบเฉพาะข้อมูลทดสอบที่สร้างใหม่

เก็บ Prisma schema/migrations/seed ใน `backend/prisma/` การตรวจ `db` ไม่ apply migration ห้าม reset ฐานข้อมูลที่มีข้อมูลอยู่ `.env`, node_modules และ dist ไม่เข้า Git
