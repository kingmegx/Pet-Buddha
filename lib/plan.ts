// The plan, grouped. Everything on the suggestions page is sorted into tabs
// of related problems, and each tab is written to be scanned: a one-line
// "aha", a few short tips (a bold few words, then one line), one thing not to
// do, when to get help, and the people worth following for it.
//
// DRAFT: everything here except the toilet, chewing and house-rule advice
// (which is Meghna's own, in lib/content.ts) was written by Claude for Meghna
// to correct. Tips about the people below are summarised from their own
// Instagram bios, highlights and websites (read 15 Oct 2026), in our words.

import type { Bowl, ProblemId } from "./content";

export type GroupId = "energy" | "toilet" | "walks" | "alone" | "food" | "skin";

export type Tip = { t: string; d: string };

export type Expert = {
  id: string;
  name: string;
  handle: string;
  // What they offer, in a line.
  what: string;
  // What kind of help: shown as a small label on the card.
  kind: "Nutritionist" | "Fresh food" | "Supplements" | "Skin and bath" | "Treats" | "Holistic care" | "Vet" | "Trainer" | "Adoption";
  site?: string;
  insta?: string;
  where?: string;
  groups: GroupId[];
};

// ---------- the people we point to ----------

export const EXPERTS: Expert[] = [
  {
    id: "doggiliciouus",
    name: "Doggiliciouus",
    handle: "@doggiliciouus",
    what: "Canine nutritionist (9+ years) Manssi Karambelkar's holistic wellness page: recipes, ingredients, supplements and DIY games.",
    kind: "Nutritionist",
    insta: "https://www.instagram.com/doggiliciouus/",
    site: "https://superprofile.bio/doggiliciouusrootedinlove",
    groups: ["food", "skin", "energy"],
  },
  {
    id: "askmanssi",
    name: "Manssi Karambelkar",
    handle: "@askmanssi",
    what: "Qualified canine nutritionist behind Doggiliciouus. Book her for a diet or supplement consult.",
    kind: "Nutritionist",
    insta: "https://www.instagram.com/askmanssi/",
    site: "https://superprofile.bio/askmanssi",
    groups: ["food", "skin"],
  },
  {
    id: "georgina",
    name: "Georgina's Kitchen",
    handle: "@georginaskitchen.india",
    what: "Canine nutrition since 2016: gut microbiome testing, personalised diet plans, freeze-dried meals, and bundles for allergies, seniors and picky eaters.",
    kind: "Nutritionist",
    insta: "https://www.instagram.com/georginaskitchen.india/",
    site: "https://georginaskitchen.com",
    where: "Ships across India",
    groups: ["food", "skin"],
  },
  {
    id: "carni",
    name: "Carni Kitchen",
    handle: "@carnikitchen",
    what: "Ashritha Siddantham makes dog nutrition simple: online one-to-one consults, cooked and raw bowl recipes.",
    kind: "Nutritionist",
    insta: "https://www.instagram.com/carnikitchen/",
    where: "Consults online; fresh food in Hyderabad",
    groups: ["food"],
  },
  {
    id: "kanine",
    name: "Kanine Nutrition",
    handle: "@kaninenutrition",
    what: "Certified canine nutritionist Mithun B: custom meal plans, plus tips and herbs.",
    kind: "Nutritionist",
    insta: "https://www.instagram.com/kaninenutrition/",
    site: "https://linktr.ee/kaninenutrition",
    groups: ["food"],
  },
  {
    id: "bowl",
    name: "What's In My Dog's Bowl",
    handle: "@whatsinmydogbowl",
    what: "A canine nutritionist on fresh bowls, sustainable feeding, and letting dogs choose. Good reminder that every dog's needs are different.",
    kind: "Nutritionist",
    insta: "https://www.instagram.com/whatsinmydogbowl/",
    groups: ["food"],
  },
  {
    id: "canineindia",
    name: "Canine India",
    handle: "@canine_india",
    what: "Handmade, whole-prey meals from Chennai (meat, organs, bone), plus natural chews and gut, skin and joint supplements.",
    kind: "Fresh food",
    insta: "https://www.instagram.com/canine_india/",
    site: "https://canineindia.in",
    where: "Ships across India",
    groups: ["food", "energy", "skin"],
  },
  {
    id: "caninecraving",
    name: "Canine Craving",
    handle: "@caninecraving",
    what: "Fresh meals, fresh meat and seafood, broths and natural chews, formulated by a canine nutritionist.",
    kind: "Fresh food",
    insta: "https://www.instagram.com/caninecraving/",
    site: "https://www.caninecraving.com",
    where: "Fresh meat delivery: check your pincode on their site",
    groups: ["food", "energy"],
  },
  {
    id: "woof",
    name: "Woof Ministry",
    handle: "@woofministry",
    what: "Simple, preservative-free treats, food toppers, broth and dairy-free ice creams. Lab-tested.",
    kind: "Treats",
    insta: "https://www.instagram.com/woofministry/",
    site: "https://woofministry.com",
    groups: ["food", "toilet", "walks"],
  },
  {
    id: "backintheday",
    name: "Back in the Day",
    handle: "@backintheday.in",
    what: "Natural dog skin care since 2017: gentle shampoos, a pre-bath mousse, cold-pressed coconut oil. Their highlights cover ticks, hotspots, dry skin, shedding and fungal infections.",
    kind: "Skin and bath",
    insta: "https://www.instagram.com/backintheday.in/",
    site: "https://backintheday.in",
    groups: ["skin"],
  },
  {
    id: "happypuppy",
    name: "Happy Puppy Organics",
    handle: "@happypuppyorganics",
    what: "Small-batch natural skin care, an anti-tick spray, hemp seed oil, ear cleaner, and calming mists.",
    kind: "Skin and bath",
    insta: "https://www.instagram.com/happypuppyorganics/",
    site: "https://happypuppyorganics.com",
    groups: ["skin", "alone"],
  },
  {
    id: "nutkit",
    name: "Nutkit",
    handle: "@nutkit.co",
    what: "Natural wellbeing for dogs: clays for hot spots, a calming spray for fireworks, and consults on stress, fear and skin.",
    kind: "Holistic care",
    insta: "https://www.instagram.com/nutkit.co/",
    site: "https://www.nutkit.co.in",
    groups: ["skin", "alone", "walks"],
  },
  {
    id: "becker",
    name: "Dr. Karen Becker",
    handle: "@drkarenbecker",
    what: "Vet and co-author of The Forever Dog and The Forever Dog Life (balanced fresh-food recipes). Our food advice follows her approach.",
    kind: "Vet",
    insta: "https://www.instagram.com/drkarenbecker/",
    site: "https://drkarenbecker.com",
    groups: ["food"],
  },
  {
    id: "proactive",
    name: "Proactive Paws",
    handle: "@proactivepawsproducts",
    what: "Dr. Becker's supplements: probiotics, digestive enzymes, liver support, omega-3 and joint care.",
    kind: "Supplements",
    insta: "https://www.instagram.com/proactivepawsproducts/",
    site: "https://www.proactivepaws.com",
    where: "US-based; check shipping to India",
    groups: ["food", "skin"],
  },
  {
    id: "zak",
    name: "Zak George",
    handle: "Zak George on YouTube",
    what: "A dog trainer who teaches with rewards. Good for toilet training, lead walking and much more.",
    kind: "Trainer",
    site: "https://www.youtube.com/@zakgeorge",
    groups: ["toilet", "walks", "alone", "energy"],
  },
  {
    id: "freagles",
    name: "Freagles of India",
    handle: "@freagles.of.india",
    what: "A Bengaluru trust that rehabs and rehomes beagles retired from labs and breeders. Adopt, foster or help feed them.",
    kind: "Adoption",
    insta: "https://www.instagram.com/freagles.of.india/",
    groups: [],
  },
  {
    id: "chinthana",
    name: "Chinthana Gopinath",
    handle: "@chinthanagopinath",
    what: "Runs Back in the Day and Freagles of India. Her highlights cover senior dog care, neutering, and why not to buy puppies.",
    kind: "Adoption",
    insta: "https://www.instagram.com/chinthanagopinath/",
    groups: [],
  },
];

