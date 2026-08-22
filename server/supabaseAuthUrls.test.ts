import { describe, expect, it } from "vitest";
import { buildSchoolyAuthEmailRedirect } from "../shared/supabaseAuthUrls";

describe("buildSchoolyAuthEmailRedirect", () => {
  it("construit le retour public de confirmation directeur", () => {
    expect(buildSchoolyAuthEmailRedirect("https://schoolysaas-cd9yrqmb.manus.space", "confirm"))
      .toBe("https://schoolysaas-cd9yrqmb.manus.space/connexion?mode=confirm");
  });

  it("conserve l’entrée supervision lors d’une réinitialisation plateforme", () => {
    expect(buildSchoolyAuthEmailRedirect("https://schoolysaas-cd9yrqmb.manus.space/", "reset", true))
      .toBe("https://schoolysaas-cd9yrqmb.manus.space/connexion?mode=reset&role=platform");
  });
});
