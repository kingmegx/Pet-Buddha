// Balance the bowl: a rough check of a day's food against what a dog needs.
//
// Values are typical figures per 100 g of food as it's served (cooked where
// it's cooked), rounded from standard food tables (USDA FoodData Central and
// Indian food composition tables). They're a guide, not a lab analysis:
// real recipes, cuts and brands vary.
//
// Calories use the "modified Atwater" factors vets use for pet food:
// 3.5 kcal per gram of protein or carbohydrate, 8.5 per gram of fat.
//
// `has` marks the key nutrients a food is a meaningful source of. Packaged
// dog food is fortified, so it counts as covering the basics.

import type { Bowl } from "./content";

export type Nutrient = "taurine" | "omega3" | "calcium" | "zinc" | "vitd" | "choline";

export const NUTRIENTS: Record<Nutrient, { label: string; why: string }> = {
  taurine: { label: "Taurine", why: "Keeps the heart muscle strong. From meat, dark chicken and fish." },
  omega3: { label: "Omega-3", why: "Calms inflammation in skin, joints and brain. From oily fish." },
  calcium: { label: "Calcium", why: "Bones and teeth, and it balances the phosphorus in meat. From curd, paneer or fish with bones." },
  zinc: { label: "Zinc", why: "Skin, coat and immunity. From mutton, liver and eggs." },
  vitd: { label: "Vitamin D", why: "Dogs can't make it from sunlight. From oily fish, egg yolk and liver." },
  choline: { label: "Choline", why: "Liver and brain. From eggs and liver." },
};

export type Food = {
  id: string;
  name: string;
  group: "Grains and dal" | "Meat and eggs" | "Fish" | "Dairy" | "Veg and fruit" | "Fats" | "Packaged";
  // One serving, as people measure it at home, used for the starting bowl
  // and for "about 2 eggs" hints. Amounts in the bowl are in grams.
  unit: string;
  grams: number;
  // Countable foods step by one piece; the rest by 10 g.
  count?: boolean;
  // Per 100 g.
  protein: number;
  fat: number;
  carbs: number;
  has: Nutrient[];
  // Counted as starch or sugar (grains, dal, fruit), not fibre.
  starchy?: boolean;
};

