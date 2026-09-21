import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://xbxsahlvzehgydgltkuy.supabase.co";

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "sb_publishable_8o10RqMdgq_AfdIHT7FaLg_XdSxujAN";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);