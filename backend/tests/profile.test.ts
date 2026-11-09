import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { AddressInfo } from 'node:net'
import { app } from '../src/app.js'
import { prisma } from '../src/lib/prisma.js'
import { config } from '../src/config/env.js'

test('avatar updates use verified identity, persist in /me and reject extra fields', async (t) => {
  const request = globalThis.fetch
  const user = {id:'00000000-0000-4000-8000-000000000001',email:'profile@example.com',aud:'authenticated',app_metadata:{},user_metadata:{display_name:'Profile'},created_at:''}
  let avatar: string | null = null
  const image = 'data:image/jpeg;base64,' + Buffer.from([0xff,0xd8,0xff,0xe0,0xff,0xd9]).toString('base64')
  const profile = () => ({id:user.id,displayName:'Profile',avatar,createdAt:new Date()})
  t.mock.method(globalThis, 'fetch', async (input: string | URL | Request, init?: RequestInit) => {
    if (String(input).startsWith(`${config.supabaseUrl}/auth/v1/user`)) return Response.json(user)
    return request(input, init)
  })
  const update = t.mock.fn(async (args: {where:{id:string};data:{avatar:string}}) => {
    assert.equal(args.where.id, user.id)
    avatar = args.data.avatar
    return profile()
  })
  const originalProfile = prisma.profile
  Object.defineProperty(prisma, 'profile', {configurable:true,value:{upsert:async () => profile(),update}})
  t.after(() => Object.defineProperty(prisma, 'profile', {configurable:true,value:originalProfile}))
  const server = app.listen(0)
  t.after(async () => {server.close(); await prisma.$disconnect()})
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/auth/me`
  const headers = {'Content-Type':'application/json',Authorization:'Bearer test-token'}
  const saved = await request(base, {method:'PATCH',headers,body:JSON.stringify({avatar:image})})
  assert.equal(saved.status, 200)
  assert.equal((await saved.json()).data.avatar, image)
  const reloaded = await request(base, {headers})
  assert.equal(reloaded.status, 200)
  assert.equal((await reloaded.json()).data.avatar, image)
  for (const body of [{avatar:image,id:'another-user'},{avatar:image,role:'admin'},{avatar:'data:image/svg+xml;base64,PHN2Zz4='},{}]) {
    const invalid = await request(base, {method:'PATCH',headers,body:JSON.stringify(body)})
    assert.equal(invalid.status, 400)
  }
  assert.equal(update.mock.callCount(), 1)
})