export const expert = (id: string) => EXPERTS.find((e) => e.id === id)!;

// ---------- the tabs ----------

export type Group = {
  id: GroupId;
  tab: string;
  problems: ProblemId[];
  // The "aha": the one thing to understand. {who} becomes the dog's name.
  aha: string;
  // One line under it.
  why: string;
  tips: Tip[];
  avoid: string;
  help?: string;
  experts: string[];
};

export const GROUPS: Group[] = [
  {
    id: "energy",
    tab: "Energy and chewing",
    problems: ["chew", "busy", "settle", "nip", "night"],
    aha: "{who} isn't naughty. {who} is bored.",
    why: "Chewing, nipping and not settling are a busy brain looking for a job. Sniffing and chewing give it one, and a calm dog follows.",
    tips: [
      { t: "Slow the walk", d: "Let them stop and sniff. Ten minutes of their choosing beats thirty at your pace." },
      { t: "Make food a job", d: "Scatter part of a meal, or use a snuffle mat, instead of a bowl." },
      { t: "Give a chew", d: "Something safe to work on, lying down, when you need them to switch off." },
      { t: "Swap, don't scold", d: "When teeth land on hands or furniture, swap in a toy, then praise them for taking it." },
    ],
    avoid: "Don't add more fetch or running to tire them out. It builds fitness and excitement, not calm.",
    help: "If they guard food or toys, snap, or chew until they hurt themselves, talk to a vet or a qualified trainer.",
    experts: ["canineindia", "caninecraving", "zak"],
  },
  {
    id: "toilet",
    tab: "Toilet",
    problems: ["toilet", "mark"],
    aha: "{who} isn't being stubborn. Nobody has shown {who} where yet.",
    why: "Dogs go where it smells right and where it pays. Reward the right spot every time, and the habit forms.",
    tips: [],
    avoid: "Don't scold accidents you find later, or rub their nose in it. They can't link it to what they did.",
    help: "If an older, trained dog starts having accidents, or pees very often, see a vet. It can be an infection.",
    experts: ["zak", "woof"],
  },
  {
    id: "walks",
    tab: "Walks and barking",
    problems: ["pull", "bark"],
    aha: "{who} pulls and barks because it works.",
    why: "Pulling gets them there faster. Barking gets your attention. Make the calm choice the one that pays instead.",
    tips: [],
    avoid: "Don't yank the lead or shout back. Skip choke, prong and shock collars.",
    help: "If barking comes with shaking, hiding or snapping, they may be scared. Talk to a vet or a qualified trainer.",
    experts: ["zak", "nutkit", "woof"],
  },
  {
    id: "alone",
    tab: "Home alone",
    problems: ["alone"],
    aha: "Being alone is a skill. {who} can learn it in small steps.",
    why: "Dogs are social. Being left is new and scary unless it is taught slowly, so it never gets too much.",
    tips: [],
    avoid: "Don't scold for what happened while you were out. They can't link it to what they did.",
    help: "Long howling, drooling, scratching at doors or hurting themselves trying to get out can be separation anxiety. Talk to your vet or a qualified trainer.",
    experts: ["zak", "nutkit", "happypuppy"],
  },
  {
    id: "skin",
    tab: "Skin and coat",
    problems: ["itch", "ticks", "coat"],
    aha: "Itchy skin is rarely just a skin problem.",
    why: "Skin is where diet, gut health and what you wash them with all show up. Fix it from the inside and the outside.",
    tips: [
      { t: "Bath less, gently", d: "Once every 3 to 4 weeks is plenty, with a mild dog shampoo. Human shampoo is too harsh." },
      { t: "Dry them fully", d: "Damp fur breeds fungus. Dry between the toes, in the ears and under the collar." },
      { t: "Check after walks", d: "Run your fingers over ears, neck, armpits and between toes for ticks." },
      { t: "Brush weekly", d: "It spreads natural oils and pulls out dead coat before it sheds on your sofa." },
      { t: "Add good fats", d: "Omega-3 from fish oil helps skin from inside. Ask your vet or nutritionist how much." },
    ],
    avoid: "Don't put human products or neat essential oils on their skin, and don't shave a double coat.",
    help: "Raw red patches, hair loss, a smelly ear, or scratching that keeps them awake needs a vet. Hot spots can spread in a day.",
    experts: ["backintheday", "happypuppy", "nutkit", "georgina", "doggiliciouus"],
  },
  {
    id: "food",
    tab: "Food",
    problems: ["tummy", "picky", "weight"],
    aha: "You don't have to change everything. A little fresh food goes a long way.",
    why: "Fresh, lightly processed food shows up in their skin, tummy, energy and mood. Dr. Karen Becker's approach: start small, and every bit of fresh counts.",
    tips: [],
    avoid: "Never feed grapes or raisins, onion, garlic, chocolate, xylitol (in sugar-free gum and some peanut butter), macadamia nuts or cooked bones.",
    help: "Vomiting or diarrhoea for more than a day, blood, not eating for a day, or sudden weight change needs a vet. A nutritionist can tailor a diet if you can, but a balanced published recipe works too.",
    experts: ["becker", "canineindia", "caninecraving", "doggiliciouus", "georgina", "carni", "kanine", "bowl", "woof", "proactive"],
  },
];

