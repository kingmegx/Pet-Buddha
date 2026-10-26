// Everything the owner reads after the questions. Meghna owns this file.
//
// DRAFT: entries marked `draft: true` were written by Claude as a starting
// point and have not been checked by Meghna. The site shows a small "Draft"
// tag beside them. Rewrite the text, then delete the `draft: true` line.

import type { AgeBand } from "./flow";

export type Sex = "boy" | "girl";

// ---------- what do you need help with? ----------

export type ProblemId = "chew" | "busy" | "settle" | "nip" | "toilet" | "pull" | "bark" | "alone" | "mark" | "night" | "itch" | "ticks" | "coat" | "tummy" | "picky" | "weight" | "joints";

export type Problem = {
  id: ProblemId;
  label: string;
  // Age bands where this is common enough to be ticked for the owner.
  common: AgeBand[];
  // Which written guide answers it. Problems without one show as "still being written".
  //   calm   – sniffing and chewing (biting, chewing and restlessness all go here)
  //   toilet – toilet training (accidents and marking indoors)
  //   steps  – short tips in lib/plan.ts (pulling, barking, being alone)
//   body   – the Food and Skin tabs in lib/plan.ts
  guide?: "calm" | "toilet" | "steps" | "body";
  // Asked on the food step ("Anything about their body?") instead of with the behaviours.
  body?: boolean;
  draft?: boolean;
};

export const PROBLEMS: Problem[] = [
  // The three chips confirmed in the PRD.
  { id: "chew", label: "Chews everything", common: ["puppy", "adolescent"], guide: "calm" },
  { id: "busy", label: "Always wants something to do", common: ["puppy", "adolescent", "adult"], guide: "calm" },
  { id: "settle", label: "Can't settle", common: ["adolescent", "adult"], guide: "calm" },
  // Drafted: both the wording and the ages they are ticked for.
  { id: "nip", label: "Nips and mouths hands", common: ["puppy"], guide: "calm", draft: true },
  { id: "toilet", label: "Toilet accidents indoors", common: ["puppy"], guide: "toilet", draft: true },
  { id: "pull", label: "Pulls on the lead", common: ["adolescent"], guide: "steps", draft: true },
  { id: "bark", label: "Barks a lot", common: [], guide: "steps", draft: true },
  { id: "alone", label: "Struggles when left alone", common: [], guide: "steps", draft: true },
  { id: "mark", label: "Marks indoors or humps", common: [], guide: "toilet", draft: true },
  { id: "night", label: "Restless at night", common: ["senior"], guide: "calm", draft: true },
  // Asked on the food step. Answered in the Food and Skin tabs (lib/plan.ts).
  { id: "itch", label: "Itchy skin", common: [], guide: "body", body: true, draft: true },
  { id: "ticks", label: "Ticks and fleas", common: [], guide: "body", body: true, draft: true },
  { id: "coat", label: "Shedding or smelly coat", common: [], guide: "body", body: true, draft: true },
  { id: "tummy", label: "Upset tummy", common: [], guide: "body", body: true, draft: true },
  { id: "picky", label: "Picky eater", common: [], guide: "body", body: true, draft: true },
  { id: "weight", label: "Carrying extra weight", common: [], guide: "body", body: true, draft: true },
  { id: "joints", label: "Joint care", common: ["senior"], guide: "body", body: true, draft: true },
];

// What is in the bowl now. Asked on the food step.
// "Fresh" means cooked fresh, at home or by a fresh-food kitchen.
export type Bowl = "kibble" | "veg" | "meat" | "raw" | "mix";
export const BOWLS: { id: Bowl; label: string }[] = [
  { id: "kibble", label: "Packaged (kibble)" },
  { id: "veg", label: "Fresh vegetarian" },
  { id: "meat", label: "Fresh, meat-based" },
  { id: "raw", label: "Raw" },
  { id: "mix", label: "A mix" },
];

// What the owner can tick on the food question; more than one is fine.
// "A mix" isn't offered: ticking packaged and a fresh food is the mix.
export const FOOD_CHOICES = BOWLS.filter((b) => b.id !== "mix");

// The one bowl the advice is written for, from what they ticked. Packaged
// with anything fresh is a mix; fresh foods together lean to meat, then raw.
export function bowlFor(foods: Bowl[]): Bowl | null {
  if (foods.length === 0) return null;
  if (foods.length === 1) return foods[0];
  if (foods.includes("kibble")) return "mix";
  if (foods.includes("meat")) return "meat";
  if (foods.includes("raw")) return "raw";
  return foods[0];
}

