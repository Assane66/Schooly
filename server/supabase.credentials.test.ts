import { describe, expect, it } from "vitest";
import { resolveSupabasePublicConfig } from "../shared/supabaseConfig";

describe("Supabase credentials", () => {
  it("accepts the configured project URL and publishable key", async () => {
    const { url, publishableKey } = resolveSupabasePublicConfig(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    );

    expect(url).toMatch(/^https:\/\/[a-z0-9-]+\.supabase\.co$/);
    expect(publishableKey).toMatch(/^(sb_publishable_|eyJ)/);

    const response = await fetch(`${url}/auth/v1/settings`, {
      headers: { apikey: publishableKey },
    });

    expect(response.ok).toBe(true);
  });
});