// Pulling and barking, and being alone: short tips in place of the long guides.
export const WALK_TIPS: Partial<Record<ProblemId, Tip[]>> = {
  pull: [
    { t: "Tight lead, stop", d: "The moment it goes tight, stand still and wait." },
    { t: "Slack lead, go", d: "When it loosens, say \"yes\" and walk on." },
    { t: "Pay at your side", d: "Treat by your leg when they walk next to you." },
    { t: "Sniff breaks", d: "Say \"go sniff\" and let them explore. Pulling stops being the only way." },
  ],
  bark: [
    { t: "Find the why", d: "Doorbell, window, boredom or attention: each has its own fix." },
    { t: "Block the view", d: "A curtain or frosted film on the window means less to shout at." },
    { t: "Reward the quiet", d: "Ignore attention barking. The second they stop, treat." },
    { t: "Teach \"quiet\"", d: "Let them bark twice, say \"quiet\", treat by the nose when they stop." },
  ],
  alone: [
    { t: "Start with seconds", d: "Step out and come back before they fuss. Build up slowly." },
    { t: "Boring goodbyes", d: "No big farewell, no big hello. Greet them once they are calm." },
    { t: "A leaving-only treat", d: "A stuffed chew or lick mat they only get when you go." },
    { t: "Sniff before you go", d: "A short sniffing game tires the mind so they rest." },
    { t: "A cosy spot", d: "A bed with something that smells of you." },
  ],
};

