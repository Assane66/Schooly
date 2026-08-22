import { describe, expect, it } from "vitest";
import { suggestedClassesFor, syncClassesForCycles } from "../shared/schoolSetup";

describe("school setup suggestions", () => {
  it("propose uniquement les classes des trois cycles Schooly v1", () => {
    expect(suggestedClassesFor(["primary", "middle_school", "high_school"]).map((item) => item.name)).toEqual([
      "CI", "CP", "CE1", "CE2", "CM1", "CM2",
      "6e", "5e", "4e", "3e",
      "Seconde S", "Seconde L", "Première S", "Première L", "Terminale S", "Terminale L",
    ]);
  });

  it("préserve les renommages et retire les classes d’un cycle désélectionné", () => {
    const initial = suggestedClassesFor(["primary", "middle_school"]);
    initial[0] = { ...initial[0], name: "CI A" };
    expect(syncClassesForCycles(initial, ["primary"])).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: "primary-ci", name: "CI A" }),
    ]));
    expect(syncClassesForCycles(initial, ["primary"]).some((item) => item.cycleId === "middle_school")).toBe(false);
  });
});
