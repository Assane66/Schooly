export type SchoolyAuthEmailFlow = "confirm" | "reset";

/** Construit les retours approuvés par Supabase pour les e-mails Schooly. */
export function buildSchoolyAuthEmailRedirect(
  origin: string,
  flow: SchoolyAuthEmailFlow,
  isPlatformEntry = false,
) {
  const url = new URL("/connexion", origin);
  url.searchParams.set("mode", flow);
  if (isPlatformEntry) url.searchParams.set("role", "platform");
  return url.toString();
}
