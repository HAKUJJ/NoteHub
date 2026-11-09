import assert from 'node:assert/strict'
import { authClient } from '../src/lib/supabase.js'

if(!process.env.TEST_EMAIL || !process.env.TEST_PASSWORD) throw new Error('Configure TEST_EMAIL and TEST_PASSWORD in backend/.env.')
const client=authClient()
let token=''
try {
  const login=await client.auth.signInWithPassword({email:process.env.TEST_EMAIL,password:process.env.TEST_PASSWORD})
  assert.equal(login.error,null,'Supabase password sign-in failed')
  assert.ok(login.data.session)
  token=login.data.session.access_token
  const identity=await client.auth.getUser(token)
  assert.equal(identity.error,null)
  assert.equal(identity.data.user?.id,login.data.user?.id)
  const refresh=await client.auth.refreshSession({refresh_token:login.data.session.refresh_token})
  assert.equal(refresh.error,null)
  assert.ok(refresh.data.session)
  token=refresh.data.session.access_token
  const logout=await client.auth.admin.signOut(token,'local')
  assert.equal(logout.error,null,'User-token logout with publishable key failed')
  token=''
  const revoked=await authClient().auth.refreshSession({refresh_token:refresh.data.session.refresh_token})
  assert.ok(revoked.error,'A signed-out refresh session must be rejected')
  console.log('PASS real Supabase Auth password login, getUser, refresh, logout and revoked refresh. This does not test Prisma or PostgreSQL CRUD.')
} finally {if(token) await client.auth.admin.signOut(token,'local')}
