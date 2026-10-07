// All onboarding content lives here: breeds, the "need help with" chips and
// the one follow-up question each need unlocks. Edit copy here, not in the UI.

export type Species = "dog" | "cat";
export type BreedId = "golden" | "gsd" | "beagle" | "indie" | "shihtzu" | "indie-cat";

export type Breed = {
  id: BreedId;
  species: Species;
  name: string;
  typicalKg: number;
};

export const BREEDS: Breed[] = [
  { id: "golden", species: "dog", name: "Golden Retriever", typicalKg: 30 },
  { id: "gsd", species: "dog", name: "German Shepherd", typicalKg: 32 },
  { id: "beagle", species: "dog", name: "Beagle", typicalKg: 11 },
  { id: "indie", species: "dog", name: "Indie", typicalKg: 20 },
  { id: "shihtzu", species: "dog", name: "Shih Tzu", typicalKg: 6 },
  { id: "indie-cat", species: "cat", name: "Indie cat", typicalKg: 4 },
];

export const WEIGHT_RANGE: Record<Species, [number, number]> = {
  dog: [1, 60],
  cat: [1, 10],
};

// Age slider stops, in months.
export const AGE_STOPS = [2, 3, 4, 5, 6, 8, 10, 12, 18, 24, 36, 48, 60, 72, 84, 96, 120, 144, 180];

export function formatAge(months: number) {
  if (months < 1) return "under 1 month";
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const y = years === 1 ? "1 year" : `${years} years`;
  const m = rest === 1 ? "1 month" : `${rest} months`;
  if (years === 0) return m;
  return rest === 0 ? y : `${y} ${m}`;
}

// Whole months between a date of birth ("YYYY-MM-DD") and today.
// Returns null for an empty, invalid or future date.
export function monthsSince(dob: string, today = new Date()) {
  const [y, m, d] = dob.split("-").map(Number);
  if (!y || !m || !d) return null;
  const born = new Date(y, m - 1, d);
  if (Number.isNaN(born.getTime()) || born > today) return null;
  let months = (today.getFullYear() - y) * 12 + (today.getMonth() - (m - 1));
  if (today.getDate() < d) months -= 1;
  return Math.max(0, months);
}

export type NeedId = "food" | "biting" | "potty" | "leash" | "energy" | "products";

export type Need = {
  id: NeedId;
  label: string;
  // Not every need has a follow-up; some need no extra detail.
  followUp?: { question: (pet: string) => string; options: string[] };
};

export const NEEDS: Need[] = [
  {
    id: "food",
    label: "Food",
    followUp: {
      question: (pet) => `What does your ${pet} eat now?`,
      options: ["Dry kibble", "Wet food", "Home-cooked", "Raw", "A mix"],
    },
  },
  {
    id: "biting",
    label: "Biting & chewing",
  },
  {
    id: "potty",
    label: "Potty training",
    followUp: {
      question: (pet) => `How long is your ${pet} left alone?`,
      options: ["Rarely", "2–4 hours", "4–8 hours", "8+ hours"],
    },
  },
  {
    id: "leash",
    label: "Leash training",
    followUp: {
      question: () => "What happens on walks?",
      options: ["Pulls ahead", "Refuses to move", "Lunges at things", "Haven't started"],
    },
  },
  {
    id: "energy",
    label: "Energy & exercise",
    followUp: {
      question: (pet) => `How much exercise does your ${pet} get a day?`,
      options: ["Under 30 min", "30–60 min", "1–2 hours", "2+ hours"],
    },
  },
  {
    id: "products",
    label: "Products",
    followUp: {
      question: () => "What are you shopping for?",
      options: ["Toys", "Grooming", "Beds & crates", "Treats"],
    },
  },
];
