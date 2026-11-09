import 'dotenv/config'

const developmentOrigins = process.env.NODE_ENV === 'production' ? [] : ['http://localhost:5173','http://localhost:5174','http://localhost:5175']

export const config = {
  port: Number(process.env.PORT || 3000),
  origins: [...new Set([...developmentOrigins,...(process.env.CORS_ORIGIN || '').split(',').map(origin=>origin.trim()).filter(Boolean)])],
  databaseUrl: process.env.DATABASE_URL || '',
  supabaseUrl: process.env.SUPABASE_URL || 'https://jrpjqgmuigjdgqjkxwrd.supabase.co',
  supabaseKey: process.env.SUPABASE_PUBLISHABLE_KEY || '',
}