export const FOODS: Food[] = [
  { id: "rice", name: "Rice, cooked", group: "Grains and dal", unit: "cup", grams: 160, protein: 2.7, fat: 0.3, carbs: 28, has: [], starchy: true },
  { id: "roti", count: true, name: "Roti", group: "Grains and dal", unit: "roti", grams: 40, protein: 9.6, fat: 3.7, carbs: 46, has: [], starchy: true },
  { id: "dal", name: "Dal, cooked", group: "Grains and dal", unit: "katori", grams: 150, protein: 9, fat: 0.4, carbs: 20, has: [], starchy: true },
  { id: "oats", name: "Oats, cooked", group: "Grains and dal", unit: "cup", grams: 230, protein: 2.5, fat: 1.5, carbs: 12, has: [], starchy: true },

  { id: "chicken", name: "Chicken breast", group: "Meat and eggs", unit: "100 g", grams: 100, protein: 31, fat: 3.6, carbs: 0, has: ["choline"] },
  { id: "thigh", name: "Chicken thigh (dark meat)", group: "Meat and eggs", unit: "100 g", grams: 100, protein: 26, fat: 10.9, carbs: 0, has: ["taurine", "zinc", "choline"] },
  { id: "mutton", name: "Mutton", group: "Meat and eggs", unit: "100 g", grams: 100, protein: 27, fat: 3, carbs: 0, has: ["taurine", "zinc"] },
  { id: "liver", count: true, name: "Chicken liver", group: "Meat and eggs", unit: "paw-size piece", grams: 30, protein: 24, fat: 6.5, carbs: 0.9, has: ["zinc", "vitd", "choline"] },
  { id: "egg", count: true, name: "Egg", group: "Meat and eggs", unit: "egg", grams: 50, protein: 12.6, fat: 10.6, carbs: 1.1, has: ["choline", "vitd"] },

  { id: "sardine", count: true, name: "Sardine", group: "Fish", unit: "sardine", grams: 25, protein: 25, fat: 11.5, carbs: 0, has: ["omega3", "calcium", "vitd", "taurine"] },
  { id: "bangda", name: "Mackerel (bangda)", group: "Fish", unit: "100 g", grams: 100, protein: 24, fat: 18, carbs: 0, has: ["omega3", "vitd", "taurine"] },
  { id: "whitefish", name: "White fish (rohu, basa)", group: "Fish", unit: "100 g", grams: 100, protein: 20, fat: 2, carbs: 0, has: ["taurine"] },
  { id: "prawns", name: "Prawns", group: "Fish", unit: "100 g", grams: 100, protein: 24, fat: 1, carbs: 0.2, has: ["taurine", "zinc"] },

  { id: "curd", name: "Curd, plain", group: "Dairy", unit: "tbsp", grams: 15, protein: 3.5, fat: 3.3, carbs: 4.7, has: ["calcium"] },
  { id: "paneer", name: "Paneer", group: "Dairy", unit: "cube (25 g)", grams: 25, protein: 18, fat: 22, carbs: 3, has: ["calcium"] },

  { id: "veg", name: "Mixed veg (gobhi, beans, carrot)", group: "Veg and fruit", unit: "½ cup", grams: 75, protein: 2, fat: 0.3, carbs: 4, has: [] },
  { id: "pumpkin", name: "Pumpkin, cooked", group: "Veg and fruit", unit: "½ cup", grams: 120, protein: 0.7, fat: 0.1, carbs: 4.9, has: [] },
  { id: "spinach", name: "Palak, cooked", group: "Veg and fruit", unit: "½ cup", grams: 90, protein: 3, fat: 0.3, carbs: 1.4, has: [] },
  { id: "banana", name: "Banana", group: "Veg and fruit", unit: "½ banana", grams: 60, protein: 1.1, fat: 0.3, carbs: 23, has: [], starchy: true },

  { id: "ghee", name: "Ghee or coconut oil", group: "Fats", unit: "tsp", grams: 5, protein: 0, fat: 100, carbs: 0, has: [] },

  { id: "kibble", name: "Packaged dog food (dry)", group: "Packaged", unit: "cup", grams: 100, protein: 25, fat: 14, carbs: 40, has: ["taurine", "omega3", "calcium", "zinc", "vitd", "choline"], starchy: true },
];

// Packaged dry food, by brand. Label values (as fed) from each brand's
// guaranteed analysis on retailer listings, read 22 Oct 2026; versions differ
// by country, so "Enter from the bag" is always there. Starch is worked out
// as 100 minus protein, fat, fibre, moisture and ash (6% if not listed).
export type Brand = { id: string; name: string; protein: number; fat: number; fibre: number; moisture: number; ash?: number };

export const BRANDS: Brand[] = [
  { id: "pedigree", name: "Pedigree Adult", protein: 21, fat: 10, fibre: 4, moisture: 12 },
  { id: "drools", name: "Drools Adult Chicken & Egg", protein: 20, fat: 10, fibre: 2.5, moisture: 10 },
  { id: "supercoat", name: "Purina Supercoat Adult", protein: 23, fat: 10, fibre: 4, moisture: 12 },
  { id: "rcmaxi", name: "Royal Canin Maxi Adult", protein: 26, fat: 17, fibre: 1.3, moisture: 11, ash: 6.7 },
  { id: "farmina", name: "Farmina N&D Ancestral Grain", protein: 30, fat: 18, fibre: 2.9, moisture: 9 },
  { id: "typical", name: "Not sure / another brand", protein: 25, fat: 14, fibre: 3, moisture: 10 },
];

export const brandStarch = (b: Brand) => Math.max(0, 100 - b.protein - b.fat - b.fibre - b.moisture - (b.ash ?? 6));

// "Something else": foods typed in by name, valued by what they mostly are.
export type Kind = "meat" | "fish" | "egg" | "grain" | "dal" | "dairy" | "veg" | "fruit" | "fat" | "treat";

