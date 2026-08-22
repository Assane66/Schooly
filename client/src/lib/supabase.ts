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

/** Enregistre une action métier sans interrompre le parcours utilisateur si le journal n’est pas encore activé. */
export async function recordSchoolyActivity(input: { schoolId?: string | null; action: string; summary: string; metadata?: Record<string, unknown> }) {
  const { error } = await supabase.rpc("log_schooly_activity", {
    p_school_id: input.schoolId ?? null,
    p_action: input.action,
    p_summary: input.summary,
    p_metadata: input.metadata ?? {},
  });
  if (error) console.warn("Journal d’activité Schooly indisponible", error.message);
}
