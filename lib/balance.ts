// Balance the bowl: a rough check of a day's food against what a dog needs.
//
// Values are typical figures per 100 g of food as it's served, and every
// meat, organ and fish is a cooked weight: owners weigh after cooking (the
// site tells them so). Rounded from standard food tables (USDA FoodData Central and
// Indian food composition tables). They're a guide, not a lab analysis:
// real recipes, cuts and brands vary.
//
// Calories use the "modified Atwater" factors vets use for pet food:
// 3.5 kcal per gram of protein or carbohydrate, 8.5 per gram of fat.
//
// `has` marks the key nutrients a food is a meaningful source of. Packaged
// dog food is fortified, so it counts as covering the basics.

import { PRODUCTS, type Bowl } from "./content";

export type Nutrient = "taurine" | "omega3" | "calcium" | "zinc" | "vitd" | "choline";

export const NUTRIENTS: Record<Nutrient, { label: string; why: string }> = {
  taurine: { label: "Taurine", why: "Keeps the heart muscle strong. From meat, dark chicken and fish." },
  omega3: { label: "Omega-3", why: "Calms inflammation in skin, joints and brain. From oily fish." },
  calcium: { label: "Calcium", why: "Bones and teeth, and it balances the phosphorus in meat. From eggshell powder, sardines with their bones, or curd." },
  zinc: { label: "Zinc", why: "Skin, coat and immunity. From mutton, liver and eggs." },
  vitd: { label: "Vitamin D", why: "Dogs can't make it from sunlight. From oily fish, egg yolk and liver." },
  choline: { label: "Choline", why: "Liver and brain. From eggs and liver." },
};

// Ready-made toppers and what they bring, only where the store's own page
// lists it (description or ingredients, read 24 Oct 2026). Ids are
// products in lib/content.ts.
export const PRODUCT_HAS: Record<string, Nutrient[]> = {
  "dgl-mr-humpty": ["calcium"],
  "dgl-bone-legacy-chicken": ["calcium"],
  "dgl-bone-legacy-fish": ["calcium"],
  "dgl-superwoof": ["vitd", "omega3", "calcium"],
  "dgl-heart-to-heart": ["taurine", "omega3", "vitd"],
  "dgl-soft-shiny": ["omega3", "zinc"],
  "dgl-kefir": ["vitd", "calcium"],
  "dgl-sardines": ["omega3", "vitd", "calcium"],
  "dgl-anchovy-flakes": ["omega3"],
};

// The kitchen fix for each gap: one food to add to the bowl.
export const HOME_FIX: Record<Nutrient, string> = {
  taurine: "thigh",
  omega3: "sardine",
  calcium: "eggshell",
  zinc: "liver",
  vitd: "egg",
  choline: "egg",
};