export const KINDS: Record<Kind, { label: string; protein: number; fat: number; carbs: number; starchy?: boolean; has: Nutrient[] }> = {
  meat: { label: "Meat", protein: 26, fat: 10, carbs: 0, has: ["taurine", "zinc"] },
  fish: { label: "Fish or seafood", protein: 22, fat: 5, carbs: 0, has: ["taurine"] },
  egg: { label: "Egg", protein: 12.6, fat: 10.6, carbs: 1.1, has: ["choline", "vitd"] },
  grain: { label: "Grain, roti, rice or potato", protein: 4, fat: 2, carbs: 28, starchy: true, has: [] },
  dal: { label: "Dal or beans", protein: 8, fat: 1, carbs: 20, starchy: true, has: [] },
  dairy: { label: "Milk, curd or paneer", protein: 5, fat: 5, carbs: 4, has: ["calcium"] },
  veg: { label: "Vegetable", protein: 2, fat: 0.3, carbs: 4, has: [] },
  fruit: { label: "Fruit", protein: 1, fat: 0.3, carbs: 15, starchy: true, has: [] },
  fat: { label: "Oil, ghee or butter", protein: 0, fat: 100, carbs: 0, has: [] },
  treat: { label: "Biscuit or packaged treat", protein: 7, fat: 15, carbs: 70, starchy: true, has: [] },
};

// A first guess at the kind from the name people type.
const GUESS: [RegExp, Kind][] = [
  [/biscuit|marie|parle|cookie|treat|cake/i, "treat"],
  [/egg|anda/i, "egg"],
  [/fish|prawn|shrimp|sardine|bangda|mackerel|rohu|basa|tuna|salmon|crab/i, "fish"],
  [/chicken|mutton|goat|lamb|beef|buff|pork|meat|keema|liver|heart|kidney|gizzard|turkey|duck/i, "meat"],
  [/dal|rajma|chana|chole|moong|masoor|soya|soy|bean|lentil|sprout/i, "dal"],
  [/curd|dahi|milk|paneer|cheese|yog|chaas|buttermilk/i, "dairy"],
  [/\b(ghee|oil|butter)\b/i, "fat"],
  [/banana|apple|papaya|mango|melon|fruit|guava|chikoo|pear|berr/i, "fruit"],
  [/rice|roti|chapati|bread|poha|upma|idli|dosa|oat|khichdi|aloo|potato|ragi|bajra|jowar|pasta|noodle|sooji|rava/i, "grain"],
  [/carrot|gobhi|cauliflower|palak|spinach|pumpkin|lauki|cucumber|beet|broccoli|veg|peas|tinda|bhindi|okra|zucchini/i, "veg"],
];

export const guessKind = (name: string): Kind => GUESS.find(([re]) => re.test(name))?.[1] ?? "veg";

export const food = (id: string) => FOODS.find((f) => f.id === id)!;

const KCAL = { protein: 3.5, fat: 8.5, carbs: 3.5 };

// One thing in the bowl, in grams. Packaged food carries its brand (or the
// numbers typed from the bag); "Something else" carries a name and a kind.
export type Line = { key: string; id: string; grams: number; brand?: string; bag?: Omit<Brand, "id" | "name">; name?: string; kind?: Kind };

type Values = { name: string; protein: number; fat: number; carbs: number; starchy: boolean; has: Nutrient[] };

export function valuesOf(l: Line): Values {
  if (l.id === "kibble") {
    const b = l.bag ? { id: "bag", name: "From the bag", ...l.bag } : BRANDS.find((x) => x.id === l.brand) ?? BRANDS[BRANDS.length - 1];
    return { name: "Packaged dog food", protein: b.protein, fat: b.fat, carbs: brandStarch(b), starchy: true, has: food("kibble").has };
  }
  if (l.id === "custom") {
    const k = KINDS[l.kind ?? "veg"];
    return { name: l.name || k.label, protein: k.protein, fat: k.fat, carbs: k.carbs, starchy: !!k.starchy, has: k.has };
  }
  const f = food(l.id);
  return { name: f.name, protein: f.protein, fat: f.fat, carbs: f.carbs, starchy: !!f.starchy, has: f.has };
}

