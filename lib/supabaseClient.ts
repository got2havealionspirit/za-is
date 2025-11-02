"use client";

import { createBrowserClient } from "@supabase/supabase-js";

export const createSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase environment variables are not configured");
  }

  return createBrowserClient(supabaseUrl, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true
    }
  });
};

export const supabaseClient = createSupabaseClient();
