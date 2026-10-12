// Everything the owner reads after the questions. Meghna owns this file.
//
// DRAFT: entries marked `draft: true` were written by Claude as a starting
// point and have not been checked by Meghna. The site shows a small "Draft"
// tag beside them. Rewrite the text, then delete the `draft: true` line.

import type { AgeBand } from "./flow";

export type Sex = "boy" | "girl";

// ---------- what do you need help with? ----------

export type ProblemId = "chew" | "busy" | "settle" | "nip" | "toilet" | "pull" | "bark" | "alone" | "mark" | "night";

export type Problem = {
  id: ProblemId;
  label: string;
  // Age bands where this is common enough to be ticked for the owner.
  common: AgeBand[];
  // Which written guide answers it. Problems without one show as "still being written".
  guide?: "calm";
  draft?: boolean;
};

export const PROBLEMS: Problem[] = [
  // The three chips confirmed in the PRD.
  { id: "chew", label: "Chews everything", common: ["puppy", "adolescent"], guide: "calm" },
  { id: "busy", label: "Always wants something to do", common: ["puppy", "adolescent", "adult"], guide: "calm" },
  { id: "settle", label: "Can't settle", common: ["adolescent", "adult"], guide: "calm" },
  // Drafted: both the wording and the ages they are ticked for.
  { id: "nip", label: "Nips and mouths hands", common: ["puppy"], draft: true },
  { id: "toilet", label: "Toilet accidents indoors", common: ["puppy"], draft: true },
  { id: "pull", label: "Pulls on the lead", common: ["adolescent"], draft: true },
  { id: "bark", label: "Barks a lot", common: [], draft: true },
  { id: "alone", label: "Struggles when left alone", common: [], draft: true },
  { id: "mark", label: "Marks indoors or humps", common: [], draft: true },
  { id: "night", label: "Restless at night", common: ["senior"], draft: true },
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
  toy: {
    title: "A snuffle toy",
    plain: "A treat hunt on the floor: fabric folds that hide food, so they have to sniff it out.",
    introduce: [
      "Let them watch you tuck a few treats in, right on top.",
      "Say nothing and let them find those. Easy wins first.",
      "Next time, push the treats deeper.",
      "Pick it up when the food is gone, so it stays special.",
    ],
    caution: "It is a feeding toy, not a chew. Put it away once the treats are gone, and stop if they start pulling the fabric apart.",
    draft: true,
  },
  shop: {
    store: "For the Love of Dog",
    url: "https://fortheloveofdog.co.in",
    // Read by hand from the store's own website on this date. Prices drift.
    checked: "9 Oct 2026",
    items: [
      { name: "Sniffer Mats", price: "Rs. 1,499", path: "/products/sniffer-mats" },
      { name: "Sniffer Ball", price: "From Rs. 899", path: "/products/sniffer-ball" },
      { name: "Snuffle Rainboo", price: "Rs. 899", path: "/products/snuffle-rainboo" },
      { name: "Snuffle Pouch", price: "Rs. 699", path: "/products/snuffle-pouch" },
      { name: "Love Letter", price: "Rs. 499", path: "/products/love-letter" },
      { name: "Snuffle Pupcakes", price: "From Rs. 479", path: "/products/snuffle-pupcakes" },
    ],
  },
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