// What fixes a gap: the kitchen food first, then ready-made toppers,
// in-stock ones first.
export function fixesFor(n: Nutrient) {
  const ready = PRODUCTS.filter((p) => PRODUCT_HAS[p.id]?.includes(n)).sort((a, b) => Number(!!a.soldOut) - Number(!!b.soldOut));
  return { home: food(HOME_FIX[n]), ready };
}

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
  { id: "organs", name: "Gizzard and heart", group: "Meat and eggs", unit: "100 g", grams: 100, protein: 28, fat: 5, carbs: 0, has: ["taurine", "zinc"] },
  { id: "thigh", name: "Chicken thigh (dark meat)", group: "Meat and eggs", unit: "100 g", grams: 100, protein: 26, fat: 10.9, carbs: 0, has: ["taurine", "zinc", "choline"] },
  { id: "mutton", name: "Mutton", group: "Meat and eggs", unit: "100 g", grams: 100, protein: 27, fat: 3, carbs: 0, has: ["taurine", "zinc"] },
  { id: "liver", count: true, name: "Chicken liver", group: "Meat and eggs", unit: "paw-size piece", grams: 30, protein: 24, fat: 6.5, carbs: 0.9, has: ["zinc", "vitd", "choline"] },
  { id: "egg", count: true, name: "Egg", group: "Meat and eggs", unit: "egg", grams: 50, protein: 12.6, fat: 10.6, carbs: 1.1, has: ["choline", "vitd"] },
  // Dried, finely ground shells: almost pure calcium. About half a teaspoon per 500 g of meat.
  { id: "eggshell", count: true, name: "Eggshell powder", group: "Meat and eggs", unit: "half teaspoon", grams: 2.5, protein: 0, fat: 0, carbs: 0, has: ["calcium"] },

  { id: "sardine", count: true, name: "Sardine", group: "Fish", unit: "sardine", grams: 25, protein: 25, fat: 11.5, carbs: 0, has: ["omega3", "calcium", "vitd", "taurine"] },
  { id: "bangda", name: "Mackerel (bangda)", group: "Fish", unit: "100 g", grams: 100, protein: 24, fat: 18, carbs: 0, has: ["omega3", "vitd", "taurine"] },
  { id: "whitefish", name: "White fish (rohu, basa)", group: "Fish", unit: "100 g", grams: 100, protein: 23, fat: 2.5, carbs: 0, has: ["taurine"] },
  { id: "prawns", name: "Prawns", group: "Fish", unit: "100 g", grams: 100, protein: 24, fat: 1, carbs: 0.2, has: ["taurine", "zinc"] },

  { id: "curd", name: "Curd, plain", group: "Dairy", unit: "tbsp", grams: 15, protein: 3.5, fat: 3.3, carbs: 4.7, has: ["calcium"] },
  { id: "paneer", name: "Paneer", group: "Dairy", unit: "cube (25 g)", grams: 25, protein: 18, fat: 22, carbs: 3, has: ["calcium"] },

  { id: "veg", name: "Mixed veg", group: "Veg and fruit", unit: "½ cup", grams: 75, protein: 2, fat: 0.3, carbs: 4, has: [] },
  // Single vegetables for anyone who adds them one by one (USDA values,
  // cooked unless eaten raw). "A little" ones are fine in small amounts:
  // spinach and beetroot carry oxalates, sweet potato and beetroot sugar.
  { id: "broccoli", name: "Broccoli", group: "Veg and fruit", unit: "½ cup", grams: 78, protein: 2.4, fat: 0.4, carbs: 7.2, has: [] },
  { id: "pumpkin", name: "Pumpkin", group: "Veg and fruit", unit: "½ cup", grams: 120, protein: 0.7, fat: 0.1, carbs: 4.9, has: [] },
  { id: "beans", name: "Green beans", group: "Veg and fruit", unit: "½ cup", grams: 62, protein: 1.9, fat: 0.3, carbs: 7.9, has: [] },
  { id: "celery", name: "Celery", group: "Veg and fruit", unit: "½ cup", grams: 50, protein: 0.7, fat: 0.2, carbs: 3, has: [] },
  { id: "pepper", name: "Red bell pepper", group: "Veg and fruit", unit: "½ cup", grams: 75, protein: 1, fat: 0.3, carbs: 6, has: [] },
  { id: "carrot", name: "Carrot", group: "Veg and fruit", unit: "½ cup", grams: 78, protein: 0.8, fat: 0.2, carbs: 8.2, has: [] },
  { id: "spinach", name: "Spinach (a little)", group: "Veg and fruit", unit: "¼ cup", grams: 45, protein: 3, fat: 0.3, carbs: 1.4, has: [] },
  { id: "sweetpotato", name: "Sweet potato (a little)", group: "Veg and fruit", unit: "¼ cup", grams: 50, protein: 2, fat: 0.2, carbs: 20.7, has: [], starchy: true },
  { id: "zucchini", name: "Zucchini", group: "Veg and fruit", unit: "½ cup", grams: 90, protein: 1.1, fat: 0.4, carbs: 2.7, has: [] },
  { id: "beetroot", name: "Beetroot (a little)", group: "Veg and fruit", unit: "¼ cup", grams: 40, protein: 1.7, fat: 0.2, carbs: 10, has: [], starchy: true },
  { id: "blueberry", name: "Blueberries", group: "Veg and fruit", unit: "handful", grams: 30, protein: 0.7, fat: 0.3, carbs: 14.5, has: [], starchy: true },
  { id: "apple", name: "Apple (no seeds)", group: "Veg and fruit", unit: "slice", grams: 25, protein: 0.3, fat: 0.2, carbs: 14, has: [], starchy: true },
  { id: "banana", name: "Banana", group: "Veg and fruit", unit: "½ banana", grams: 60, protein: 1.1, fat: 0.3, carbs: 23, has: [], starchy: true },

  // Flax, chia, pumpkin and sunflower seeds, ground together. ALA, not the
  // fish omega-3 the bowl checks for, so it doesn't count towards that.
  { id: "seeds", name: "Ground seed mix", group: "Fats", unit: "tsp", grams: 3, protein: 22, fat: 42, carbs: 28, has: [] },
  { id: "ghee", name: "Ghee or coconut oil", group: "Fats", unit: "tsp", grams: 5, protein: 0, fat: 100, carbs: 0, has: [] },

  { id: "kibble", name: "Packaged dog food (dry)", group: "Packaged", unit: "cup", grams: 100, protein: 25, fat: 14, carbs: 40, has: ["taurine", "omega3", "calcium", "zinc", "vitd", "choline"], starchy: true },
];

