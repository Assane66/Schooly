/**
 * Configuration Supabase — accepte les deux variables attendues et corrige
 * sans exposer de secret une éventuelle permutation entre URL et clé publique.
 */
export type SupabasePublicConfig = {
  url: string;
  publishableKey: string;
};

const isSupabaseUrl = (value: string | undefined): value is string =>
  Boolean(value && /^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(value));

const isSupabasePublicKey = (value: string | undefined): value is string =>
  Boolean(value && /^(sb_publishable_|eyJ)/.test(value));

export function resolveSupabasePublicConfig(
  primaryUrl: string | undefined,
  primaryKey: string | undefined,
): SupabasePublicConfig {
  const candidates = [primaryUrl, primaryKey];
  const url = candidates.find(isSupabaseUrl) ?? "https://ljvnnpwwmhzdctvflsxb.supabase.co";
  const publishableKey = candidates.find(isSupabasePublicKey);

  if (!url || !publishableKey) {
    throw new Error("La configuration publique Supabase est incomplète.");
  }

  return { url, publishableKey };
}
