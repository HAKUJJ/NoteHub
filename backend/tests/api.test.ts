import assert from 'node:assert/strict'
import { after, before, test } from 'node:test'
import type { AddressInfo } from 'node:net'
import { app } from '../src/app.js'
import { prisma } from '../src/lib/prisma.js'
import { noteInput, integer, uuid } from '../src/validators/input.js'

const server=app.listen(0)
let base=''
before(()=>{base=`http://127.0.0.1:${(server.address() as AddressInfo).port}/api`})
after(async()=>{server.close();await prisma.$disconnect()})
test('health and JSON 404',async()=>{
  const r=await fetch(`${base}/health`)
  assert.equal(r.status,200)
  assert.deepEqual(await r.json(),{success:true,message:'NotesHub API is running'})
  const missing=await fetch(`${base}/missing`)
  assert.equal(missing.status,404)
  assert.equal((await missing.json()).success,false)
})
test('CORS allows the Vite fallback port and authorization preflight, but excludes unlisted origins',async()=>{
  const origin='http://localhost:5175'
  const r=await fetch(`${base}/health`,{headers:{Origin:origin}})
  assert.equal(r.headers.get('access-control-allow-origin'),origin)
  const preflight=await fetch(`${base}/notes`,{method:'OPTIONS',headers:{Origin:origin,'Access-Control-Request-Method':'POST','Access-Control-Request-Headers':'authorization,content-type'}})
  assert.equal(preflight.status,204)
  assert.equal(preflight.headers.get('access-control-allow-origin'),origin)
  assert.match(preflight.headers.get('access-control-allow-headers') ?? '',/authorization/i)
  const denied=await fetch(`${base}/health`,{headers:{Origin:'https://unlisted.example'}})
  assert.equal(denied.headers.get('access-control-allow-origin'),null)
})
test('protected routes reject missing identity before database access',async()=>{
  for(const [path,method] of [['/notes','POST'],['/notes/31912001-0000-4000-8000-000000000001','PUT'],['/notes/31912001-0000-4000-8000-000000000001','DELETE'],['/favorites','GET'],['/favorites','POST'],['/favorites/31912001-0000-4000-8000-000000000001','DELETE'],['/auth/me','GET'],['/auth/logout','POST']]) {
    const r=await fetch(base+path,{method})
    assert.equal(r.status,401,`${method} ${path}`)
  }
})
test('bad UUID, query and JSON return 400',async()=>{
  for(const path of ['/notes/not-a-uuid','/notes?page=0','/notes?limit=101','/notes?sort=unsafe','/notes?grade=m99','/notes?type=invalid']) {
    assert.equal((await fetch(base+path)).status,400,path)
  }
  const r=await fetch(`${base}/auth/login`,{method:'POST',headers:{'Content-Type':'application/json'},body:'{'})
  assert.equal(r.status,400)
})
test('validation refuses forged ownership, malformed fields and attachments',()=>{
  const input={title:'Example',subjectCode:'math',gradeCode:'m4',type:'note'}
  assert.equal(noteInput(input).title,'Example')
  for(const patch of [{authorId:'forged'},{title:' '},{type:'script'},{subjectCode:[]},{content:42},{attachment:{name:'x.html',type:'text/html',size:1,data:'YQ==' }},{attachment:{name:'x.pdf',type:'application/pdf',size:5,data:'YQ==' }}]) {
    assert.throws(()=>noteInput({...input,...patch}))
  }
  assert.throws(()=>uuid('1'))
  assert.throws(()=>integer(['1'],1,100))
})
