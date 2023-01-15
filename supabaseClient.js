import AsyncStorage from '@react-native-async-storage/async-storage'
// import {AsyncStorage} from 'react-native';
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mhtzqkkrssrxagqjbpdd.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1odHpxa2tyc3NyeGFncWpicGRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzM2NTIxNzAsImV4cCI6MTk4OTIyODE3MH0.zj9DBJvSQbeeP0DI87mpqNIY5pAh4wyGBq_RCSfSauc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})