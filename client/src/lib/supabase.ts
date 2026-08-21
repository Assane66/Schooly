/**
 * Client Supabase Schooly — accès public soumis aux règles RLS du projet.
 */
import { createClient } from "@supabase/supabase-js";
import { supabasePublicConfig } from "./supabaseConfig";

export const supabase = createClient(
  supabasePublicConfig.url,
  supabasePublicConfig.publishableKey,
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } },
);
