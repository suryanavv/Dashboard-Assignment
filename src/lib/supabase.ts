// Import the Supabase client builder
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL  ?? ''
const supabaseKey = process.env.VITE_SUPABASE_ANON  ?? ''

// Create and export Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseKey)
