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

/** Vérifie le rôle plateforme côté Supabase, sans dépendre d’une lecture directe RLS. */
export async function hasPlatformAdminRole() {
  const { data, error } = await supabase.rpc("is_platform_admin");
  return !error && data === true;
}
