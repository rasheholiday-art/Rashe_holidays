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
const metaEnv = typeof import.meta !== "undefined" ? (import.meta.env as Record<string, string | undefined>) : undefined;
const procEnv = typeof process !== "undefined" ? (process.env as Record<string, string | undefined>) : undefined;

const rawUrl =
  metaEnv?.["VITE_SUPABASE_URL"] ||
  metaEnv?.["SUPABASE_URL"] ||
  procEnv?.["VITE_SUPABASE_URL"] ||
  procEnv?.["SUPABASE_URL"] ||
  cloudflareEnv?.VITE_SUPABASE_URL ||
  "";

const rawKey =
  metaEnv?.["VITE_SUPABASE_ANON_KEY"] ||
  metaEnv?.["SUPABASE_ANON_KEY"] ||
  procEnv?.["VITE_SUPABASE_ANON_KEY"] ||
  procEnv?.["SUPABASE_ANON_KEY"] ||
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