export type Result = {
  kcal: number;
  // Share of calories, 0..100.
  protein: number;
  fat: number;
  starch: number;
  missing: Nutrient[];
  swaps: string[];
};

export function analyse(lines: Line[], need: number): Result {
  let p = 0;
  let f = 0;
  let c = 0;
  const covered = new Set<Nutrient>();
  for (const l of lines) {
    if (l.grams <= 0) continue;
    const v = valuesOf(l);
    const g = l.grams / 100;
    p += v.protein * g;
    f += v.fat * g;
    // Only grains, dal, fruit and treats count as starch or sugar; veg carbs are mostly fibre.
    if (v.starchy) c += v.carbs * g;
    v.has.forEach((n) => covered.add(n));
  }
  const pk = p * KCAL.protein;
  const fk = f * KCAL.fat;
  const ck = c * KCAL.carbs;
  const kcal = Math.round(pk + fk + ck);
  const pct = (x: number) => (kcal ? Math.round((x / kcal) * 100) : 0);
  const res: Result = {
    kcal,
    protein: pct(pk),
    fat: pct(fk),
    starch: pct(ck),
    missing: (Object.keys(NUTRIENTS) as Nutrient[]).filter((n) => !covered.has(n)),
    swaps: [],
  };
  res.swaps = swapsFor(lines, res, need);
  return res;
}

// Up to three plain, Indian-kitchen fixes, most important first.
function swapsFor(lines: Line[], r: Result, need: number): string[] {
  const out: string[] = [];
  const has = (id: string) => lines.some((l) => l.id === id && l.grams > 0);
  const starchiest = lines
    .filter((l) => l.grams > 0 && l.id !== "kibble" && valuesOf(l).starchy)
    .sort((a, b) => valuesOf(b).carbs * b.grams - valuesOf(a).carbs * a.grams)[0];

  if (r.starch > 20 && starchiest) out.push(`Swap half the ${valuesOf(starchiest).name.split(",")[0].toLowerCase()} for chicken thigh, mutton or an egg.`);
  else if (r.starch > 20 && has("kibble")) out.push("Swap a quarter of the packaged food for fresh meat or eggs. That brings the starch down fast.");
  if (r.missing.includes("omega3")) out.push("Add a sardine or a piece of bangda two or three times a week, for omega-3.");
  if (r.missing.includes("taurine")) out.push("Use dark chicken meat (thigh) instead of breast, or add fish, for taurine.");
  if (r.missing.includes("calcium")) out.push("Add a spoon of plain curd, or sardines with their soft bones, for calcium.");
  if (r.missing.includes("choline") || r.missing.includes("zinc")) out.push("Add an egg, or a paw-sized piece of liver a day, for choline and zinc.");
  if (r.fat < 30 && r.starch <= 20) out.push("Keep some fat on the meat, or add a teaspoon of ghee or coconut oil. Dogs run on fat.");
  if (need && r.kcal > need * 1.15) out.push(`It's about ${Math.round(((r.kcal - need) / need) * 100)}% more than they need in a day. Trim the portions a little.`);
  if (need && r.kcal && r.kcal < need * 0.85) out.push(`It's about ${Math.round(((need - r.kcal) / need) * 100)}% less than they need in a day. Add a little more meat or egg.`);
  return out.slice(0, 3);
}

// A starting bowl for each answer, in grams, so the page never opens empty.
let n = 0;
export const lineKey = () => `l${++n}`;

export function startingBowl(bowl: Bowl | null, need: number): Line[] {
  // About 350 kcal in 100 g of dry food; rounded to 10 g.
  const kibble = Math.max(50, Math.round(need / 3.5 / 10) * 10);
  const L = (id: string, grams: number): Line => ({ key: lineKey(), id, grams, ...(id === "kibble" ? { brand: "typical" } : {}) });
  switch (bowl) {
    case "home":
      return [L("rice", 160), L("dal", 150), L("curd", 30), L("chicken", 100)];
    case "fresh":
      return [L("thigh", 200), L("egg", 50), L("veg", 75)];
    case "mix":
      return [L("kibble", Math.round(kibble / 2 / 10) * 10), L("chicken", 100)];
    default:
      return [L("kibble", kibble)];
  }
}
