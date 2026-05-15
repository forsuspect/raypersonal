import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kywyuntjwvmuvucwoqjf.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_xpP-AuvWgYodIems8ZbcOA_8vC-U_6I'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
