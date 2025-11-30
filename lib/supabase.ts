import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.warn('Supabase environment variables are missing. Database features will fail at runtime.')
}

export const supabase = createClient(supabaseUrl ?? '', serviceRoleKey ?? '', {
  auth: { autoRefreshToken: false, persistSession: false },
})