// Packaged dry food, by brand. Label values (as fed) from each brand's
// guaranteed analysis on retailer listings, read 22 Oct 2026; versions differ
// by country, so "Enter from the bag" is always there. Starch is worked out
// as 100 minus protein, fat, fibre, moisture and ash (6% if not listed).
export type Brand = { id: string; name: string; protein: number; fat: number; fibre: number; moisture: number; ash?: number };

// Packaged dry foods, with the guaranteed analysis from each label (as
// listed on Heads Up For Tails, read 26 Oct 2026, or the brand's own pack).
// Starch is worked out as whatever the label doesn't account for.
export const BRANDS: Brand[] = [
  // Hearty (Heads Up For Tails), oven-baked: from the back of each pack.
  { id: "hearty-chicken", name: "Hearty Chicken & Duck (adult)", protein: 36.2, fat: 10.7, fibre: 4.5, moisture: 11, ash: 7.8 },
  { id: "hearty-lamb", name: "Hearty Lamb & Blueberry (adult)", protein: 36.9, fat: 11.4, fibre: 4.5, moisture: 11, ash: 6.1 },
  { id: "hearty-gf", name: "Hearty Grain-Free Turkey, Fish & Chicken", protein: 30.9, fat: 18.2, fibre: 2, moisture: 9, ash: 2.8 },
  { id: "hearty-puppy", name: "Hearty Puppy, Chicken & Fish", protein: 30.7, fat: 17.9, fibre: 1.73, moisture: 5.14 }, // ash isn't on the pack
  { id: "orijen", name: "Orijen Original", protein: 38, fat: 18, fibre: 4, moisture: 12, ash: 10 }, // ash isn't on the label; set so starch matches its stated 18%
  { id: "acana-small", name: "Acana Small Breed Adult", protein: 31, fat: 17, fibre: 5, moisture: 12, ash: 7 },
  { id: "acana-large", name: "Acana Large Breed Adult", protein: 31, fat: 15, fibre: 6, moisture: 12, ash: 7 },
  { id: "farmina", name: "Farmina N&D Ancestral Grain Adult", protein: 30, fat: 18, fibre: 2.9, moisture: 9, ash: 6.8 },
  { id: "farmina-pumpkin", name: "Farmina N&D Pumpkin Chicken & Pomegranate Adult", protein: 30, fat: 18, fibre: 2.9, moisture: 9, ash: 7 },
  { id: "signature", name: "Signature Grain Zero Adult", protein: 28, fat: 16, fibre: 2.5, moisture: 10, ash: 6.6 },
  { id: "rcmaxi", name: "Royal Canin Maxi Adult", protein: 26, fat: 17, fibre: 1.3, moisture: 11, ash: 6.7 },
  { id: "totw-pacific", name: "Taste of the Wild Pacific Stream", protein: 25, fat: 15, fibre: 3, moisture: 10, ash: 8.9 },
  { id: "totw-sierra", name: "Taste of the Wild Sierra Mountain", protein: 25, fat: 15, fibre: 5, moisture: 10, ash: 8.6 },
  { id: "proplan", name: "Purina Pro Plan Medium Adult", protein: 25, fat: 15, fibre: 3, moisture: 10 }, // label gives protein and fat only; fibre and moisture are typical values
  { id: "supercoat", name: "Purina Supercoat Adult", protein: 23, fat: 10, fibre: 4, moisture: 12 },
  { id: "pedigree", name: "Pedigree Adult", protein: 21, fat: 10, fibre: 4, moisture: 12 },
  { id: "drools", name: "Drools Adult Chicken & Egg", protein: 20, fat: 10, fibre: 2.5, moisture: 10 },
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
// `id: "product"` is a ready-made topper from a store; `product` is its id.
// `suggested` marks a product added from a "Fix it" suggestion (to buy), as
// opposed to one they already give, added from the shelf.
export type Line = { key: string; id: string; grams: number; brand?: string; bag?: Omit<Brand, "id" | "name">; name?: string; kind?: Kind; product?: string; suggested?: boolean };

type Values = { name: string; protein: number; fat: number; carbs: number; starchy: boolean; has: Nutrient[] };

export function valuesOf(l: Line): Values {
  if (l.id === "kibble") {
    const b = l.bag ? { id: "bag", name: "From the bag", ...l.bag } : BRANDS.find((x) => x.id === l.brand) ?? BRANDS[BRANDS.length - 1];
    return { name: "Packaged dog food", protein: b.protein, fat: b.fat, carbs: brandStarch(b), starchy: true, has: food("kibble").has };
  }
  if (l.id === "product") {
    // Supplements and toppers: nutrients, not calories.
    const p = PRODUCTS.find((x) => x.id === l.product);
    return { name: p?.name ?? "Topper", protein: 0, fat: 0, carbs: 0, starchy: false, has: PRODUCT_HAS[l.product ?? ""] ?? [] };
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
  // Grams a day.
  grams: { protein: number; fat: number; starch: number };
  missing: Nutrient[];
  swaps: string[];
};

// Daily goals in grams for a dog needing `need` calories: about half the
// calories from protein and half from fat (The Forever Dog), and starch
// kept under a tenth of the calories.
export function goalsFor(need: number) {
  return {
    protein: Math.round((need * 0.5) / KCAL.protein),
    fat: Math.round((need * 0.5) / KCAL.fat),
    starch: Math.round((need * 0.1) / KCAL.carbs),
  };
}

// How far along a goal: "low" (red) under 60%, "near" (amber) under 85%,
// "good" (green) from there to 150%, "high" (amber) beyond. For a limit
// like starch, green while under it, amber up to twice, red beyond.
export type Level = "low" | "near" | "good" | "high";
export function levelFor(value: number, goal: number, limit = false): Level {
  const r = goal ? value / goal : 0;
  if (limit) return r <= 1 ? "good" : r <= 2 ? "near" : "low";
  return r < 0.6 ? "low" : r < 0.85 ? "near" : r <= 1.5 ? "good" : "high";
}

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
    grams: { protein: Math.round(p), fat: Math.round(f), starch: Math.round(c) },
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
  if (r.missing.includes("calcium")) out.push("Add eggshell powder (about half a teaspoon per 500 g of meat), or sardines with their soft bones, for calcium.");
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
    case "veg":
      return [L("rice", 160), L("dal", 150), L("curd", 30), L("paneer", 25)];
    case "meat":
      return [L("rice", 160), L("chicken", 150), L("veg", 75)];
    case "raw":
      return [L("thigh", 200), L("liver", 30), L("egg", 50), L("veg", 75)];
    case "mix":
      return [L("kibble", Math.round(kibble / 2 / 10) * 10), L("chicken", 100)];
    default:
      return [L("kibble", kibble)];
  }
}