// ---------- food ----------

// The fresh food ladder, after Dr. Karen Becker (The Forever Dog, The Forever
// Dog Life). Owners pick how far they want to go; each rung says what to do.
// DRAFT: the 10% topper rule is hers; check the other rungs against the book.
export type Rung = { id: string; share: string; label: string; tips: Tip[] };

export const LADDER: Rung[] = [
  {
    id: "toppers",
    share: "10%",
    label: "Add toppers",
    tips: [
      { t: "Up to a tenth, fresh", d: "Fresh food can make up to 10% of the day's food without unbalancing the diet. No recipe needed." },
      { t: "Good toppers", d: "Blueberries, a lightly cooked egg, sardines in water (no salt), broccoli, pumpkin, cucumber, cooked mushrooms." },
      { t: "Fresh treats", d: "Swap packaged treats for fresh bites: blueberries, carrot, cucumber, small pieces of cooked meat." },
    ],
  },
  {
    id: "quarter",
    share: "25%",
    label: "A quarter fresh",
    tips: [
      { t: "Swap, don't add", d: "Replace a quarter of the usual food with balanced fresh food, and cut the old food by the same amount." },
      { t: "Balanced, not just meat", d: "Past 10%, the fresh part must be complete: a balanced recipe or a complete fresh food, not plain meat and rice." },
    ],
  },
  {
    id: "half",
    share: "50%",
    label: "Half fresh",
    tips: [
      { t: "Half and half", d: "Half the bowl balanced fresh food. Many owners do one fresh meal and one usual meal a day." },
      { t: "Rotate proteins", d: "Chicken, fish, mutton, egg: different proteins cover different nutrients." },
    ],
  },
  {
    id: "all",
    share: "100%",
    label: "All fresh",
    tips: [
      { t: "Complete recipes only", d: "Home-made food must supply calcium, zinc, vitamin E, iodine and more. Plain meat, rice and vegetables can't." },
      { t: "Use a vet-made recipe", d: "The Forever Dog Life has balanced recipes. Follow them exactly, including the supplements they call for." },
      { t: "Handle it clean", d: "Treat dog meat like your own: cold, clean surfaces, wash up after." },
    ],
  },
];