// "packaged (kibble) and fresh, meat-based", for the dog's card.
export function foodsLabel(foods: Bowl[]) {
  const names = FOOD_CHOICES.filter((b) => foods.includes(b.id)).map((b) => b.label.toLowerCase());
  return names.length < 2 ? names[0] ?? null : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

// Saved before foods could be ticked together: one bowl, maybe "mix".
export function foodsFromBowl(bowl: Bowl | null): Bowl[] {
  if (!bowl) return [];
  return bowl === "mix" ? ["kibble", "meat"] : [bowl];
}

// Bowls that are already fresh: the advice is about making them complete.
export const FRESH_BOWLS: Bowl[] = ["veg", "meat", "raw"];

export function commonProblems(band: AgeBand) {
  return PROBLEMS.filter((p) => p.common.includes(band)).map((p) => p.id);
}

// ---------- the Calm my dog guide ----------

export const CALM = {
  why: {
    title: "A tired dog is a happy dog",
    body: "Tired does not have to mean a longer walk. Sniffing is mentally stimulating for dogs, and a few minutes spent nosing out treats can leave them calmer and ready to rest.",
  },
  stages: [
    { word: "Sniff", line: "Hunting for hidden treats puts their nose to work." },
    { word: "Think", line: "Working things out by smell is real mental effort." },
    { word: "Settle", line: "After a good brain workout, it is easier to switch off." },
  ],
  // One line per problem, shown under the heading so the owner sees why this guide is for them.
  forProblem: {
    chew: { text: "Chewing is how dogs explore and wind down. Give the urge a job, and the furniture gets a rest.", draft: true },
    busy: { text: "A dog that is always asking for something to do usually needs to use their brain, not just their legs.", draft: true },
    settle: { text: "Settling is easier after a task that has a clear end, like finding every last treat.", draft: true },
  } as Partial<Record<ProblemId, { text: string; draft?: boolean }>>,
  diy: {
    title: "The sock trick",
    steps: ["Take a clean old sock.", "Drop a few treats or pieces of kibble inside.", "Roll it up, or tie a loose knot.", "Hand it over and let them sniff the treats out."],
    caution: "Stay with them while they play, and take it away if they start chewing off pieces of fabric.",
  },
  // What to steer clear of, by age.
  avoid: {
    puppy: { text: "Puppy teeth and tummies are delicate. Skip very hard chews, and anything small enough to swallow whole.", draft: true },
    adolescent: { text: "Teenage jaws are strong and impatient. Skip toys they can shred and swallow in one sitting.", draft: true },
    adult: { text: "Match the toy to their size. Anything that fits entirely inside their mouth is too small.", draft: true },
    senior: { text: "Older teeth can be worn or sore. Skip very hard chews and keep sniffing games easy to win.", draft: true },
  } as Record<AgeBand, { text: string; draft?: boolean }>,
  professional: "If your dog seems distressed, hurts themselves or shows aggression, talk to a vet or a trainer.",
  nextStep: "Tonight, before dinner: one sock, five treats, two minutes.",
};

// ---------- when they chew or bite the wrong thing ----------

// Meghna's own advice. Shown when the owner ticks chewing or nipping.
// Only the `note` on the first rule was added by Claude.
export const HOUSE_RULES = {
  title: "When they chew the wrong thing",
  lead: "Give the chewing somewhere to go, make the furniture boring, and reward the good stuff.",
  rules: [
    {
      word: "Make it taste bad",
      line: "Spray apple cider vinegar on the furniture they go for. Neem oil works too.",
      note: "Mix the vinegar half and half with water, try it on a hidden patch first, and never spray the dog.",
      noteDraft: true,
    },
    { word: "Catch them in the act", line: "Say a stern \"No\" only when you catch them doing it. Scolding later is pointless: they don't remember what they did." },
    { word: "Never hit", line: "A firm word is all it takes. Please don't hit your dog." },
    { word: "Reward the good", line: "Every time they choose their own toy or chew, praise them and give them a treat." },
  ],
};

// ---------- toilet training ----------

// Meghna's own advice. Shown when the owner ticks toilet accidents or
// marking indoors. Two ways in, depending on the owner's day.
export const TOILET = {
  title: "Toilet training",
  lead: "Positive reinforcement all the way. Reward them for going in the right place, every single time.",
  paths: [
    {
      id: "pads",
      label: "Pee pads",
      forWho: "For apartments, and for anyone who has to leave their dog alone for long stretches.",
      // Short names for each step, shown on the road.
      titles: ["Pad on the spot", "Learn their timing", "Say \"go pee\"", "Treat on the pad", "Move it slowly"],
      steps: [
        "Put a pee pad on the spot where they last peed, so they can sniff it and go there again.",
        "Puppies pee often. In a few days you'll have an idea of how long they go between pees.",
        "Around the time they're due, take them to the pad and keep repeating \"go pee\".",
        "If they go on the pad, or even near it, give them a treat. If not, go back to step 1.",
        "Once they use the pad every time, slowly move it towards where you want it. They'll follow it there.",
      ],
    },
    {
      id: "outside",
      label: "Going outside",
      forWho: "For anyone who can take their dog out when they need to go.",
      titles: ["Out after meals", "Go out often", "Reward outside", "Keep at it"],
      steps: [
        "Take them out around the times they're likely to go. Puppies usually poop right after eating.",
        "Go every time you think they might. It takes time, and that's fine.",
        "When they go outside, reward them straight away with a treat and a \"good boy\" or \"good girl\".",
        "Keep at it. Slowly they understand that outside is the place to go.",
      ],
    },
  ],
  // Shown when marking indoors is ticked.
  mark: { text: "Marking indoors is handled the same way: catch them in the act with a stern \"No\", take them to the right spot, and reward them when they go there.", draft: true },
  trainer: { name: "Zak George", url: "https://www.youtube.com/@zakgeorge", line: "A dog trainer on YouTube who teaches with rewards. Good to follow for toilet training and much more." },
};

// ---------- the other guides ----------

// Pulling, barking and being alone are answered in short tips in lib/plan.ts.

// ---------- why a walk is not enough ----------

// DRAFT, written by Claude for Meghna to correct. The page lets the owner tap
// each activity and see what it does: how much it tires the body, how much it
// works the mind, and how calm the dog is afterwards (0 to 3 each). The
// levels are a simple picture of the idea, not measurements.
export type Activity = { id: string; label: string; body: number; mind: number; calm: number; mood: "up" | "down"; title: string; text: string };

export const ACTIVITIES: Activity[] = [
  {
    id: "walk",
    label: "A walk",
    body: 2,
    mind: 1,
    calm: 1,
    mood: "up",
    title: "Good for the body. Not enough on its own.",
    text: "They need their walks. But walking is exercise, and exercise builds fitness. The same loop every day makes a fitter dog who comes home with energy to spare, not a calmer one.",
  },
  {
    id: "fetch",
    label: "Fetch and zoomies",
    body: 3,
    mind: 1,
    calm: 0,
    mood: "up",
    title: "Tiring, but it winds them up first.",
    text: "Chasing is exciting. It gets a dog worked up, and a worked-up dog takes a while to come back down. Fun in small doses, and the opposite of what a restless dog needs before bed.",
  },
  {
    id: "sniff",
    label: "Sniffing",
    body: 1,
    mind: 3,
    calm: 3,
    mood: "down",
    title: "Hard work for the brain, done slowly.",
    text: "Smell is how a dog reads the world. Following a scent takes real concentration, and they do it head down, at their own pace. A few minutes of it can leave them readier to rest than a much longer walk.",
  },
  {
    id: "chew",
    label: "Chewing and licking",
    body: 0,
    mind: 2,
    calm: 3,
    mood: "down",
    title: "How dogs settle themselves.",
    text: "Chewing and licking are steady, repetitive and absorbing, and dogs do them lying down. It is how many dogs wind down on their own. Give that urge something safe, and the sofa leg stops being the answer.",
  },
];

export const WHY = {
  title: "Why a walk alone won't calm them",
  lead: "A tired dog is a happy dog. But there is more than one kind of tired. Tap each one to see what it does.",
  scales: ["Tires the body", "Works the mind", "Calm afterwards"],
  // What to actually do, in order.
  plan: [
    { word: "Slow the walk", line: "Let them stop and sniff. Ten slow minutes of their choosing can do more than thirty at your pace." },
    { word: "Make food a job", line: "Hide part of a meal so they have to hunt for it, instead of emptying a bowl in a minute." },
    { word: "Give them a chew", line: "Something safe to work on, lying down, when you need them to switch off." },
  ],
  draft: true,
};

// ---------- what to look for, and where to find it ----------

// Photos, names and prices are each store's own, shown with their permission
// and read from their sites on the date below. Prices drift, so the page says
// so. "From the store" facts (age limits, feeding amounts, who it is not for)
// come from the product pages. Everything else is a DRAFT in Meghna's voice,
// written by Claude for Meghna to correct.
export const CHECKED = "13 Oct 2026";

export const STORES = {
  ftlod: { name: "For the Love of Dog", url: "https://fortheloveofdog.co.in", shops: "" },
  huft: { name: "Heads Up For Tails", url: "https://headsupfortails.com", shops: "https://headsupfortails.com/pages/stores" },
  cc: { name: "Canine Craving", url: "https://www.caninecraving.com", shops: "" },
  bitd: { name: "Back in the Day", url: "https://backintheday.in", shops: "" },
  hpo: { name: "Happy Puppy Organics", url: "https://happypuppyorganics.com", shops: "" },
  nutkit: { name: "Nutkit", url: "https://www.nutkit.co.in", shops: "" },
  dgl: { name: "Doggiliciouus", url: "https://doggiliciouus.com", shops: "" },
  amazon: { name: "Amazon", url: "https://www.amazon.in", shops: "" },
};

// sniff, puzzle and chew are brain toys; soothe, wash, inside and ticks are
// for skin and coat.
export type KindId = "sniff" | "puzzle" | "chew" | "soothe" | "wash" | "inside" | "ticks" | "gaps" | "joints" | "gut" | "picky" | "slim" | "calm";

export const KINDS: { id: KindId; label: string; lead: string; lookFor: string[]; skip: string; draft?: boolean }[] = [
  {
    id: "sniff",
    label: "Something to sniff out",
    lead: "Food hidden in fabric, so they have to find it by smell.",
    lookFor: ["Soft fleece with folds or pockets to hide dry food in.", "Big enough that they cannot swallow it.", "Easy to make harder as they get quicker."],
    skip: "Anything they treat as a chew toy. It is for feeding, then it goes away.",
    draft: true,
  },
  {
    id: "puzzle",
    label: "Something to lick or solve",
    lead: "A puzzle to work out, or a surface to lick food off.",
    lookFor: ["Food-safe material you can wash.", "One simple move to start with: slide, nudge or lick.", "For lick mats, a texture that makes soft food last."],
    skip: "A puzzle that is too hard too soon. If they give up or start biting it, make it easier.",
    draft: true,
  },
  {
    id: "chew",
    label: "Something to chew",
    lead: "A chew that lasts, for when you need them to settle.",
    lookFor: ["The right size: too big to swallow whole.", "A hardness that suits their teeth. Softer for puppies and older dogs.", "One ingredient you recognise."],
    skip: "Leaving them alone with it. Take away the last small piece before they can gulp it.",
    draft: true,
  },
  {
    id: "soothe",
    label: "For hot spots and small wounds",
    lead: "Something to calm angry, itchy patches and help small scrapes heal.",
    lookFor: ["Plant-based, with nothing harsh or perfumed.", "Safe if they lick a little of it.", "Easy to dab on a small patch."],
    skip: "Anything for deep, oozing or spreading wounds: that's a vet visit.",
  },
  {
    id: "wash",
    label: "Gentle washes",
    lead: "A bath that cleans without stripping the skin's own oils.",
    lookFor: ["No harsh detergents, colours or perfume.", "Made for dogs, not people.", "Rinses out fully."],
    skip: "Human shampoo, and bathing more than every 3 to 4 weeks.",
  },
  {
    id: "inside",
    label: "From the inside",
    lead: "Small daily extras that support the skin through food.",
    lookFor: ["One plain ingredient you recognise.", "A clear amount to start with.", "Added to food, not forced."],
    skip: "Starting several at once: you won't know what helped.",
  },
  {
    id: "ticks",
    label: "For ticks",
    lead: "Natural sprays, powders and balms that make your dog less inviting to ticks and fleas.",
    lookFor: ["Plant-based, with no synthetic pesticides.", "Light enough to use before every walk."],
    skip: "Relying on a spray alone. Check for ticks after every walk.",
  },
  // Food tab: ready-made toppers, by what the bowl or the dog needs.
  {
    id: "gaps",
    label: "To fill the gaps",
    lead: "Ready-made toppers for what home bowls most often miss.",
    lookFor: ["Whole-food ingredients.", "Clear about what it adds.", "Nothing synthetic."],
    skip: "Stacking several multivitamins. One good one, for a reason, is plenty.",
  },
  {
    id: "joints",
    label: "For joints",
    lead: "Support for stiff, ageing or hard-working joints, from the inside.",
    lookFor: ["Glucosamine, chondroitin or collagen.", "Omega-3 to calm inflammation.", "Made for dogs, dosed by weight."],
    skip: "Human joint supplements: the doses and sweeteners can be wrong for dogs.",
  },
  {
    id: "gut",
    label: "For the gut",
    lead: "Gentle help for a tummy that's off, and for keeping it settled.",
    lookFor: ["Probiotics with prebiotic fibre.", "Simple, soothing ingredients.", "Easy to add to any meal."],
    skip: "Changing food fast while the gut settles. Go slowly.",
  },
  {
    id: "picky",
    label: "For fussy eaters",
    lead: "Strong-smelling toppers that make the bowl worth eating.",
    lookFor: ["Real meat or fish.", "A strong smell.", "A sprinkle, not a meal."],
    skip: "Piling on more and more treats: they learn to wait for something better.",
  },
  {
    id: "slim",
    label: "For weight loss",
    lead: "Support for a steady weight-loss plan.",
    lookFor: ["Fibre that keeps them full.", "Used alongside smaller portions."],
    skip: "Using it instead of cutting portions.",
  },
  {
    id: "calm",
    label: "To help them feel calm",
    lead: "Calming sprays and supplements for noise, visitors, travel and time alone.",
    lookFor: ["Gentle plant ingredients.", "Sprayed near them, never in the face.", "Used alongside training, not instead of it."],
    skip: "Relying on a spray alone. Being left, and loud noises, are things they learn to cope with slowly.",
  },
];

export type Dose = { unit: "scoop" | "tsp"; times: string; puppy?: string };

// "about 2 scoops, twice a day" for a dog of this weight.
export function doseFor(d: Dose, kg: number) {
  const n = Math.min(4, Math.max(0.25, Math.round((kg / 10) * 4) / 4));
  const whole = Math.floor(n);
  const part = ["", "¼", "½", "¾"][Math.round((n - whole) * 4)];
  const unit = d.unit === "scoop" ? (n > 1 ? "scoops" : "scoop") : "tsp";
  return `about ${whole || ""}${part} ${unit}, ${d.times}`;
}

export type Product = {
  id: string;
  kind: KindId;
  store: keyof typeof STORES;
  name: string;
  price: string;
  // The store's own photo, loaded from the store's server. Empty when the
  // store has none: the card shows a paw sticker instead.
  image: string;
  path: string;
  // One line on the card.
  plain: string;
  why: string;
  // First steps for a new owner.
  start: string[];
  caution: string;
  // Hidden for dogs younger or older than this.
  fromMonths?: number;
  untilMonths?: number;
  // Shown as a warning, and moved to the end, when the owner ticked this problem.
  notFor?: { problem: ProblemId; note: string };
  // Shown as a small tag when the store had it out of stock when we checked.
  soldOut?: boolean;
  // Other shelves it also belongs on (e.g. Scooby-dub-dub for ticks too).
  also?: KindId[];
  // The store's feeding guide, where it has one. Doggiliciouus doses go up
  // in step with weight: about one unit per 10 kg, from ¼ up to 4.
  dose?: Dose;
  draft?: boolean;
};

const FTLOD = "https://cdn.shopify.com/s/files/1/0687/7744/3573/files/";
const HUFT = "https://cdn.shopify.com/s/files/1/0086/0795/7054/";
const CC = "https://cdn.shopify.com/s/files/1/0717/7401/1701/files/";

export const PRODUCTS: Product[] = [
  // ---- sniff ----
  {
    id: "sniffer-mat",
    kind: "sniff",
    store: "ftlod",
    name: "Sniffer Mat",
    price: "Rs. 1,499",
    image: FTLOD + "Sniffer-Mat-1-600x600.png?v=1711994161",
    path: "/products/sniffer-mats",
    plain: "A thick fleece mat. You hide dry food between the layers and they forage for it.",
    why: "It turns a meal into ten minutes of nose work. Good for slowing down a fast eater, and the easiest place to start.",
    start: ["Hide treats and dry food between the layers.", "Let them sniff and snack their way through it."],
    caution: "It is a feeding mat, not a chew. Put it away after each use.",
    notFor: { problem: "chew", note: "The store says it is not suitable for heavy chewers, and suggests the Sniffer Ball instead." },
    draft: true,
  },
  {
    id: "sniffer-ball",
    kind: "sniff",
    store: "ftlod",
    name: "Sniffer Ball",
    price: "From Rs. 899",
    image: FTLOD + "1-3-600x600_2_6c3794b5-d531-40fe-9668-9e445daae198.png?v=1712407089",
    path: "/products/sniffer-ball",
    plain: "A soft fleece ball with treats hidden in its folds.",
    why: "It rolls away as they nose at it, so it keeps a busy dog working for longer. The store calls it soft yet durable, and a mid-level puzzle.",
    start: ["Hide a few treats in the folds."],
    caution: "Stay nearby, and stop if they start tearing the fleece instead of sniffing.",
    fromMonths: 4,
    draft: true,
  },
  {
    id: "snuffle-pouch",
    kind: "sniff",
    store: "ftlod",
    name: "Snuffle Pouch",
    price: "Rs. 699",
    image: FTLOD + "SNUFFLEPOUCH.gif?v=1730040269",
    path: "/products/snuffle-pouch",
    plain: "A light pouch with a drawstring. Tighten it to make the hunt harder.",
    why: "Small enough to carry, so you can settle them at a cafe or a friend's house. You set the difficulty with the string.",
    start: ["Hide treats among the strips.", "Tighten the drawstring to make the game harder, loosen it to make it easier."],
    caution: "Do not leave them alone with the drawstring.",
    draft: true,
  },
  // ---- lick or solve ----
  {
    id: "huft-slide-seek",
    kind: "puzzle",
    store: "huft",
    name: "Slide & Seek Puzzle",
    price: "Rs. 1,019",
    image: HUFT + "files/DSC_4604copy.jpg?v=1772099775",
    path: "/products/huft-slide-seek-puzzle-interactive-toy-for-dog-multicolor",
    plain: "Three rollers that slide open to show hidden treats.",
    why: "One simple move to learn, then repeat. A good first puzzle for a dog who has never had one.",
    start: ["Hide treats under the three rollers.", "Let them slide the rollers open to find them.", "Rinse with mild soap and dry completely before the next use."],
    caution: "It is hard plastic. Take it away if they try to chew it open instead.",
    draft: true,
  },
  {
    id: "huft-koala-lick",
    kind: "puzzle",
    store: "huft",
    name: "Curious Koala lick mat",
    price: "Rs. 949",
    image: HUFT + "files/DSC_4176.jpg?v=1787815548",
    path: "/products/dash-dog-curious-koala-interactive-toy-for-dog-grey",
    plain: "A soft koala with a textured lick mat in the middle.",
    why: "Licking is one of the calmest things a dog can do. Spread something soft on it for bath time, nail trims, or the hour before bed.",
    start: ["Spread peanut butter, yoghurt, wet food or a favourite treat across the lick mat.", "Let them slowly lick it clean.", "Wash under running water with mild soap and dry it completely."],
    caution: "Check what you spread. Peanut butter must be free of xylitol, which is poisonous to dogs.",
    draft: true,
  },
  {
    id: "kong-extreme",
    kind: "puzzle",
    store: "huft",
    name: "KONG Extreme",
    price: "From Rs. 989",
    image: HUFT + "products/KONGExtremeChewInteractiveDogToy.jpg?v=1757406804",
    path: "/products/kong-extreme-dog-toy",
    plain: "A tough rubber toy you stuff with food. Made for strong chewers.",
    why: "Part chew, part puzzle. Stuffed and frozen, it can keep a determined chewer busy long after a snuffle toy would be in pieces.",
    start: ["Stuff it with treats.", "Freeze it stuffed to make the challenge last longer.", "Supervise play, and put it away afterwards."],
    caution: "Buy the right size. One that is too small can get stuck or be swallowed.",
    draft: true,
  },
  // ---- chew ----
  {
    id: "huft-yakies",
    kind: "chew",
    store: "huft",
    name: "Yakies chew bone",
    price: "From Rs. 129",
    image: HUFT + "files/HUFTYakiesVegetarianNaturalChewBone_1.jpg?v=1757399446",
    path: "/products/huft-yakies-vegetarian-organic-chew-bone",
    plain: "A hard, long-lasting vegetarian chew.",
    why: "It takes real time to get through, which is the point. No meat, so it is an easy first chew for many homes.",
    start: ["Always supervise while they chew.", "Keep fresh water out."],
    caution: "It is very hard. Not for puppies still on baby teeth, or older dogs with worn or sore teeth.",
    fromMonths: 6,
    untilMonths: 96,
    draft: true,
  },
  {
    id: "cc-chicken-feet",
    kind: "chew",
    store: "cc",
    name: "Dehydrated chicken feet",
    price: "Rs. 299 for 10",
    image: CC + "DehydratedChickenFeet_FP.jpg?v=1683700429",
    path: "/products/canine-craving-dehydrated-chicken-feet-1-pcs",
    plain: "A crunchy, single-ingredient chew. Gone in a few minutes.",
    why: "A quick chew for a quick settle. Softer and shorter than a bone, so a gentler place to start.",
    start: ["Day 1: give one piece, somewhere calm and undisturbed.", "Day 2: a break. Watch for any tummy upset, and give nothing new.", "Day 3 on: if all went well, 2 to 4 pieces a day.", "Throw away any leftover pieces."],
    caution: "Stay with them, and throw away any leftover pieces.",
    draft: true,
  },
  {
    id: "cc-trachea",
    kind: "chew",
    store: "cc",
    name: "Dehydrated buffalo trachea",
    price: "Rs. 599",
    image: CC + "DehydratedBuffaloTrachea_FP.jpg?v=1683700297",
    path: "/products/canine-craving-dehydrated-buffalo-trachea-1-pcs",
    plain: "A chewy tube that lasts longer than feet, and is softer than bone.",
    why: "The middle option: longer than a snack, without the hardness of a bone.",
    start: ["Day 1: give one piece, somewhere calm and undisturbed.", "Day 2: a break. Watch for any tummy upset, and give nothing new.", "Day 3 on: if all went well, one piece a day.", "Throw away any leftover pieces."],
    caution: "Take it away when it is small enough to swallow whole.",
    draft: true,
  },
  {
    id: "cc-buffalo-bone",
    kind: "chew",
    store: "cc",
    name: "Meatless buffalo bone",
    price: "From Rs. 249",
    image: CC + "DehydratedMeatlessBuffaloBone_S__FP.jpg?v=1683701648",
    path: "/products/canine-craving-dehydrated-meatless-buffalo-bone-1pcs",
    plain: "A dried bone for adult dogs who chew hard.",
    why: "The longest-lasting chew here. For a grown dog who gets through everything else in minutes.",
    start: ["Day 1: 15 minutes of chewing somewhere calm, then distract them and take it away. Never pull it from their mouth.", "Day 2: a break. Watch for any tummy upset, and give nothing new.", "Day 3 on: if all went well, up to an hour a day.", "Throw it away once it's bare, dry or cracked, and pick up any splinters."],
    caution: "Bones can crack teeth and can splinter. Adult dogs only, never unattended, and bin any splinters or loose pieces.",
    fromMonths: 12,
    untilMonths: 84,
    draft: true,
  },

  // ---- skin and coat: from each store's own product page, read 23 Oct 2026 ----
  {
    id: "hemp-balm",
    kind: "soothe",
    store: "hpo",
    name: "Hemp Healing Balm",
    price: "Rs. 650 (50 g)",
    image: "https://happypuppyorganics.com/cdn/shop/files/hemp_healing_balm.png?v=1759682931&width=800",
    path: "/products/hemp-healing-balm-50gm",
    plain: "A balm of hemp, neem and sea buckthorn oils with kokum butter, for itchy, raw or dry patches.",
    why: "It forms a soothing barrier over hot spots, licked patches, bug bites and minor scrapes, and softens dry noses and paw pads.",
    start: ["Part the fur and smooth a thin layer onto the area.", "Use it on paws, noses, hot spots, dry patches, bug bites and minor irritations.", "Apply as needed. A little goes a long way."],
    caution: "For small, surface problems. A deep, oozing or spreading wound needs a vet.",
  },
  {
    id: "scooby-dub-dub",
    kind: "soothe",
    store: "bitd",
    name: "Scooby-dub-dub",
    price: "Rs. 890 + GST (100 g)",
    image: "https://backintheday.in/wp-content/uploads/2020/07/BITD-Scooby-Dub-Dub-.png",
    path: "/shop/scooby-dub-dub/",
    plain: "Five Ayurvedic herbs in a pre-bath pack: an anti tick and flea pack that also helps heal the skin.",
    why: "It helps get rid of ticks and fleas, and heals skin issues like fungal infections, eczema, flea dermatitis, heavy fur fall, hot spots and rashes. The store says it's very effective for mange and scabies too.",
    start: ["Mix the powder with cold-pressed coconut oil (or aloe vera gel, or another dog-safe cold-pressed oil).", "Massage it into the skin before a bath.", "Leave it on for at least 15 minutes and up to an hour.", "Wash it off with a natural soap or a mild shampoo.", "Between baths, dry powder on the skin helps keep ticks and fleas away and manages itching. It's safe every day and doesn't need washing off."],
    caution: "Licking it is harmless, but the more they lick off, the less is left working on the skin. For atopic dermatitis or very sensitive skin, the store suggests bathing with Quicky Clean with a spoon of Scooby-dub-dub added instead.",
    also: ["ticks"],
  },
  {
    id: "french-clay",
    kind: "soothe",
    store: "nutkit",
    name: "French Green Clay",
    price: "Rs. 450 (100 g)",
    image: "https://static.wixstatic.com/media/6ac0a7_52482eda559c4dba816602fa10a889c2~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg",
    path: "/product-page/french-green-clay",
    plain: "A mineral-rich clay you sprinkle straight onto hot spots.",
    why: "It soaks up moisture and dries out angry, weepy hot spots, and helps with insect bites and small wounds.",
    start: ["Sprinkle over wounds and infected patches. Re-apply when it's absorbed.", "For dry spots, make a paste of the clay with neem oil or coconut oil.", "For ear infections, apply around the base and flap of the ear, never in the canal.", "Use wooden or bamboo spoons and bowls, not metal."],
    caution: "See a vet for wounds that are deep, spreading or don't heal.",
  },
  {
    id: "equilibrium",
    kind: "soothe",
    store: "dgl",
    name: "Equilibrium",
    price: "Rs. 300",
    image: "https://api.rootedinlove.in/storage/v1/object/public/product-images/products/body_care/equilibrium/equilibrium_thumbnail_.png",
    path: "/product/equilibrium",
    plain: "A skin spray of friendly microbes, to calm the skin and bring it back into balance.",
    why: "Healthy skin carries its own good bacteria. This tops them up and supports the skin's natural barrier, for calmer, fresher skin and coat, with no chemicals or preservatives.",
    start: ["Patch test first.", "As a spray: mix the dose with filtered water in a spray bottle, shake, and spray onto the skin twice a day. Or spray 4 to 6 times into your palm and apply by hand.", "After a bath: mix it into lukewarm water as a final leave-in soak, massage in and towel dry. No hot dryers.", "Once mixed, keep it in the fridge and use it within 4 days."],
    caution: "Safe if licked. Raw, oozing or smelly skin needs a vet first.",
  },
  {
    id: "dgl-soft-shiny",
    kind: "inside",
    store: "dgl",
    name: "Soft & Shiny",
    price: "Rs. 725",
    image: "https://api.rootedinlove.in/storage/v1/object/public/product-images/products/supplements/softshiny/soft_shiny_main_.png",
    path: "/product/soft-shiny",
    plain: "A skin and coat supplement with omega-3, zinc, collagen and hyaluronic acid.",
    why: "Fish oil, zinc, biotin and vitamins A and E support skin hydration, coat shine and seasonal shedding. Made especially for dogs who don't eat fish regularly.",
    start: ["Start with a pinch and build up to the full dose over 3 to 4 days (longer if they're sensitive).", "Sprinkle on any meal or broth and mix in. Don't cook or microwave it.", "Give it every day, for at least 3 to 4 months, to see results."],
    caution: "It supports the skin from the inside; it isn't a treatment. Raw, oozing or smelly skin needs a vet.",
    dose: { unit: "scoop", times: "twice a day", puppy: "3 to 6 months: 2 to 3 pinches, twice a day. 6 to 12 months: half the adult dose." },
  },
  {
    id: "dgl-microflora-daily",
    kind: "inside",
    store: "dgl",
    name: "Microflora Daily",
    price: "Rs. 480",
    image: "https://api.doggiliciouus.com/storage/v1/object/public/product-images/products/supplements/microfloradaily/microfloradailyproduct.png",
    path: "/product/microflora-daily",
    plain: "A daily gut supplement of probiotics, prebiotic fibre and gentle Ayurvedic herbs.",
    why: "Much of the immune system sits in the gut, so a settled gut helps itchy skin from the inside. Also useful after antibiotics, a food change or an unsettled tummy.",
    start: ["Sprinkle on a meal or broth and mix in.", "You can start at the full dose from the first meal.", "Don't cook it or add it to very hot food."],
    caution: "From 3 months of age.",
    fromMonths: 3,
    dose: { unit: "scoop", times: "twice a day", puppy: "3 to 6 months: 2 to 3 pinches, twice a day. 6 to 12 months: half the adult dose." },
  },
  {
    id: "dgl-scratchless",
    kind: "inside",
    store: "dgl",
    name: "Scratchless",
    price: "Rs. 550",
    image: "https://api.doggiliciouus.com/storage/v1/object/public/product-images/products/supplements/scratchless/scratchless_main.png",
    path: "/product/scratchless",
    plain: "A daily blend for allergy-prone dogs: bioflavonoids, omega-3, probiotics and enzymes.",
    why: "It works from the inside on allergy itching, licking, redness and seasonal flare-ups, supporting the skin barrier and the gut-skin link.",
    start: ["Start with a few pinches a meal and build up to the full dose over 3 to 4 days (longer if they're sensitive).", "Sprinkle on any meal or broth and mix in. Don't cook, microwave or add it to very hot food.", "Use it while the skin is itchy and inflamed. It isn't an everyday wellness product."],
    caution: "Itching that doesn't ease still needs a vet, to rule out mites, fungus or infection.",
    dose: { unit: "scoop", times: "once a day (twice a day during a flare-up)" },
    fromMonths: 12,
  },
  {
    id: "dgl-joint-venture-daily",
    kind: "joints",
    store: "dgl",
    name: "Joint Venture Daily",
    price: "Rs. 790",
    image: "https://api.rootedinlove.in/storage/v1/object/public/product-images/products/supplements/jointventuredaily/jvd_main_.png",
    path: "/product/joint-venture-daily",
    plain: "A daily joint supplement with collagen, glucosamine, chondroitin, hyaluronic acid and omega fats.",
    why: "It nourishes cartilage, connective tissue and joint lubrication for easier movement. It's preventive too: breeds prone to joint trouble later in life can start early.",
    start: ["Start with a pinch and build up to the full dose over 3 to 4 days (longer if they're sensitive).", "Sprinkle on any meal or broth and mix in. Don't cook or microwave it.", "Give it every day, for at least 6 months, to see results."],
    caution: "From 3 months of age.",
    fromMonths: 3,
    dose: { unit: "scoop", times: "twice a day", puppy: "The store's guide gives the adult dose from 12 months; ask them for a puppy's dose." },
  },
  {
    id: "dgl-joint-venture-intensive",
    kind: "joints",
    store: "dgl",
    name: "Joint Venture Intensive",
    price: "Rs. 435",
    image: "https://api.rootedinlove.in/storage/v1/object/public/product-images/products/supplements/jointventureintensive/jvi_main.png",
    path: "/product/joint-venture-intensive",
    plain: "A short-term blend for stiff, sore days and flare-ups.",
    why: "Used for a few weeks alongside daily joint care, it supports joint comfort, flexibility and easier movement when they're struggling.",
    start: ["Start with a pinch and slowly build up to the full dose.", "Sprinkle it on a meal or broth. Don't cook it.", "Give it for 4 to 6 weeks, then take a 2 to 4 week break. Repeat if needed."],
    caution: "From 6 months. Sudden limping, swelling or pain needs a vet first.",
    fromMonths: 6,
    dose: { unit: "scoop", times: "twice a day", puppy: "3 to 6 months: 2 to 3 pinches, twice a day. 6 to 12 months: half the adult dose." },
  },
  {
    id: "dgl-marine-collagen",
    kind: "joints",
    store: "dgl",
    name: "Marine Collagen",
    price: "Rs. 425",
    image: "https://api.doggiliciouus.com/storage/v1/object/public/product-images/products/supplements/marine_collagen/marine_collagen_main_.png",
    path: "/product/marine-collagen",
    plain: "Pure collagen peptides, easy to digest.",
    why: "Collagen feeds cartilage, tendons and ligaments, and the skin and coat too. A simple first step for an active or ageing dog.",
    start: ["Start with a few pinches a meal and build up to the full dose over 3 to 4 days (longer if they're sensitive).", "Sprinkle on any meal or broth and mix in. Don't cook, microwave or add it to very hot food.", "It can be given every day."],
    caution: "From 3 months of age.",
    fromMonths: 3,
    dose: { unit: "scoop", times: "twice a day", puppy: "3 to 6 months: 2 to 3 pinches, twice a day. 6 to 12 months: half the adult dose." },
  },
  {
    id: "dgl-golden-paste",
    kind: "joints",
    store: "dgl",
    name: "24 Carat Golden Paste",
    price: "Rs. 275",
    image: "https://api.rootedinlove.in/storage/v1/object/public/product-images/products/supplements/24carat/24_carat_goleden_paste_front_pouch_bg.png",
    path: "/product/24-carat-golden-paste",
    plain: "Turmeric with supporting spices, as a ready paste.",
    why: "Turmeric is traditionally used for joint comfort and digestion. Handy on stiff days, or as a daily ritual for an older dog.",
    start: ["Mix virgin coconut oil into the paste first: 10 ml for every 25 g.", "Start with a pea-sized amount and build up over a week.", "Add it to a meal or feed it directly. Don't cook it."],
    caution: "It contains honey, so check with your vet if your dog is diabetic.",
    fromMonths: 3,
    dose: { unit: "scoop", times: "twice a day", puppy: "3 to 6 months: 2 to 3 pinches, twice a day. 6 to 12 months: half the adult dose." },
  },
  {
    id: "dgl-healing-broth",
    kind: "joints",
    store: "dgl",
    name: "Healing Bone Broth",
    price: "Rs. 130",
    image: "https://api.doggiliciouus.com/storage/v1/object/public/product-images/products/broths/healing_bone_broth_bg.png",
    path: "/product/healing-bone-broth",
    plain: "Mixed bones and fresh herbs, simmered for 12 hours.",
    why: "It brings collagen, minerals and amino acids, and keeps older dogs drinking. Pour it warm over meals.",
    start: ["Start with a little and increase slowly as they adjust.", "Serve it on its own, pour it over meals, or use it to cook their food."],
    caution: "Broth adds to the day's food; it isn't a meal on its own.",
  },
  {
    id: "dgl-superwoof",
    kind: "gaps",
    store: "dgl",
    name: "SuperWoof",
    price: "Rs. 420",
    image: "https://api.rootedinlove.in/storage/v1/object/public/product-images/products/supplements/superwoof/superwoof_main.png",
    path: "/product/superwoof",
    plain: "A whole-food multivitamin: probiotics, chia omegas, greens, liver, vitamin D3 and algae omega-3.",
    why: "It covers many of the gaps in a home bowl at once: vitamin D, omega-3, minerals for calcium balance, and gut support. The store's pick if you add just one thing.",
    start: ["Start with a few pinches a meal and build up to the full dose over 3 to 4 days (longer if they're sensitive).", "Sprinkle on any meal or broth and mix in. Don't cook, microwave or add it to very hot food.", "It can be given every day."],
    caution: "Free from anything synthetic. If they're on other supplements, ask before doubling up.",
    dose: { unit: "scoop", times: "twice a day", puppy: "3 to 6 months: 2 to 3 pinches, twice a day. 6 to 12 months: half the adult dose." },
  },
  {
    id: "dgl-mr-humpty",
    kind: "gaps",
    store: "dgl",
    name: "Mr Humpty",
    price: "Rs. 210",
    image: "https://api.doggiliciouus.com/storage/v1/object/public/product-images/products/supplements/mrhumpty/mr_humpty_main_.png",
    path: "/product/mr-humpty",
    plain: "Pure eggshell powder, for calcium.",
    why: "Fresh meat is rich in phosphorus and low in calcium. Eggshell powder balances it, for strong bones and teeth.",
    start: ["Start with a few pinches a meal and build up to the full dose over a week.", "Sprinkle on and mix into warm food just before serving. It can be cooked.", "It can be given every day."],
    caution: "From 3 months. Not needed with packaged food, which already has calcium added.",
    fromMonths: 3,
    dose: { unit: "scoop", times: "twice a day", puppy: "3 to 6 months: 2 to 3 pinches, twice a day. 6 to 12 months: half the adult dose." },
  },
  {
    id: "dgl-sardines",
    kind: "gaps",
    store: "dgl",
    name: "Sardines",
    price: "Rs. 165",
    image: "https://api.rootedinlove.in/storage/v1/object/public/product-images/products/treats/sardines/sardines_treat_pouch_bg_.png",
    path: "/product/sardines",
    plain: "Crunchy whole dried sardines.",
    why: "Omega-3, calcium, vitamin D and B12 in one small fish. Crumble one over the bowl or give it as a treat.",
    start: ["Day 1: one small piece. Watch for any tummy upset.", "Day 2: if all is well, a few more.", "Day 3 on: as regular snacks or training treats.", "To add to meals, crush and mix in, or soak in hot water for 5 to 10 minutes."],
    caution: "Count them as part of the day's food.",
    soldOut: true,
  },
  {
    id: "dgl-mutton-organs",
    kind: "gaps",
    store: "dgl",
    name: "Mutton Organs",
    price: "Rs. 155",
    image: "https://api.rootedinlove.in/storage/v1/object/public/product-images/products/organ_meat/mutton_organs/mutton_organs_1_.png",
    path: "/product/mutton-organs",
    plain: "Mutton heart, kidney and liver.",
    why: "A little organ meat brings vitamin A, B vitamins, iron and copper that muscle meat lacks.",
    start: ["Start with a small amount and increase slowly as they adjust.", "Go more gradually for sensitive dogs."],
    caution: "Rich food: keep organs to a small part of the bowl, about a tenth.",
  },
  {
    id: "dgl-happy-belly",
    kind: "gut",
    store: "dgl",
    name: "Happy Belly Soup",
    price: "From Rs. 100",
    image: "https://api.doggiliciouus.com/storage/v1/object/public/product-images/products/broths/happy_belly/happy_belly_tn_.png",
    path: "/product/happy-belly",
    plain: "A pumpkin soup with ginger and bone broth, for upset tummies.",
    why: "Pumpkin and ginger calm loose motions, gas and bloating, and the broth keeps a dog with low appetite eating and drinking.",
    start: ["Start with a little and increase slowly as they adjust.", "Serve it on its own, add it to meals, or use it as a topper."],
    caution: "For dogs only. Vomiting or diarrhoea for more than a day needs a vet.",
  },
  {
    id: "dgl-kefir",
    kind: "gut",
    store: "dgl",
    name: "Kefir",
    price: "Rs. 275",
    image: "https://api.rootedinlove.in/storage/v1/object/public/product-images/products/supplements/kefir/kefir_1.png",
    path: "/product/kefir",
    plain: "Fresh kefir, full of good bacteria and yeasts.",
    why: "It helps rebuild a healthy gut, especially during or after antibiotics, and brings B vitamins, calcium and vitamins A, D and K.",
    start: ["Start small and build up over 3 to 4 days.", "Add it to meals just before serving. Don't cook or heat it.", "It can be given regularly."],
    caution: "Start small: too much at once can loosen stools.",
    dose: { unit: "tsp", times: "twice a day", puppy: "3 to 6 months: 2 to 3 pinches, twice a day. 6 to 12 months: half the adult dose." },
  },
  {
    id: "dgl-microflora-sensitive",
    kind: "gut",
    store: "dgl",
    name: "Microflora Sensitive",
    price: "Rs. 700",
    image: "https://api.doggiliciouus.com/storage/v1/object/public/product-images/products/supplements/microflorasensitive/microflorasensitiveproduct.png",
    path: "/product/microflora-sensitive",
    plain: "Probiotics, prebiotic fibre, soothing herbs and mushrooms for sensitive stomachs.",
    why: "For a gut recovering from illness or medicine, or a tummy that's often off, it supports stool quality and digestive comfort.",
    start: ["Start with a pinch and build up to the full dose over 3 to 4 days (longer if they're sensitive).", "Sprinkle on any meal or broth and mix in. Don't cook or microwave it.", "Give it every day, for at least 3 to 4 months, to see results."],
    caution: "For IBD or long-running gut trouble, use it alongside your vet's plan.",
    dose: { unit: "scoop", times: "twice a day", puppy: "3 to 6 months: 2 to 3 pinches, twice a day. 6 to 12 months: half the adult dose." },
  },
  {
    id: "dgl-nutritional-yeast",
    kind: "picky",
    store: "dgl",
    name: "Nutritional Yeast",
    price: "Rs. 360",
    image: "https://api.rootedinlove.in/storage/v1/object/public/product-images/products/supplements/nutritionalyeast/nutritional_yeast_main_.png",
    path: "/product/nutritional-yeast",
    plain: "Deactivated yeast with a cheesy taste dogs love.",
    why: "A sprinkle makes the bowl tastier and brings B vitamins and prebiotic fibre for the gut.",
    start: ["Start with a pinch and build up to the full dose over 3 to 4 days (longer if they're sensitive).", "Sprinkle on any meal or broth and mix in. It can be cooked for a milder taste.", "Give it every day."],
    caution: "A flavour booster, not a meal.",
    dose: { unit: "scoop", times: "twice a day", puppy: "3 to 6 months: 2 to 3 pinches, twice a day. 6 to 12 months: half the adult dose." },
  },
  {
    id: "dgl-mackerel-paste",
    kind: "picky",
    store: "dgl",
    name: "Mackerel Head Paste",
    price: "Rs. 475",
    image: "https://api.doggiliciouus.com/storage/v1/object/public/product-images/products/supplements/theseatreasuresfishheads/fish_heads_main.png",
    path: "/product/sea-treasures-mackerel-head-paste",
    plain: "Mackerel fish head paste, made in-house.",
    why: "Its strong fish smell gets fussy dogs interested in their bowl, and it adds omega fats and minerals.",
    start: ["You can start at the full dose from the first meal.", "Mix it into warm fresh food just before feeding. Don't cook it."],
    caution: "Not for dogs with a fish allergy.",
    fromMonths: 3,
    dose: { unit: "scoop", times: "twice a day", puppy: "3 to 6 months: 2 to 3 pinches, twice a day. 6 to 12 months: half the adult dose." },
  },
  {
    id: "dgl-chicken-b-complex",
    kind: "picky",
    store: "dgl",
    name: "Chicken B-Complex",
    price: "Rs. 190",
    image: "https://api.doggiliciouus.com/storage/v1/object/public/product-images/products/limited_treat_thumbnail_.png",
    path: "/product/chicken-b-complex",
    plain: "Crunchy dehydrated chicken, organs, egg and veg, to crumble over food.",
    why: "Real-food crumbs over the bowl get picky eaters interested, with protein and B vitamins from organs and egg.",
    start: ["Day 1: one small piece. Watch for any tummy upset.", "Day 2: if all is well, a few more.", "Day 3 on: as regular snacks or training treats.", "As a meal on the go, soak it in hot water for 5 to 10 minutes."],
    caution: "A treat or topper, not a meal replacement.",
    soldOut: true,
  },
  {
    id: "dgl-the-trim",
    kind: "slim",
    store: "dgl",
    name: "The Trim",
    price: "Rs. 340",
    image: "https://api.rootedinlove.in/storage/v1/object/public/product-images/products/supplements/thetrim/trim_mainn.png",
    path: "/product/the-trim-weightloss-support",
    plain: "Fibre-rich whole foods, mushrooms and herbs for weight management.",
    why: "It supports a structured fat-loss plan and helps them feel full. Best alongside smaller portions, not instead of them.",
    start: ["Start with a few pinches a meal and build up to the full dose over a week.", "Mix it into warm fresh food just before feeding. Don't cook it."],
    caution: "For dogs only. Ask your vet to set the target weight.",
    dose: { unit: "scoop", times: "twice a day", puppy: "3 to 6 months: 2 to 3 pinches, twice a day. 6 to 12 months: half the adult dose." },
  },
  {
    id: "dgl-sos",
    kind: "gut",
    store: "dgl",
    name: "Micro Flora SOS",
    price: "Rs. 525",
    image: "",
    path: "/product/micro-flora-sos",
    plain: "A fast-acting gut blend of probiotics, gentle fibre and herbs, for 3 to 5 days.",
    why: "For the first signs of an upset tummy, irregular stools or constipation. It helps bring the gut back into balance and firm up stools.",
    start: ["Start as soon as you see an upset tummy, loose motions or constipation.", "Give it three times a day, for at least 3 days.", "Sprinkle on meals or broth, or mix into curd or water as a paste. Don't cook, heat or microwave it."],
    caution: "Vomiting, blood or diarrhoea for more than a day needs a vet.",
    dose: { unit: "scoop", times: "three times a day" },
  },
  {
    id: "dgl-anchovy-flakes",
    kind: "gaps",
    store: "dgl",
    name: "Anchovy Flakes",
    price: "Rs. 475",
    image: "",
    path: "/product/sea-treasures-anchovy-flakes",
    plain: "Pure anchovy flakes to sprinkle over meals.",
    why: "A simple way to add omega-3, fish protein and trace minerals, for skin, coat, joints and the brain.",
    start: ["Mix it into warm fresh food just before feeding. Don't cook it."],
    caution: "Not for dogs with a fish allergy.",
    dose: { unit: "scoop", times: "twice a day", puppy: "3 to 6 months: 2 to 3 pinches, twice a day. 6 to 12 months: half the adult dose." },
    soldOut: true,
  },
  {
    id: "hpo-bounce",
    kind: "joints",
    store: "hpo",
    name: "Bounce",
    price: "Rs. 599",
    image: "https://cdn.shopify.com/s/files/1/0463/4725/5965/files/bounce1.png?v=1762693677&width=800",
    path: "/products/bounce-robust-joint-care",
    plain: "A daily joint blend of boswellia, rosehips, Lakadong turmeric, black pepper, hemp and coconut.",
    why: "Boswellia and turmeric support joint comfort and a healthy inflammatory response; rosehips support collagen. Made for senior, active and large dogs.",
    start: [],
    caution: "",
  },
  {
    id: "hpo-rosehip",
    kind: "joints",
    store: "hpo",
    name: "Rosehip Powder",
    price: "Rs. 399",
    image: "https://cdn.shopify.com/s/files/1/0463/4725/5965/files/rosehippowder.png?v=1761802173&width=800",
    path: "/products/rosehip-for-dogs-nature-s-vitamin-c-boost-for-joints-and-immunity",
    plain: "Pure rosehip powder, rich in vitamin C and antioxidants.",
    why: "Rosehips support collagen, cartilage and connective tissue, for stiff, ageing or hard-working dogs.",
    start: [],
    caution: "",
  },
  {
    id: "hpo-happy-belly",
    kind: "gut",
    store: "hpo",
    name: "Happy Belly with Slippery Elm",
    price: "Rs. 599",
    image: "https://cdn.shopify.com/s/files/1/0463/4725/5965/files/happy_belly1.png?v=1762704486&width=800",
    path: "/products/happy-belly-herbal-tummy-care-supplement",
    plain: "Slippery elm, marshmallow root, DGL liquorice and fennel for sensitive tummies.",
    why: "Slippery elm and marshmallow root coat and soothe the gut lining; fennel eases gas. Gentle enough for daily use, and for diet changes.",
    start: [],
    caution: "",
  },
  {
    id: "hpo-psyllium",
    kind: "gut",
    store: "hpo",
    name: "Psyllium Husk",
    price: "Rs. 350",
    image: "https://cdn.shopify.com/s/files/1/0463/4725/5965/files/psyllium_husk_d0ec99f9-6926-47b8-b387-a562d43affb5.png?v=1762704233&width=800",
    path: "/products/psyllium-husk-for-dogs-supports-healthy-digestion-bowel-regularity",
    plain: "Pure psyllium husk, a gentle soluble fibre.",
    why: "It firms loose stools and eases constipation by soaking up water, and feeds good gut bacteria. Helpful for anal gland trouble too.",
    start: [],
    caution: "",
  },
  {
    id: "hpo-colostrum",
    kind: "inside",
    store: "hpo",
    name: "Colostrum",
    price: "Rs. 599",
    image: "https://cdn.shopify.com/s/files/1/0463/4725/5965/files/colostrum.png?v=1780653944&width=800",
    path: "/products/colostrum-for-dogs-build-immunity-and-improved-health",
    plain: "Pure bovine colostrum, the first milk, rich in immune proteins.",
    why: "It supports the gut lining and a calmer immune response, which helps dogs with seasonal and environmental allergies.",
    start: [],
    caution: "",
  },
  {
    id: "hpo-calendula",
    kind: "soothe",
    store: "hpo",
    name: "Calendula Oil",
    price: "Rs. 399",
    image: "https://cdn.shopify.com/s/files/1/0463/4725/5965/files/calendula.png?v=1762705811&width=800",
    path: "/products/wild-harvested-calendula-oil",
    plain: "Sun-infused calendula oil for sore, dry or irritated skin.",
    why: "Calendula soothes hot spots, licked patches, dry noses and cracked paw pads, and supports the skin as it heals.",
    start: [],
    caution: "For small, surface problems. A deep, oozing or spreading wound needs a vet.",
  },
  {
    id: "hpo-neem-lepa",
    kind: "soothe",
    store: "hpo",
    name: "Neem Lepa",
    price: "Rs. 449",
    image: "https://cdn.shopify.com/s/files/1/0463/4725/5965/files/neemlepa.png?v=1763384093&width=800",
    path: "/products/neem-lepa-ayurvedic-neem-pack-for-dogs",
    plain: "An Ayurvedic neem pack for dandruff, yeast and fungal patches.",
    why: "Neem is antifungal and antibacterial. As a pack it calms flaky, fungal skin and conditions the coat.",
    start: ["Smooth a thin layer onto the affected areas, or use it as a leave-in mask.", "Rinse it off."],
    caution: "Safe for puppies when used as directed. Keep it out of their eyes.",
  },
  {
    id: "hpo-rinse-shine",
    kind: "wash",
    store: "hpo",
    name: "Rinse and Shine Shampoo",
    price: "Rs. 420",
    image: "https://cdn.shopify.com/s/files/1/0463/4725/5965/files/rinse_and_shine_shampoo_1.png?v=1762705231&width=800",
    path: "/products/organic-rinse-and-shine-shampoo",
    plain: "A gentle shampoo with aloe, lavender, calendula and rosemary.",
    why: "It cleans without stripping the skin's oils, and soothes sensitive, mildly irritated skin. No SLS, parabens or artificial fragrance.",
    start: [],
    caution: "Bathe once every 3 to 4 weeks at most.",
  },
  {
    id: "hpo-tick-me-not",
    kind: "ticks",
    store: "hpo",
    name: "Tick Me Not Shampoo",
    price: "Rs. 420",
    image: "https://cdn.shopify.com/s/files/1/0463/4725/5965/files/tickmenot.png?v=1762706000&width=800",
    path: "/products/organic-tick-me-not-shampoo",
    plain: "A neem, cedarwood and lemongrass shampoo.",
    why: "It cleans the coat while making them less inviting to ticks and fleas, without synthetic pesticides.",
    start: [],
    caution: "Still check for ticks after every walk.",
  },
  {
    id: "hpo-anti-tick-oil",
    kind: "ticks",
    store: "hpo",
    name: "Anti-Tick Spa Oil",
    price: "Rs. 499",
    image: "https://cdn.shopify.com/s/files/1/0463/4725/5965/files/anti_tick_oil.png?v=1762777718&width=800",
    path: "/products/organic-anti-tick-spa-oil-100-ml",
    plain: "A neem, cedarwood and lemongrass massage oil.",
    why: "A grooming ritual that conditions the skin and coat while helping keep ticks and fleas away.",
    start: [],
    caution: "Keep it away from their eyes and nose.",
  },
  {
    id: "hpo-calming-mist",
    kind: "calm",
    store: "hpo",
    name: "Calming Mist",
    price: "Rs. 499",
    image: "https://cdn.shopify.com/s/files/1/0463/4725/5965/files/calming_mist.png?v=1759427510&width=800",
    path: "/products/organic-calming-mist",
    plain: "Lavender and chamomile flower waters, as a spray.",
    why: "For visitors, car rides, grooming, thunder and fireworks, and winding down at bedtime.",
    start: [],
    caution: "A help, not a fix: pair it with slow, gentle practice.",
  },
  {
    id: "hpo-reishi",
    kind: "calm",
    store: "hpo",
    name: "Reishi Mushroom",
    price: "Rs. 699",
    image: "https://cdn.shopify.com/s/files/1/0463/4725/5965/files/reishi1.jpg?v=1780470289&width=800",
    path: "/products/reishi-adoptogenic-nervous-support-for-anxious-dogs",
    plain: "An adaptogenic mushroom that supports the nervous system.",
    why: "Reishi helps the body cope with stress. Made for anxious dogs, separation stress, and dogs scared of noise, storms or fireworks.",
    start: [],
    caution: "",
  },
  {
    id: "nk-itch",
    kind: "soothe",
    store: "nutkit",
    name: "Itch-A-What-Now?",
    price: "Rs. 500",
    image: "https://static.wixstatic.com/media/6ac0a7_a50adfe1afa440dd9968af4236046536~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg",
    path: "/product-page/itch-a-what-now-100ml",
    plain: "An anti-itch spray of chamomile, geranium and lavender flower waters.",
    why: "It calms sore, itchy skin, rashes, insect bites and dry or greasy patches, and helps damaged skin recover.",
    start: ["Shake well, then spray on paws, body, sides, tail and neck.", "Or spray onto a damp cloth and wipe them down.", "Use it 2 to 3 times a day."],
    caution: "Keep it away from the face and eyes. Patch test the first time.",
  },
  {
    id: "nk-dapper",
    kind: "wash",
    store: "nutkit",
    name: "Dapper Dog",
    price: "Rs. 450",
    image: "https://static.wixstatic.com/media/6ac0a7_5426c1f28a9f44778c79a0cc51549b1b~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg",
    path: "/product-page/dapper-dog-100ml",
    plain: "A post-walk clean-up spray of chamomile, neem and deodar.",
    why: "It clears dust, pollen and pollutants off paws and coat between baths, and soothes mild irritation and rashes.",
    start: ["Spray on paws, body, tail and neck after walks.", "Or spray a damp cloth and wipe them down.", "Daily, or 3 to 4 times a week."],
    caution: "Keep it off the face, eyes and open wounds. Patch test the first time.",
  },
  {
    id: "nk-sip-refresh",
    kind: "wash",
    store: "nutkit",
    name: "Sip n Soak (Skin Refresh)",
    price: "Rs. 550",
    image: "https://static.wixstatic.com/media/6ac0a7_5a1b00707fd040c1813d0734c428f0c4~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg",
    path: "/product-page/sip-n-soak-calm-and-refresh-60gm",
    plain: "A chamomile, calendula and rose herbal rinse, in place of frequent baths.",
    why: "It cools itchy, inflamed skin and supports the skin's own oils and microbiome, instead of stripping them with shampoo.",
    start: ["Steep 2 tbsp in a mug of hot water for 30 minutes, then strain and cool.", "Pour it over as a rinse, or use it in a spray bottle.", "Keep the tea in the fridge for up to 3 days."],
    caution: "Patch test the first time.",
  },
  {
    id: "nk-sip-itch",
    kind: "wash",
    store: "nutkit",
    name: "Sip n Soak (Anti Itch)",
    price: "Rs. 400",
    image: "https://static.wixstatic.com/media/6ac0a7_45ab3762b70a4971b20c2db61fa4705b~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg",
    path: "/product-page/sip-n-soak-60gm",
    plain: "A chamomile, lavender and peppermint rinse for itchy skin.",
    why: "It cools the skin, calms rashes and allergic reactions, and brings down redness.",
    start: ["Steep 2 tbsp in a mug of hot water for 30 minutes, then strain and cool.", "Use it as a rinse once a week for itchy skin."],
    caution: "Patch test the first time.",
    soldOut: true,
  },
  {
    id: "nk-spirulina",
    kind: "inside",
    store: "nutkit",
    name: "Spirulina Powder",
    price: "Rs. 300",
    image: "https://static.wixstatic.com/media/6ac0a7_26bd7ff4bf97412cb1e79dd4a41fa994~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg",
    path: "/product-page/spirulina-powder",
    plain: "Blue-green algae, a strong antioxidant.",
    why: "It helps with allergies and skin repair, supports the liver and gut, and eases joint and muscle soreness.",
    start: ["Start with a tiny pinch and watch their stool for a week.", "Then build up: \u215b tsp for small dogs, \u00bc tsp for medium and large.", "Twice a week, or when needed."],
    caution: "Use a dry wooden or ceramic spoon; keep it away from moisture.",
  },
  {
    id: "nk-walksaber",
    kind: "ticks",
    store: "nutkit",
    name: "Walksaber",
    price: "Rs. 450",
    image: "https://static.wixstatic.com/media/6ac0a7_abf25fe97171400993f807b22d44916f~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg",
    path: "/product-page/walksaber-100ml",
    plain: "A natural tick and flea spray of lavender, deodar, peppermint and lemongrass.",
    why: "Spray before walks to make them less inviting to ticks and fleas. Comes in mild, and strong for green, tick-heavy areas.",
    start: ["Shake well.", "Spray on body, legs, paws, belly, neck, armpits and tail before walks."],
    caution: "Keep it away from the face and eyes. Patch test the first time.",
  },
  {
    id: "nk-muff-it",
    kind: "calm",
    store: "nutkit",
    name: "Muff-It",
    price: "Rs. 500",
    image: "https://static.wixstatic.com/media/6ac0a7_be1b2b6dfeba4fc781d5c7f2bcdea1bb~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg",
    path: "/product-page/muff-it",
    plain: "A calming mist with frankincense, lavender and hops.",
    why: "For fear of loud sounds like fireworks, thunder and construction, mild separation anxiety, and bad associations with travel.",
    start: ["Let them sniff it first.", "Spray on your palm, their bed, the floor, or a bandana for walks.", "Spray near them, away from the face."],
    caution: "Not to be applied on the skin. Not for pregnant dogs or dogs on antibiotics.",
  },
  {
    id: "nk-turmeric",
    kind: "joints",
    store: "nutkit",
    name: "Native Turmeric",
    price: "Rs. 350",
    image: "https://static.wixstatic.com/media/6ac0a7_a2b4a08b61f942c486d01118612f2abc~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg",
    path: "/product-page/native-turmeric-200gms",
    plain: "High-curcumin turmeric (over 6%), grown in black soil.",
    why: "Used for arthritis and joint pain, inflammation, skin allergies and gut trouble.",
    start: ["Make it into a golden paste, or mix it with coconut oil or ghee.", "Add fresh crushed black pepper; it helps the body absorb it."],
    caution: "Avoid with blood thinners, gallstones, liver trouble, or in dogs that run hot.",
    soldOut: true,
  },
  {
    id: "nk-belly",
    kind: "gut",
    store: "nutkit",
    name: "Belly Dept.",
    price: "Rs. 400",
    image: "https://static.wixstatic.com/media/6ac0a7_a6a081f0637344c4a6d4f83ba76f624d~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg",
    path: "/product-page/belly-dept",
    plain: "A digestive tea of ginger, mint, chamomile and fennel.",
    why: "For nausea, motion sickness, cramps, indigestion, gas and constipation. Give it 30 minutes before a journey.",
    start: ["Steep 1 tbsp in a cup of just-boiled water for 15 minutes, strain and cool.", "Three times a day: \u00bd tsp under 5 kg, 1 tsp for 5 to 10 kg, 2 tsp for 10 to 20 kg, 1 tbsp over 20 kg."],
    caution: "For short-term upsets, not chronic issues. Avoid in pregnancy and with acid reflux (GERD).",
    soldOut: true,
  },
  {
    id: "dgl-bone-legacy-chicken",
    kind: "gaps",
    store: "dgl",
    name: "Bone Legacy (Chicken)",
    price: "Rs. 495",
    image: "https://api.doggiliciouus.com/storage/v1/object/public/product-images/products/supplements/thebonelegacypoultry/bone_legacy_main.png",
    path: "/product/bone-legacy-chicken",
    plain: "Chicken bone meal, made in-house.",
    why: "Natural calcium and phosphorus from real bone, for bones, teeth and mineral balance in a home-made bowl.",
    start: ["Start with a few pinches a meal and build up to the full dose over 3 to 4 days (longer if they're sensitive).", "Sprinkle on and mix into warm food just before serving. Don't cook it."],
    caution: "Not needed if they already eat raw meaty bones. Skip it for a chicken allergy.",
    dose: { unit: "scoop", times: "twice a day", puppy: "3 to 6 months: 2 to 3 pinches, twice a day. 6 to 12 months: half the adult dose." },
    fromMonths: 3,
  },
  {
    id: "dgl-bone-legacy-fish",
    kind: "gaps",
    store: "dgl",
    name: "Bone Legacy (Fish)",
    price: "Rs. 500",
    image: "https://api.doggiliciouus.com/storage/v1/object/public/product-images/products/supplements/thebonelegacy_fish/bone_legacy_main.png",
    path: "/product/bone-legacy-fish",
    plain: "Fish bone meal, made in-house.",
    why: "Natural calcium and phosphorus from fish bone: a non-chicken option for dogs who can't have chicken.",
    start: ["Start with a few pinches a meal and build up to the full dose over 3 to 4 days (longer if they're sensitive).", "Sprinkle on any meal or broth and mix in. It can be cooked."],
    caution: "Not for dogs with a fish allergy.",
    dose: { unit: "scoop", times: "twice a day", puppy: "3 to 6 months: 2 to 3 pinches, twice a day. 6 to 12 months: half the adult dose." },
    fromMonths: 3,
  },
  {
    id: "dgl-heart-to-heart",
    kind: "gaps",
    store: "dgl",
    name: "Heart to Heart",
    price: "Rs. 690",
    image: "https://api.doggiliciouus.com/storage/v1/object/public/product-images/products/supplements/hearttoheart/blood_and_heart_main.png",
    path: "/product/heart-to-heart",
    plain: "A heart blend with taurine, algae omega-3, vitamin D3, CoQ10 and L-carnitine.",
    why: "Taurine keeps the heart muscle strong, and most vegetarian and grain-heavy bowls are short on it. This adds taurine with omega-3 and vitamin D.",
    start: ["Start with a few pinches a meal and build up to the full dose over 3 to 4 days (longer if they're sensitive).", "Sprinkle on any meal or broth and mix in. Don't cook, microwave or add it to very hot food.", "It can be given every day."],
    caution: "For a diagnosed heart condition or heart medicine, use it with your vet.",
    dose: { unit: "scoop", times: "twice a day", puppy: "3 to 6 months: 2 to 3 pinches, twice a day. 6 to 12 months: half the adult dose." },
    fromMonths: 3,
  },
  {
    id: "huft-tick-spray",
    kind: "ticks",
    store: "huft",
    name: "Organic Anti-Tick and Flea Spray",
    price: "Rs. 499 (200 ml)",
    image: "https://cdn.shopify.com/s/files/1/0086/0795/7054/files/DSC_9027copy.jpg?v=1762415193",
    path: "/products/huft-organic-anti-flea-and-tick-spray-200ml",
    plain: "A natural spray of lemongrass and geranium oils.",
    why: "It repels ticks and fleas for a couple of hours at a time, and is gentle enough to use all year before outdoor play.",
    start: ["Ruffle the coat and spray directly onto the skin: back, tail, legs and belly.", "For the head, rub a little on your palms and work it in around the ears.", "Keep it away from the eyes and mouth."],
    caution: "For dogs over 8 weeks old.",
  },
  {
    id: "huft-paw-balm",
    kind: "ticks",
    store: "huft",
    name: "Organic Anti-Tick and Flea Paw Balm",
    price: "Rs. 299 (25 g)",
    image: "https://cdn.shopify.com/s/files/1/0086/0795/7054/files/DSC_9143copycopy.jpg?v=1773811190",
    path: "/products/huft-organic-paw-butter-for-dogs-15gms",
    plain: "A plant-wax paw balm with tick- and flea-repelling oils.",
    why: "It softens cracked, dry paw pads and its essential oils help keep ticks and fleas off: paws pick them up first on walks.",
    start: ["Take a little on your fingertips.", "Apply to clean paw pads.", "Use as often as needed."],
    caution: "",
  },
  {
    id: "bragg-acv",
    kind: "ticks",
    store: "amazon",
    name: "Bragg Raw Apple Cider Vinegar",
    price: "Rs. 699 (473 ml)",
    image: "https://m.media-amazon.com/images/I/71EdgjDu2kL._SL1500_.jpg",
    path: "/dp/B000R73XZ0",
    plain: "Raw, unfiltered apple cider vinegar, with the mother.",
    why: "A holistic way to make your dog less appealing to ticks and fleas, from the inside. Not proven, but harmless.",
    start: [],
    caution: "Our suggestion, not the label's: about ½ teaspoon per 10 kg a day, mixed into food. Keep up the tick checks.",
  },
  {
    id: "quicky-clean",
    kind: "wash",
    store: "bitd",
    name: "Quicky Clean",
    price: "Rs. 570 + GST (150 g)",
    image: "https://backintheday.in/wp-content/uploads/2020/07/Quicky-Clean-Label-4.25-X-4.5-inch-On-Sticker-5000-Sets-8-ups-pdf.jpg",
    path: "/shop/quicky-clean/",
    plain: "A no-lather cleanser of reetha, shikakai and amla, with Krishna Sirisha leaves and chamomile.",
    why: "It's mild on the skin and restores its natural oil balance. Mixed with a little Scooby-dub-dub, it works well for dogs with atopic dermatitis.",
    start: ["Activate the powder by mixing it with boiling water.", "Add apple cider vinegar, essential oils and aloe vera if you like.", "Use the mix instead of shampoo to bathe them.", "Apply it gently; don't massage the skin too much."],
    caution: "For very sensitive or allergic skin, skip the essential oils and vinegar; add aloe vera and a spoon of Scooby-dub-dub instead.",
  },
  {
    id: "bitd-shampoo",
    kind: "wash",
    store: "bitd",
    name: "Shampoo and Conditioner",
    price: "Rs. 640 + GST (300 ml)",
    image: "https://backintheday.in/wp-content/uploads/2023/04/shamopoo-scaled.jpg",
    path: "/shop/shampoo-and-conditioner/",
    plain: "Coconut and plant oils, soap nuts, hibiscus, aloe, amla and rose, with cedarwood and tea tree oils.",
    why: "It cleans the skin without drying it out and conditions the coat soft and shiny, with no artificial colour or fragrance and no residue on the skin.",
    start: ["Shake the bottle well, and wet the coat thoroughly.", "Rub a little shampoo and water between your palms into a mild lather, and massage it into the skin, adding a little water as you go.", "Cover them completely, avoiding the eyes, and leave it on for 5 minutes.", "Rinse thoroughly and towel dry. Once dry, brush gently to remove dead fur."],
    caution: "Keep it away from the eyes.",
  },
  {
    id: "nettle",
    kind: "inside",
    store: "hpo",
    name: "Stinging Nettle Leaves",
    price: "Rs. 250",
    image: "https://happypuppyorganics.com/cdn/shop/files/nettle_a53b33c3-b840-4598-8c48-a1f84d77771f.png?v=1762848328&width=800",
    path: "/products/wild-harvested-nettle-leaves",
    plain: "Dried wild nettle leaves, added to food, traditionally used for itching and seasonal allergies.",
    why: "Nettle is a traditional herb for itchy skin, paw licking and seasonal allergies, given in small amounts with food.",
    start: [],
    caution: "Check with your vet first if your dog is on medication or has a health condition.",
  },
  {
    id: "hemp-oil",
    kind: "inside",
    store: "hpo",
    name: "Hemp Seed Oil",
    price: "Rs. 600 (100 ml)",
    image: "https://happypuppyorganics.com/cdn/shop/files/hemp_seed_oil_1.png?v=1762705362&width=800",
    path: "/products/happy-puppy-organics-hemp-seed-oil-100-ml",
    plain: "Cold-pressed hemp seed oil with omega-3 and omega-6 fats.",
    why: "Its fats support soft skin and a shiny coat, and can cut down on shedding. It can also be massaged into itchy patches before a bath.",
    start: ["Drizzle it over their food every day.", "Or massage it into itchy patches, or all over, before a shampoo.", "Use it consistently."],
    caution: "Oily fish like sardines are the stronger omega-3 source.",
  },
  {
    id: "tick-bomb",
    kind: "ticks",
    store: "hpo",
    name: "Tick Bomb Spray",
    price: "Rs. 699 (100 ml)",
    image: "https://happypuppyorganics.com/cdn/shop/files/tick_bomb_front.png?v=1762693212&width=800",
    path: "/products/natural-anti-tick-spray",
    plain: "A natural spray of aloe, neem, cedarwood and lemongrass.",
    why: "A light mist before walks makes your dog less inviting to ticks and fleas, without synthetic pesticides.",
    start: ["Shake well.", "Mist lightly over the coat before walks, outdoor play or travel, avoiding the eyes and nose.", "Reapply regularly."],
    caution: "Keep it away from their eyes and nose.",
  },
];

// Which products to show, and in what order. Same answers, same result.
export function pickProducts(needs: ProblemId[], months: number) {
  const ok = PRODUCTS.filter((p) => (!p.fromMonths || months >= p.fromMonths) && (!p.untilMonths || months < p.untilMonths));
  const flagged = (p: Product) => (p.notFor && needs.includes(p.notFor.problem) ? 1 : 0);
  // Out-of-stock items and ones flagged for this dog go to the end.
  return [...ok].sort((a, b) => flagged(a) - flagged(b) || Number(!!a.soldOut) - Number(!!b.soldOut));
}

// ---------- neutering ----------

// Shown only when the owner ticks a behaviour that neutering can change.
// Always ends with a vet check. Neutered status is not asked, so the note
// is written to make sense either way.
export const NEUTER_FOR: ProblemId[] = ["mark"];

export function neuterNote(sex: Sex | null, months: number): { text: string; draft: boolean } {
  const vet = "Ask your vet whether and when it makes sense for your dog.";
  if (months < 6) return { text: `At this age, humping is usually play or excitement, not hormones. Calmly redirect them to a toy. Neutering is a conversation for later. ${vet}`, draft: true };
  if (sex === "girl") return { text: `Girls mark and hump too, often around a season. Spaying stops seasons, but it will not undo a habit that comes from excitement, and the right age depends on breed and size. ${vet}`, draft: true };
  return { text: `Marking and humping often show up as hormones arrive. If he is not neutered, neutering can reduce marking and roaming in many male dogs, but it will not undo a habit that comes from excitement, and the right age depends on breed and size. ${vet}`, draft: true };
}

// ---------- landing page fun facts ----------

// One is shown at a time, changing every ten seconds. These are commonly
// quoted facts, written from general knowledge and not checked against a
// source. Edit, cut or add freely.
export const FUN_FACTS = [
  "A dog's nose has up to 300 million scent receptors. Ours has about 6 million.",
  "Every dog's nose print is different, a bit like a fingerprint.",
  "Dogs sweat through their paw pads, and cool down mostly by panting.",
  "Puppies are born with their eyes and ears closed. Both open at around two weeks.",
  "Dogs can hear sounds far too high-pitched for human ears.",
  "Dogs dream. Those twitching paws are part of the same deep sleep stage we have.",
  "Dogs are not colour-blind. They see blues and yellows, but not reds and greens.",
];
