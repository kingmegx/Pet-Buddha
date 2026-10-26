// The questions: breeds, weights and ages. Edit copy here, not in the UI.
// What the owner sees after the questions lives in lib/content.ts.

// Which head drawing a dog gets. Five breeds have their own; every other
// breed and every mix uses the "mixed" head.
export type FaceId = "golden" | "gsd" | "beagle" | "indie" | "shihtzu" | "mixed";

export type Breed = {
  name: string;
  face: FaceId;
  // Typical adult weight range in kg. A rough guide only: it pre-fills the
  // weight question and the owner corrects it.
  kg: [number, number];
};

// The five tiles on the breed screen, in the order they spring in.
export const POPULAR: Breed[] = [
  { name: "Beagle", face: "beagle", kg: [15, 16] },
  { name: "German Shepherd", face: "gsd", kg: [25, 40] },
  { name: "Golden Retriever", face: "golden", kg: [25, 34] },
  { name: "Indie", face: "indie", kg: [15, 25] },
  { name: "Shih Tzu", face: "shihtzu", kg: [4, 8] },
];

export const MIXED: Breed = { name: "Mixed or not sure", face: "mixed", kg: [12, 22] };

// Found by typing in the search box. Weight ranges are rough adult guides.
const SEARCHABLE: [string, number, number][] = [
  ["Labrador Retriever", 25, 36],
  ["Pug", 6, 9],
  ["Pomeranian", 2, 4],
  ["Indian Spitz", 5, 12],
  ["Rottweiler", 35, 55],
  ["Dobermann", 30, 45],
  ["Dachshund", 7, 14],
  ["Cocker Spaniel", 12, 16],
  ["Siberian Husky", 16, 27],
  ["Boxer", 25, 32],
  ["Great Dane", 45, 70],
  ["Lhasa Apso", 5, 8],
  ["Chihuahua", 1, 3],
  ["French Bulldog", 8, 13],
  ["Dalmatian", 20, 30],
  ["Saint Bernard", 55, 70],
  ["Maltese", 2, 4],
  ["Yorkshire Terrier", 2, 4],
  ["Poodle", 20, 30],
  ["Toy Poodle", 2, 4],
  ["Border Collie", 14, 20],
  ["Bulldog", 18, 25],
  ["Pit Bull", 14, 27],
  ["Rajapalayam", 22, 30],
  ["Mudhol Hound", 22, 28],
  ["Chippiparai", 15, 20],
  ["Kombai", 14, 25],
  ["Belgian Malinois", 20, 30],
  ["Cavalier King Charles Spaniel", 5, 8],
  ["Jack Russell Terrier", 5, 8],
];

export const BREEDS: Breed[] = [...POPULAR, ...SEARCHABLE.map(([name, lo, hi]) => ({ name, face: "mixed" as const, kg: [lo, hi] as [number, number] })).sort((a, b) => a.name.localeCompare(b.name))];

// Breeds whose name contains what was typed, best matches first.
export function searchBreeds(typed: string, limit = 5) {
  const q = typed.trim().toLowerCase();
  if (!q) return [];
  const hits = BREEDS.filter((b) => b.name.toLowerCase().includes(q));
  hits.sort((a, b) => Number(b.name.toLowerCase().startsWith(q)) - Number(a.name.toLowerCase().startsWith(q)));
  return hits.slice(0, limit);
}

export const WEIGHT_RANGE: [number, number] = [1, 70];

// Age slider stops, in months: finer for puppies, then every year from 2 to 18.
export const AGE_STOPS = [2, 3, 4, 5, 6, 8, 10, 12, 18, ...Array.from({ length: 17 }, (_, i) => (i + 2) * 12)];

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

export type AgeBand = "puppy" | "adolescent" | "adult" | "senior";

export function ageBand(months: number): AgeBand {
  if (months < 6) return "puppy";
  if (months < 18) return "adolescent";
  if (months < 84) return "adult";
  return "senior";
}

export const BAND_NAME: Record<AgeBand, string> = { puppy: "puppy", adolescent: "teenage dog", adult: "adult dog", senior: "senior dog" };
