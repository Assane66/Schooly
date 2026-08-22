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

const OWNER_PLATFORM_EMAIL = "baalhassane522@gmail.com";

/** Vérifie le rôle plateforme côté Supabase et reconnaît le compte propriétaire explicitement désigné. */
export async function hasPlatformAdminRole() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data, error } = await supabase.rpc("is_platform_admin");
  if (!error && data === true) return true;
  return user.email?.trim().toLowerCase() === OWNER_PLATFORM_EMAIL;
}
