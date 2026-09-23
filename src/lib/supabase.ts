import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

interface GlobalWithCloudflare {
  __CLOUDFLARE_ENV__?: {
    VITE_SUPABASE_URL?: string;
    VITE_SUPABASE_ANON_KEY?: string;
  };
}

const cloudflareEnv = (globalThis as unknown as GlobalWithCloudflare).__CLOUDFLARE_ENV__;

// Environment variable resolution for Vite, TanStack Start (SSR), and Cloudflare
const rawUrl =
  (typeof import.meta !== "undefined" &&
    (import.meta.env?.VITE_SUPABASE_URL || import.meta.env?.SUPABASE_URL)) ||
  (typeof process !== "undefined" &&
    (process.env?.VITE_SUPABASE_URL || process.env?.SUPABASE_URL)) ||
  cloudflareEnv?.VITE_SUPABASE_URL ||
  "";

const rawKey =
  (typeof import.meta !== "undefined" &&
    (import.meta.env?.VITE_SUPABASE_ANON_KEY || import.meta.env?.SUPABASE_ANON_KEY)) ||
  (typeof process !== "undefined" &&
    (process.env?.VITE_SUPABASE_ANON_KEY || process.env?.SUPABASE_ANON_KEY)) ||
  cloudflareEnv?.VITE_SUPABASE_ANON_KEY ||
  "";

// Fallback dummy credentials when Supabase is not yet configured, preventing app crashes during development
const FALLBACK_URL = "https://placeholder-project.supabase.co";
const FALLBACK_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder";

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  rawUrl !== FALLBACK_URL &&
  !rawUrl.includes("placeholder-project") &&
  rawUrl.startsWith("http"),
);

const supabaseUrl = isSupabaseConfigured ? rawUrl : FALLBACK_URL;
const supabaseAnonKey = isSupabaseConfigured ? rawKey : FALLBACK_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: typeof window !== "undefined",
    autoRefreshToken: typeof window !== "undefined",
  },
});
