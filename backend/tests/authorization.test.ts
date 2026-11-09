import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { User } from '@supabase/supabase-js'
import { assertOwnership } from '../src/middleware/auth.js'

test('ownership uses verified UUID and ignores editable user_metadata role',()=>{
  const owner='00000000-0000-4000-8000-000000000001'
  const other='00000000-0000-4000-8000-000000000002'
  const user=(id:string,app_metadata={},user_metadata={}): User=>({id,app_metadata,user_metadata,aud:'authenticated',created_at:''})
  assertOwnership(owner,user(owner))
  assert.throws(()=>assertOwnership(owner,user(other,{}, {role:'admin'})),{status:403})
  assertOwnership(owner,user(other,{role:'admin'}))
})
