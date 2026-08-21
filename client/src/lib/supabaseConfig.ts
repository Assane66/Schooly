/**
 * Configuration du client Schooly — valeurs publiques Supabase seulement.
 */
import { resolveSupabasePublicConfig } from "@shared/supabaseConfig";

export const supabasePublicConfig = resolveSupabasePublicConfig(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);