// Where to start on the ladder, from what is in the bowl now.
export const LADDER_START: Record<Bowl, string> = { kibble: "toppers", mix: "quarter", home: "all", fresh: "all" };

// A line for what is in the bowl now, above the ladder.
export const BOWL_NOTE: Record<Bowl, string> = {
  kibble: "Packaged food is a fine base. Start by adding fresh on top.",
  mix: "You're already part way. Make sure the fresh part is balanced.",
  home: "Home-cooked is great, if it's balanced. Rice and chicken alone misses calcium and other minerals.",
  fresh: "Fresh or raw is great, if it's balanced: the right mix of meat, bone, organ and nutrients.",
};

// For everyone, whatever the bowl.
export const FOOD_TIPS: Tip[] = [
  { t: "Switch slowly", d: "Change food over 7 to 10 days, a little more of the new each day." },
  { t: "Clean water", d: "Fresh, filtered water, always out. Wash the bowl daily." },
];

// Kept for the week plan: the first thing to try, by bowl.
export const BOWL_TIPS: Record<Bowl, Tip[]> = {
  kibble: [LADDER[0].tips[0], LADDER[0].tips[2]],
  mix: [LADDER[1].tips[1], LADDER[0].tips[2]],
  home: [LADDER[3].tips[0], LADDER[3].tips[1]],
  fresh: [LADDER[3].tips[0], LADDER[3].tips[1]],
};

export const BODY_TIPS: Partial<Record<ProblemId, Tip[]>> = {
  tummy: [
    { t: "Plain pumpkin", d: "A spoon of plain cooked pumpkin helps both loose and hard stools." },
    { t: "Smaller meals", d: "Two or three small meals are easier than one big one." },
    { t: "Gut support", d: "Probiotics can help. Ask your vet or nutritionist which one." },
  ],
  picky: [
    { t: "Meal times, not all day", d: "Put the bowl down for 15 minutes, then pick it up until the next meal." },
    { t: "Warm it up", d: "Warm food smells stronger, and smell is what makes a dog hungry." },
    { t: "Fewer treats", d: "A dog full of treats has no reason to eat dinner." },
  ],
  weight: [
    { t: "The rib test", d: "You should feel their ribs easily, like the back of your hand." },
    { t: "Measure meals", d: "Use a cup or scale, not a guess. Small extras add up fast." },
    { t: "Make it a hunt", d: "Use part of the meal for sniffing games. They eat slower and move more." },
  ],
};

// Coming soon on the Food tab.
export const BALANCE = {
  title: "Balance the bowl",
  line: "Tell us what you feed, and we'll show what's missing. Coming soon.",
};

export const FOOD_CREDIT = { text: "Our food advice follows Dr. Karen Becker's books The Forever Dog and The Forever Dog Life.", url: "https://drkarenbecker.com" };

// The three things to start this week: the first tip from each tab that applies.
export function weekPlan(groups: Group[], bowl: Bowl | null): (Tip & { group: GroupId })[] {
  const out: (Tip & { group: GroupId })[] = [];
  for (const g of groups) {
    const first =
      g.id === "food"
        ? bowl
          ? BOWL_TIPS[bowl][0]
          : FOOD_TIPS[0]
        : g.id === "toilet"
          ? { t: "Reward the right spot", d: "Every time they go in the right place, a treat and a \"good dog\" straight away." }
          : g.id === "walks"
            ? { t: "Tight lead, stop", d: "The moment the lead goes tight, stand still. Walk on when it's slack." }
            : g.id === "alone"
              ? WALK_TIPS.alone![0]
              : g.tips[0];
    if (first) out.push({ ...first, group: g.id });
    if (out.length === 3) break;
  }
  // Fewer than three tabs: fill up with the next food tips.
  const more = [...(bowl ? BOWL_TIPS[bowl].slice(1) : []), ...FOOD_TIPS];
  for (const tip of more) {
    if (out.length === 3) break;
    if (!out.some((o) => o.t === tip.t)) out.push({ ...tip, group: "food" });
  }
  return out;
}

// Which tabs this dog gets, in order. Food is always there.
export function groupsFor(needs: ProblemId[]) {
  return GROUPS.filter((g) => g.id === "food" || g.problems.some((p) => needs.includes(p)));
}
