// Everything the owner reads after the questions. Meghna owns this file.
//
// DRAFT: entries marked `draft: true` were written by Claude as a starting
// point and have not been checked by Meghna. The site shows a small "Draft"
// tag beside them. Rewrite the text, then delete the `draft: true` line.

import type { AgeBand } from "./flow";

export type Sex = "boy" | "girl";

// ---------- what do you need help with? ----------

export type ProblemId = "chew" | "busy" | "settle" | "nip" | "toilet" | "pull" | "bark" | "alone" | "mark" | "night" | "itch" | "ticks" | "coat" | "tummy" | "picky" | "weight";

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
];

// What is in the bowl now. Asked on the food step.
export type Bowl = "kibble" | "home" | "fresh" | "mix";
export const BOWLS: { id: Bowl; label: string }[] = [
  { id: "kibble", label: "Packaged food" },
  { id: "home", label: "Home-cooked" },
  { id: "fresh", label: "Fresh or raw" },
  { id: "mix", label: "A mix" },
];

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
};

export type KindId = "sniff" | "puzzle" | "chew";

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
];

export type Product = {
  id: string;
  kind: KindId;
  store: keyof typeof STORES;
  name: string;
  price: string;
  // The store's own photo, loaded from the store's server.
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
    start: ["Scatter a handful of kibble on top, in plain sight.", "Next meal, tuck half of it between the layers.", "Work up to hiding the whole meal.", "Pick the mat up when the food is gone."],
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
    start: ["Push three or four treats just inside the folds.", "Let them watch you do it the first time.", "Hide them deeper once they have the idea.", "Take it away when it is empty."],
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
    start: ["Leave the drawstring fully open.", "Drop a few treats among the strips.", "Tighten it a little each time they get quicker."],
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
    start: ["Leave the rollers open with a treat in each.", "Half close one and let them nudge it.", "Close all three once they have the idea."],
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
    start: ["Spread a thin layer of curd or wet food on the mat.", "Hold it for them the first time.", "Freeze it to make it last longer."],
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
    start: ["Pick the size for their weight.", "Fill it loosely with kibble so it falls out easily.", "Then pack it with wet food.", "Then freeze it."],
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
    start: ["Choose a size bigger than you think.", "Give it for fifteen minutes, then put it away.", "Take the last small piece away."],
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
    start: ["Start with one, and see how their tummy takes it.", "The store suggests going slowly for the first two days.", "Then two to four a day at most, by their guide."],
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
    start: ["Offer one piece, with you nearby.", "Go slowly for the first two days.", "The store suggests one piece a day."],
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
    start: ["The store suggests starting with fifteen minutes, with you there.", "Build up slowly, to an hour a day at most.", "Throw it away once it is bare, dry or cracked."],
    caution: "Bones can crack teeth and can splinter. Adult dogs only, never unattended, and bin any splinters or loose pieces.",
    fromMonths: 12,
    untilMonths: 84,
    draft: true,
  },
];

// Which products to show, and in what order. Same answers, same result.
export function pickProducts(needs: ProblemId[], months: number) {
  const ok = PRODUCTS.filter((p) => (!p.fromMonths || months >= p.fromMonths) && (!p.untilMonths || months < p.untilMonths));
  const flagged = (p: Product) => (p.notFor && needs.includes(p.notFor.problem) ? 1 : 0);
  return [...ok].sort((a, b) => flagged(a) - flagged(b));
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