// ---------- a day's bowl, by the gram ----------

// What a complete fresh bowl looks like for a healthy adult dog, after the
// complete homemade recipes in The Forever Dog (pp. 314-316, analysed on
// pp. 399-402): about 55% lean meat, 20% organs (half of it liver) and 25%
// vegetables by weight, plus ground seeds, a calcium source and oily fish.
// The book's beef recipe uses 25 g calcium carbonate in about 3.9 kg of
// food (0.65%); eggshell powder is almost all calcium carbonate, about
// 5.5 g a teaspoon. Grams are solved from the food values above so the
// bowl lands on the dog's calories. Indian foods in place of US ones are ours.
export function dietChart(kg: number, need: number) {
  const kcal = (id: string) => {
    const f = food(id);
    return (f.protein * KCAL.protein + f.fat * KCAL.fat + (f.starchy ? f.carbs * KCAL.carbs : 0)) / 100;
  };
  // 1 tsp of ground seeds (about 3 g) per 10 kg, at least half a teaspoon.
  const seedTsp = Math.max(0.5, Math.round(kg / 10 * 2) / 2);
  const seedG = seedTsp * food("seeds").grams;
  const share = { thigh: 0.55, liver: 0.1, organs: 0.1, veg: 0.25 };
  const perGram = (Object.keys(share) as (keyof typeof share)[]).reduce((t, id) => t + share[id] * kcal(id), 0);
  const rest = Math.max(0, need - seedG * kcal("seeds")) / perGram;
  const g5 = (x: number) => Math.max(5, Math.round(x / 5) * 5);
  const meat = g5(rest * share.thigh);
  const liver = g5(rest * share.liver);
  const organs = g5(rest * share.organs);
  const veg = g5(rest * share.veg);
  const total = meat + liver + organs + veg;
  // Eggshell powder in quarter teaspoons.
  const shellTsp = Math.max(0.25, Math.round(((total * 0.0065) / 5.5) * 4) / 4);
  // Oily fish a few times a week: one sardine per 9 kg (as in SKIN_FOOD).
  const sardines = Math.max(1, Math.round(kg / 9));
  return { meat, liver, organs, veg, total, seedTsp, seedG, shellTsp, shellG: Math.round(shellTsp * 5.5 * 10) / 10, sardines };
}
