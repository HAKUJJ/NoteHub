import { createClient } from '@supabase/supabase-js'
import { config } from '../config/env.js'

// Each login gets an isolated client; no shared mutable Auth sessions.
export const authClient = () => createClient(config.supabaseUrl, config.supabaseKey || 'configuration-required', {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
})
