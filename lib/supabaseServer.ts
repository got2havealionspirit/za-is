import { cookies, headers } from "next/headers";
import { createServerClient } from "@supabase/supabase-js";

export const createSupabaseServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error("Supabase environment variables are not configured");
  }

  return createServerClient(supabaseUrl, anonKey, {
    cookies: {
      getAll: () => cookies().getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookies().set(name, value, options));
        } catch (error) {
          console.error("Error setting cookies", error);
        }
      }
    },
    headers: {
      get: (key) => headers().get(key) ?? undefined
    }
  });
};
