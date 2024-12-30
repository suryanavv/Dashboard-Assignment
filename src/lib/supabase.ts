// Import the Supabase client builder
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON

// Create and export Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseKey)
