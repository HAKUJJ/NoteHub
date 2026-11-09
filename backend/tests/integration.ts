import assert from 'node:assert/strict'
import { app } from '../src/app.js'
import { prisma } from '../src/lib/prisma.js'
import type { AddressInfo } from 'node:net'

if(!process.env.DATABASE_URL || /YOUR[-_]|%5BYOUR/i.test(process.env.DATABASE_URL)) {
  console.error('BLOCKED: configure DATABASE_URL in backend/.env. No live CRUD tests ran.')
  process.exit(1)
}
if(!process.env.TEST_EMAIL || !process.env.TEST_PASSWORD) throw new Error('Configure TEST_EMAIL and TEST_PASSWORD for a dedicated existing Supabase Auth account.')
const server=app.listen(0)
const base=`http://127.0.0.1:${(server.address() as AddressInfo).port}/api`
let token='',refreshToken='',id=''
let userId=''
let bookId=''
async function request(path:string,method='GET',body?:unknown,expected=200,accessToken=token) {
  const r=await fetch(base+path,{method,headers:{'Content-Type':'application/json',...(accessToken?{Authorization:`Bearer ${accessToken}`}:{})},body:body===undefined?undefined:JSON.stringify(body)})
  const result=await r.json()
  assert.equal(r.status,expected,`${method} ${path}: ${result.message ?? ''}`)
  return result
}
try {
  await request('/health/db')
  const login=await request('/auth/login','POST',{email:process.env.TEST_EMAIL,password:process.env.TEST_PASSWORD})
  token=login.data.accessToken;refreshToken=login.data.refreshToken
  userId=login.data.user.id
  await request('/auth/me')
  const [subjects,grades]=await Promise.all([request('/subjects'),request('/grades')])
  assert.ok(subjects.data.length>=5);assert.ok(grades.data.length>=6)
  await request(`/subjects/${subjects.data[0].code}`)
  const originalCount=await prisma.note.count()
  const data={title:`NotesHub CRUD verification ${Date.now()}`,description:'Disposable integration test',content:'Database roundtrip',subjectCode:subjects.data[0].code,gradeCode:grades.data[0].code,type:'note',attachment:{name:'example.pdf',type:'application/pdf',size:5,data:Buffer.from('%PDF-').toString('base64')}}
  const created=await request('/notes','POST',data,201);id=created.data.id
  assert.equal((await request(`/notes/${id}`)).data.content,data.content)
  const stored=await prisma.note.findUniqueOrThrow({where:{id}})
  assert.equal(stored.title,data.title)
  const download=await fetch(`${base}/notes/${id}/attachment`)
  assert.equal(await download.text(),'%PDF-')
  const search=await request(`/notes?search=${encodeURIComponent(data.title)}&subject=${data.subjectCode}&grade=${data.gradeCode}&type=note&page=1&limit=1&sort=title`)
  assert.equal(search.data[0].id,id);assert.equal(search.pagination.total,1)
  const updated=await request(`/notes/${id}`,'PUT',{...data,title:data.title+' edited',content:'Updated'})
  assert.equal(updated.data.content,'Updated')
  assert.equal((await prisma.note.findUniqueOrThrow({where:{id}})).content,'Updated')
  await request('/favorites','POST',{noteId:id},201)
  bookId=`OL${Date.now()}W`
  await request('/favorites','POST',{kind:'book',id:bookId,title:'Disposable favorite verification',subtitle:'Temporary integration test'},201)
  await request('/favorites','POST',{kind:'book',id:bookId,title:'Disposable favorite verification'},201)
  assert.equal(await prisma.bookFavorite.count({where:{userId:login.data.user.id,bookId}}),1)
  assert.ok((await request('/favorites')).data.some((f:{id:string})=>f.id===bookId))
  await request(`/favorites/${bookId}?kind=book`,'DELETE')
  assert.equal(await prisma.bookFavorite.count({where:{userId:login.data.user.id,bookId}}),0)
  bookId=''
  await request('/favorites','POST',{noteId:id},201)
  assert.equal(await prisma.favorite.count({where:{noteId:id,userId:login.data.user.id}}),1)
  assert.ok((await request('/favorites')).data.some((f:{id:string})=>f.id===id))
  await request(`/favorites/${id}`,'DELETE')
  assert.equal(await prisma.favorite.count({where:{noteId:id}}),0)
  await request('/favorites','POST',{noteId:id,userId:'forged'},400)
  await request(`/notes/${id}`,'PUT',{...data,authorId:'forged'},400)
  await request('/notes','POST',{...data,gradeCode:'missing'},400)
  await request('/notes','POST',data,401,'')
  await request('/favorites','POST',{noteId:id},201)
  if(process.env.TEST_OTHER_EMAIL && process.env.TEST_OTHER_PASSWORD) {
    const other=await request('/auth/login','POST',{email:process.env.TEST_OTHER_EMAIL,password:process.env.TEST_OTHER_PASSWORD})
    const t=other.data.accessToken
    try {
      assert.notEqual(other.data.user.id,login.data.user.id)
      await request(`/notes/${id}`,'PUT',data,403,t)
      await request(`/notes/${id}`,'DELETE',undefined,403,t)
      assert.ok(!(await request('/favorites','GET',undefined,200,t)).data.some((f:{id:string})=>f.id===id))
    } finally { await request('/auth/logout','POST',undefined,200,t) }
  } else console.log('SKIP live second-account isolation: TEST_OTHER_EMAIL/TEST_OTHER_PASSWORD not configured (unit ownership test is separate).')
  await request(`/notes/${id}`,'DELETE');id=''
  assert.equal(await prisma.note.count(),originalCount)
  assert.equal(await prisma.favorite.count({where:{noteId:stored.id}}),0)
  await request(`/notes/${stored.id}`,'GET',undefined,404)
  await request('/auth/logout','POST')
  await request('/auth/refresh','POST',{refreshToken},401)
  token=''
  console.log('PASS live Prisma + PostgreSQL CRUD, attachment, search, filters, pagination, Auth, favorites, cascade, and validation.')
} finally {
  if(bookId) await prisma.bookFavorite.deleteMany({where:{userId,bookId}})
  if(id) await prisma.note.deleteMany({where:{id}})
  if(token) await request('/auth/logout','POST').catch(()=>undefined)
  server.close();await prisma.$disconnect()
}
