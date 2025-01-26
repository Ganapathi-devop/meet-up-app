import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

import { Database } from "~/types/supabase";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://yupsqfzcywjxaeowchkc.supabase.co";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1cHNxZnpjeXdqeGFlb3djaGtjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcyOTEwMjksImV4cCI6MjA1Mjg2NzAyOX0.PzG1KtZrQ-wTJiXyfnNRpxP1-oY6YvslFRDJlYCuxJY";
const superbaseServiceRoleKey = process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1cHNxZnpjeXdqeGFlb3djaGtjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzI5MTAyOSwiZXhwIjoyMDUyODY3MDI5fQ.kMfG8gazm0QpMgVXqnE5eoqV9_MYHrEdwC9ZKuGAZl8";

export const supabase = createClient<Database>(supabaseUrl, superbaseServiceRoleKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});