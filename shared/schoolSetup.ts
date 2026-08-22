export const SCHOOL_CYCLES = [
  {
    id: "primary",
    label: "Élémentaire",
    detail: "CI, CP, CE1, CE2, CM1, CM2",
    classes: ["CI", "CP", "CE1", "CE2", "CM1", "CM2"],
  },
  {
    id: "middle_school",
    label: "Collège",
    detail: "6e, 5e, 4e, 3e",
    classes: ["6e", "5e", "4e", "3e"],
  },
  {
    id: "high_school",
    label: "Lycée",
    detail: "Seconde, Première, Terminale · séries S et L",
    classes: ["Seconde S", "Seconde L", "Première S", "Première L", "Terminale S", "Terminale L"],
  },
] as const;

export type SchoolCycleId = (typeof SCHOOL_CYCLES)[number]["id"];

export type SchoolClassDraft = {
  id: string;
  cycleId: SchoolCycleId;
  level: string;
  name: string;
};

export type SchoolySignupDraft = {
  director: {
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    country: string;
  };
  school: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    country: string;
  };
  educationLevels: SchoolCycleId[];
  classes: SchoolClassDraft[];
};

export function suggestedClassesFor(levels: SchoolCycleId[]): SchoolClassDraft[] {
  return SCHOOL_CYCLES
    .filter((cycle) => levels.includes(cycle.id))
    .flatMap((cycle) => cycle.classes.map((name) => ({
      id: `${cycle.id}-${name.toLowerCase().replaceAll(" ", "-")}`,
      cycleId: cycle.id,
      level: cycle.label,
      name,
    })));
}

export function syncClassesForCycles(current: SchoolClassDraft[], levels: SchoolCycleId[]): SchoolClassDraft[] {
  const suggested = suggestedClassesFor(levels);
  const byId = new Map(current.map((item) => [item.id, item]));
  const suggestedIds = new Set(suggested.map((item) => item.id));
  const suggestedWithEdits = suggested.map((item) => byId.get(item.id) ?? item);
  const retainedCustom = current.filter((item) => levels.includes(item.cycleId) && !suggestedIds.has(item.id));
  return [...suggestedWithEdits, ...retainedCustom];
}

export function isSchoolySignupDraft(value: unknown): value is SchoolySignupDraft {
  if (!value || typeof value !== "object") return false;
  const draft = value as Partial<SchoolySignupDraft>;
  return Boolean(
    draft.director &&
    draft.school &&
    Array.isArray(draft.educationLevels) &&
    Array.isArray(draft.classes) &&
    typeof draft.school.name === "string",
  );
}
