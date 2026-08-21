import { describe, expect, it } from "vitest";
import { resolveSupabasePublicConfig } from "./supabaseConfig";

describe("resolveSupabasePublicConfig", () => {
  it("uses the direct URL and publishable key when they are correctly assigned", () => {
    expect(
      resolveSupabasePublicConfig(
        "https://ljvnnpwwmhzdctvflsxb.supabase.co",
        "sb_publishable_example",
      ),
    ).toEqual({
      url: "https://ljvnnpwwmhzdctvflsxb.supabase.co",
      publishableKey: "sb_publishable_example",
    });
  });

  it("recovers a publishable key when it was supplied in the URL variable", () => {
    expect(
      resolveSupabasePublicConfig("sb_publishable_example", undefined),
    ).toEqual({
      url: "https://ljvnnpwwmhzdctvflsxb.supabase.co",
      publishableKey: "sb_publishable_example",
    });
  });

  it("rejects a configuration that contains no public key", () => {
    expect(() => resolveSupabasePublicConfig(undefined, undefined)).toThrow(
      "La configuration publique Supabase est incomplète.",
    );
  });
});
