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

// `src` credits the account a tip comes from (shown small under the tip).
// `for`: the problems a tip answers, so a plan can lead with what was asked.
// `go: "toys"` adds a "Check out brain toys" link that opens the toy shelf;
// `go: "elimination"` links to the guide to finding a food allergy.
export type Tip = { t: string; d: string; src?: string; for?: ProblemId[]; go?: "toys" | "elimination" | "garlic" };

export type Expert = {
  id: string;
  name: string;
  handle: string;
  // What they offer, in a line.
  what: string;
  // What kind of help: shown as a small label on the card.
  kind: "Nutritionist" | "Fresh food" | "Supplements" | "Skin and bath" | "Treats" | "Holistic care" | "Vet" | "Book" | "Trainer" | "Adoption" | "Vet hospital";
  site?: string;
  insta?: string;
  where?: string;
  groups: GroupId[];
  // Why they're a good fit for a particular problem, shown on a highlighted card.
  goodFor?: Partial<Record<ProblemId, string>>;
};

// ---------- the people we point to ----------

export const EXPERTS: Expert[] = [
  // Vet hospitals that also groom. From each hospital's own site, read 25 Oct 2026.
  {
    id: "vetic",
    name: "Vetic",
    handle: "vetic.in",
    what: "Vet hospitals with consultations, diagnostics, surgery, physiotherapy and grooming. 24/7 emergency care at some clinics, and vet visits at home.",
    kind: "Vet hospital",
    site: "https://vetic.in",
    where: "Delhi NCR, Mumbai, Pune, Bengaluru, Hyderabad, Chennai, Kolkata",
    groups: [],
  },
  {
    id: "cessna",
    name: "Cessna Lifeline",
    handle: "cessnalifeline.com",
    what: "Vet hospitals with consultations, diagnostics, surgery, physiotherapy, emergency care and grooming. Emergency line: +91 76763 65365.",
    kind: "Vet hospital",
    site: "https://cessnalifeline.com",
    where: "Bengaluru, Gurugram, Navi Mumbai",
    groups: [],
  },
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
    goodFor: {
      chew: "Natural chews that last, made in India.",
    },
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
    goodFor: {
      chew: "Natural chews, from a canine nutritionist's kitchen.",
    },
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
    goodFor: {
      itch: "Their highlights cover hotspots, dry skin and fungal infections.",
      ticks: "Their highlights cover ticks and monsoon care.",
      coat: "Gentle shampoos, and highlights on shedding.",
    },
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
    goodFor: {
      ticks: "A natural anti-tick spray.",
      itch: "Gentle natural skin care and an ear cleaner.",
      alone: "Calming mists for the days you're out.",
    },
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
    goodFor: {
      alone: "A calming spray for fireworks and stressful days.",
      bark: "Calming help, if the barking comes from fear.",
      itch: "Clays for hot spots and consults on skin.",
    },
  },
  {
    id: "becker",
    name: "The Forever Dog, by Dr. Karen Becker",
    handle: "@drkarenbecker",
    what: "The book our food advice follows, by vet Dr. Karen Becker and Rodney Habib. Her own supplements are sold as Proactive Paws.",
    kind: "Book",
    insta: "https://www.instagram.com/drkarenbecker/",
    groups: ["food"],
  },
  {
    id: "zak",
    name: "Zak George",
    handle: "Zak George on YouTube",
    what: "A dog trainer who teaches with rewards. Good for toilet training, lead walking and much more.",
    kind: "Trainer",
    site: "https://www.youtube.com/@zakgeorge",
    groups: ["toilet", "walks", "alone", "energy"],
    goodFor: {
      toilet: "His free videos take you through toilet training step by step.",
      pull: "Free, clear videos on loose-lead walking.",
      chew: "Free videos on chewing, and what to give them instead.",
      nip: "Free videos on puppy biting and what to do instead.",
      bark: "Free videos on why dogs bark and how to calm the barking.",
      alone: "Free videos on teaching a dog to be alone.",
      busy: "Free videos full of brain games and tricks to keep a busy dog's mind working.",
      settle: "Free videos on teaching a calm settle and an off switch.",
      night: "Free videos on calm routines, so evenings wind down.",
      mark: "Free videos on marking indoors and how to stop it.",
    },
  },
  {
    id: "tara",
    name: "Tara James · Canine Synergy",
    handle: "@canine_synergy",
    what: "Dog trainer behind Canine Synergy: customised board-and-trains, workshops and events. She also runs Anarchy K9s, Bangalore's working dog club.",
    kind: "Trainer",
    insta: "https://www.instagram.com/canine_synergy/",
    site: "https://www.caninesynergy.com",
    where: "Bengaluru",
    groups: ["toilet", "walks", "alone", "energy"],
    goodFor: {
      pull: "In Bengaluru and walks feel like a tug of war? Book hands-on help.",
      bark: "In Bengaluru? A trainer can find what sets the barking off.",
      toilet: "In Bengaluru and accidents keep happening? Get hands-on help.",
      alone: "In Bengaluru? Workshops and board-and-trains if you want hands-on help.",
    },
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
  {
    id: "secondchance",
    name: "Second Chance Sanctuary",
    handle: "@secondchancesanctuaryindia",
    what: "A Bengaluru trust that rescues, rehabilitates and rehomes dogs. Adopt, foster, volunteer or donate.",
    kind: "Adoption",
    insta: "https://www.instagram.com/secondchancesanctuaryindia/",
    groups: [],
  },
  {
    id: "sanjana",
    name: "Sanjana Madappa",
    handle: "@sanjana_madappa",
    what: "Co-founder of Second Chance Sanctuary and a long-time animal welfare volunteer in Bengaluru.",
    kind: "Adoption",
    insta: "https://www.instagram.com/sanjana_madappa/",
    groups: [],
  },
  {
    id: "forpawssake",
    name: "For Paws Sake",
    handle: "@forpawssake_",
    what: "Arsshleen Kaur's page for rescue, adoption and sterilisation. Dogs looking for homes turn up in her posts.",
    where: "Bengaluru",
    kind: "Adoption",
    insta: "https://www.instagram.com/forpawssake_/",
    groups: [],
  },
  {
    id: "goodoo",
    name: "Goodoo Animal Welfare",
    handle: "@goodoo.animal.welfare",
    what: "Goodoo Rescue and Rehab Centre, and Serene's Home for Senior Dogs. Closed for new intake until November 2026; donations help.",
    kind: "Adoption",
    insta: "https://www.instagram.com/goodoo.animal.welfare/",
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
  // A sharper aha when this is the main thing they asked about.
  ahaFor?: Partial<Record<ProblemId, { aha: string; why: string }>>;
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
    aha: "{who} needs more work for the mind, not more exercise.",
    why: "Chewing, nipping and not settling are a busy brain looking for a job. Sniffing and chewing give that busy brain one, and a calm dog follows.",
    ahaFor: {
      chew: {
        aha: "{who} isn't being naughty. Chewing is how dogs explore and calm down.",
        why: "You can't switch the urge off, but you can choose what gets chewed. Give the urge a better target every day and the furniture gets a rest.",
      },
      nip: {
        aha: "{who}'s teeth need a better target than your hands.",
        why: "Mouthing is how dogs play and explore. Swap hands for a toy every time, and they learn what's allowed.",
      },
      settle: {
        aha: "Settling is a skill {who} can learn.",
        why: "A dog who can't settle usually has a busy brain. A task with a clear end, like finding every last treat, makes switching off easier.",
      },
      night: {
        aha: "Calm evenings make for quiet nights.",
        why: "Rough play late on winds dogs up. A sniffy walk and a chew in the evening help them wind down for bed.",
      },
    },
    tips: [
      // Brain games first: a busy dog needs a job for the mind, not more rest advice.
      { t: "Make food a job", d: "Scatter part of a meal, or use a snuffle mat, instead of a bowl.", for: ["busy", "chew"], go: "toys" },
      { t: "Hide and find", d: "Hide a few treats around a room and say \"find it\". Start in plain sight, then make it harder. Five minutes of nose work tires the brain.", for: ["busy", "settle"], go: "toys" },
      { t: "Lick to calm", d: "Spread curd or mashed pumpkin on a lick mat, or freeze it to last longer. Licking is soothing and slows them right down.", for: ["settle", "busy"], go: "toys" },
      { t: "Muffin-tray puzzle", d: "Drop treats into a muffin tray and cover each cup with a ball or a scrunched sock. They work out how to get them: a free brain game.", for: ["busy"] },
      { t: "Slow the walk", d: "Let them stop and sniff. Ten minutes of their choosing beats thirty at your pace.", for: ["busy", "settle"] },
      { t: "Teach a settle", d: "When they lie down calmly on a mat, drop a treat between their paws. Short and often, and they learn that calm pays.", for: ["settle"] },
      { t: "Give a chew", d: "Something safe to work on, lying down, when you need them to switch off.", for: ["chew", "settle"], go: "toys" },
      { t: "Plan quiet time", d: "Grown dogs need 12 to 15 hours of sleep a day. After a brain game, give them a quiet spot and leave them be for an hour.", src: "@kaninenutrition", for: ["night"] },
      { t: "Wind down at night", d: "A slow, sniffy evening walk and a chew on their bed, then lights down. No rough play in the last hour.", for: ["night"] },
      { t: "Swap, don't scold", d: "When teeth land on hands or furniture, swap in a toy, then praise them for taking it.", for: ["nip", "chew"] },
    ],
    avoid: "Don't add more fetch or running to tire them out. It builds fitness and excitement, not calm.",
    help: "If they guard food or toys, snap, or chew until they hurt themselves, talk to a vet or a qualified trainer.",
    experts: ["canineindia", "caninecraving", "zak", "tara"],
  },
  {
    id: "toilet",
    tab: "Toilet",
    problems: ["toilet", "mark"],
    aha: "{who} will learn where to go when the right spot is rewarded.",
    why: "Dogs go where it smells right and where it pays. Reward the right spot every time, and the habit forms.",
    ahaFor: {
      mark: {
        aha: "Marking is about smell, not stubbornness.",
        why: "Dogs mark to leave their scent where others have. Take the old smell away, catch them in the act, and reward the right spot.",
      },
    },
    tips: [
      { t: "Reward the right spot", d: "Every time they go in the right place, a treat and a \"good dog\" straight away.", for: ["toilet"] },
      { t: "Learn their timing", d: "Puppies pee often. Note when they go for a few days and you'll know when they're due.", for: ["toilet"] },
      { t: "Out after naps and meals", d: "Take them to the spot after sleeping, eating and playing. That's when most accidents happen.", for: ["toilet"] },
      { t: "Clean old spots well", d: "Ordinary cleaners leave a smell they'll go on again. Use an enzyme cleaner on every old spot.", for: ["mark", "toilet"] },
      { t: "Catch them in the act", d: "A firm \"No\" as they start, then straight to the right spot and praise them there. Never scold later.", for: ["mark", "toilet"] },
      { t: "Less space at first", d: "Until they're reliable, keep them in a smaller area when you can't watch. Fewer rooms, fewer mistakes.", for: ["toilet"] },
      { t: "Accidents? Go back a step", d: "Go out more often, or move the pad closer again. Progress isn't a straight line.", for: ["toilet"] },
    ],
    avoid: "Don't scold accidents you find later, or rub their nose in it. They can't link it to what they did.",
    help: "If an older, trained dog starts having accidents, or pees very often, see a vet. It can be an infection.",
    experts: ["zak", "tara"],
  },
  {
    id: "walks",
    tab: "Walks and barking",
    problems: ["pull", "bark"],
    aha: "Pulling and barking continue because they get results.",
    why: "Pulling gets them there faster. Barking gets your attention. Make the calm choice the one that pays instead.",
    ahaFor: {
      pull: {
        aha: "{who} pulls because pulling works.",
        why: "Every step forward on a tight lead teaches them that pulling gets them there. Make a loose lead the only way to move.",
      },
      bark: {
        aha: "Barking is {who} talking. Find out what they're saying.",
        why: "Doorbell, window, boredom or wanting you: each bark has a reason, and each reason has its own fix.",
      },
    },
    tips: [],
    avoid: "Don't yank the lead or shout back. Skip choke, prong and shock collars.",
    help: "If barking comes with shaking, hiding or snapping, they may be scared. Talk to a vet or a qualified trainer.",
    experts: ["zak", "tara", "nutkit"],
  },
  {
    id: "alone",
    tab: "Home alone",
    problems: ["alone"],
    aha: "Being alone is a skill {who} can learn gradually.",
    why: "Dogs are social. Being left is new and scary unless it is taught slowly, so it never gets too much.",
    tips: [],
    avoid: "Don't scold for what happened while you were out. They can't link it to what they did.",
    help: "Long howling, drooling, scratching at doors or hurting themselves trying to get out can be separation anxiety. Talk to your vet or a qualified trainer.",
    experts: ["zak", "tara", "nutkit", "happypuppy"],
  },
  {
    id: "skin",
    tab: "Skin and coat",
    problems: ["itch", "ticks", "coat"],
    aha: "Itchy skin usually starts inside, not on the surface.",
    why: "Skin is where diet, gut health and what you wash them with all show up. Fix it from the inside and the outside.",
    ahaFor: {
      ticks: {
        aha: "Ticks are a two-minute, every-day check.",
        why: "Heat and monsoon bring ticks everywhere. A quick check after walks and a clean home keep them off {who}.",
      },
      coat: {
        aha: "A shiny, fresh-smelling coat starts in the bowl.",
        why: "Heavy shedding and a doggy smell usually mean the skin wants better fats and gentler washing, not more baths.",
      },
    },
    tips: [
      { t: "Feed the skin", d: "Skin shows what's happening in the gut and immune system. Animal protein first, grains and dal down.", src: "@backintheday.in", for: ["itch", "coat"] },
      { t: "Bath less, gently", d: "Once every 3 to 4 weeks is plenty, with a mild dog shampoo. Human shampoo is too harsh.", for: ["coat", "itch"] },
      { t: "Dry them fully", d: "Monsoon damp breeds fungus. Dry between the toes, in the ears and under the collar.", src: "@backintheday.in", for: ["itch", "coat"] },
      { t: "Check after walks", d: "Clean paws after every walk. Run your fingers over ears, neck, armpits and between toes for ticks.", src: "@kaninenutrition", for: ["ticks"] },
      { t: "Part the fur", d: "Brush short fur against the grain and part long fur, so you see the skin, not just the coat.", src: "@backintheday.in", for: ["ticks", "coat"] },
      { t: "Treat the home too", d: "Ticks and fleas live in bedding and corners. Wash bedding hot; food-grade diatomaceous earth helps in the home.", src: "@backintheday.in", for: ["ticks"] },
      { t: "Apple cider vinegar in the bowl", d: "A holistic way to make them less appealing to ticks and fleas: raw, unfiltered apple cider vinegar in their food, about ½ teaspoon per 10 kg a day. Not proven, but harmless. Keep up the tick checks.", src: "@backintheday.in", for: ["ticks"] },
      { t: "Fresh garlic, measured", d: "Fresh garlic is another holistic tick and flea deterrent. In measured amounts by weight, it isn't toxic: it isn't onion.", for: ["ticks"], go: "garlic" },
      { t: "It could be a food", d: "They could be reacting to something you give every day, often a protein like chicken. Once you know which, swap it for quail, duck, mutton or buffalo, rotating every few days.", src: "@carnikitchen", for: ["itch"], go: "elimination" },
      { t: "Add good fats", d: "Omega-3 from fish such as salmon or sardines helps calm itchy, inflamed skin.", src: "@canine_india", for: ["itch", "coat"] },
      { t: "Deworm properly", d: "Herbal dewormers aren't enough on their own, especially in India. Test and treat with your vet.", src: "@happypuppyorganics", for: ["itch"] },
      { t: "Soak the paws after walks", d: "A few centimetres of water in a tub, with povidone iodine (Betadine) stirred in until it's the colour of iced tea. Let them stand in it for 2 to 5 minutes, no scrubbing, then pat dry. Every 2 to 3 days, it washes off the pollen and grime they'd otherwise lick and chew.", src: "Dr. Karen Becker, The Forever Dog", for: ["itch"] },
    ],
    avoid: "Don't put human products or neat essential oils on their skin. Don't shave them: dogs sweat through their paws, and the coat protects them from heat.",
    help: "Raw red patches, hair loss, a smelly ear, or scratching that keeps them awake needs a vet. Hot spots can spread in a day.",
    experts: ["backintheday", "happypuppy", "nutkit", "georgina", "doggiliciouus"],
  },
  {
    id: "food",
    tab: "Food",
    problems: ["tummy", "picky", "weight", "joints"],
    aha: "Small amounts of fresh food make a real difference.",
    why: "Fresh, lightly processed food shows up in their skin, gut, weight and mood. Start with fresh toppers, then swap in as much fresh food as you can.",
    ahaFor: {
      joints: {
        aha: "Strong joints are built in the bowl and on the walk.",
        why: "A lean body, omega-3 and collagen-rich food, and gentle daily movement keep {who} moving well as they age.",
      },
    },
    tips: [],
    avoid: "Never feed grapes or raisins, onion (or chives), chocolate, macadamia nuts, nutmeg, xylitol (in sugar-free sweets and some peanut butter) or cooked bones.",
    help: "Vomiting or diarrhoea for more than a day, blood, or sudden weight change needs a vet. For a dog with a medical condition, ask a vet nutritionist to formulate the diet.",
    experts: ["becker", "canineindia", "caninecraving", "doggiliciouus", "georgina", "carni", "kanine", "bowl", "woof"],
  },
];

// Pulling and barking, and being alone: short tips in place of the long guides.
export const WALK_TIPS: Partial<Record<ProblemId, Tip[]>> = {
  pull: [
    { t: "Tight lead, stop", d: "The moment it goes tight, stand still and wait." },
    { t: "Slack lead, go", d: "When it loosens, say \"yes\" and walk on." },
    { t: "Pay at your side", d: "Treat by your leg when they walk next to you." },
    { t: "Sniff breaks", d: "Say \"go sniff\" and let them explore. Pulling stops being the only way." },
    { t: "A front-clip harness", d: "A harness that clips at the chest turns them gently back towards you when they pull. Kinder on the neck than a collar." },
    { t: "Sniff before you set off", d: "A few minutes of nosing around outside the door takes the edge off before the walk starts." },
  ],
  bark: [
    { t: "Find the why", d: "Doorbell, window, boredom or attention: each has its own fix." },
    { t: "Block the view", d: "A curtain or frosted film on the window means less to shout at." },
    { t: "Reward the quiet", d: "Ignore attention barking. The second they stop, treat." },
    { t: "Teach \"quiet\"", d: "Let them bark twice, say \"quiet\", treat by the nose when they stop." },
    { t: "Make the doorbell mean bed", d: "Have someone ring the bell, then treat them on their bed. Repeat until the bell sends them there." },
    { t: "Give the brain a job", d: "Bored dogs bark to fill the time. A sniff game or a chew every day leaves less to shout about.", go: "toys" },
  ],
  alone: [
    { t: "Start with seconds", d: "Step out and come back before they fuss. Build up slowly." },
    { t: "Boring goodbyes", d: "No big farewell, no big hello. Greet them once they are calm." },
    { t: "A leaving-only treat", d: "A stuffed chew or lick mat they only get when you go.", go: "toys" },
    { t: "Sniff before you go", d: "A short sniffing game tires the mind so they rest.", go: "toys" },
    { t: "A cosy spot", d: "A bed with something that smells of you." },
    { t: "Diwali and crackers", d: "Close doors and windows, draw curtains early, play calm music. Skip walks in peak cracker hours (6 to 11 pm). Keep their ID tag on.", src: "@kaninenutrition" },
    { t: "Calming smells", d: "A calming spray goes on a cloth near them, never on the dog, so they can move away from it.", src: "@doggiliciouus" },
    { t: "Not a second dog", d: "Getting another dog to keep them company rarely fixes the problem. You may end up with two dogs waiting for you.", src: "@kaninenutrition" },
  ],
};

// ---------- food ----------

// Everything on the Food tab follows The Forever Dog (Rodney Habib and
// Dr. Karen Becker), chapters 7 to 9, written in our own words. Amounts are
// converted from pounds to kilos and rounded. The Indian-kitchen notes and
// Indian names for foods are ours.

// Step 1: up to 10% of the day's calories as fresh "longevity foods".
export const TOPPER_TIPS: Tip[] = [
  { t: "Up to a tenth, fresh", d: "Vets agree up to 10% of a dog's calories can come from extras without unbalancing the diet. Use that 10% for fresh food." },
  { t: "Swap the junk treats", d: "Most dogs spend their 10% on biscuits and packaged treats. Give the same 10% as fresh bites instead." },
  { t: "Pea-sized pieces", d: "Chop toppers small, mix them in, or use them as training treats. Big dogs just get more pieces." },
  { t: "One new food at a time", d: "Try one bite of something new, then watch their poop. Refused today? Try again another day, or steamed." },
];

// What to put on top. Grouped so the list can be scanned.
export const TOPPERS: { group: string; items: string[] }[] = [
  { group: "Vegetables", items: ["Broccoli", "Pumpkin", "Green beans", "Carrot", "Celery", "Red bell pepper", "Zucchini", "Spinach (a little)", "Sweet potato (a little)", "Beetroot (a little)"] },
  { group: "Fruit", items: ["Raw green banana (kaccha kela)", "Papaya", "Pomegranate seeds", "Apple, no seeds", "Strawberries, no stems", "Blueberries", "Pineapple", "Coconut, unsweetened", "Kiwi"] },
  { group: "Protein", items: ["Egg, any way", "Sardines (mathi), in water", "Liver, heart and other organs", "Plain cooked chicken, fish, mutton"] },
  { group: "Spice box", items: ["Turmeric (haldi)", "Cumin (jeera)", "Cinnamon (dalchini)", "Fresh coriander", "Ginger", "Parsley", "A pinch of ground clove", "Fresh garlic, measured"] },
];

// Ready-cooked fresh food, for kibble feeders and vegetarian homes who
// won't cook. From Heads Up For Tails' own pages, read 26 Oct 2026.
const SARAS = "https://headsupfortails.com";
export const FRESH_READY = {
  name: "Sara's Wholesome",
  from: "₹99 for 100 g",
  all: `${SARAS}/collections/saras-wholesome-fresh-dog-food`,
  trial: `${SARAS}/products/saras-wholesome-100gm-trial-pack`,
  chicken: `${SARAS}/products/huft-saras-wholesome-food-classic-chicken-and-brown-rice-dog-food`,
  paneer: `${SARAS}/products/saras-wholesome-paneer-veggies-dog-food`,
  vegBiryani: `${SARAS}/products/saras-wholesome-vegetable-biryani-wet-dog-food-vegetarian-weekly-pack`,
};

// Fresh meat cut for dogs, delivered (Canine Craving), for anyone switching.
export const FRESH_MEAT_SHOP = {
  name: "Canine Craving",
  meat: "https://www.caninecraving.com/collections/dog-fresh-meat-seafood",
  meals: "https://www.caninecraving.com/collections/fresh-meal",
};

export const TOPPER_AMOUNTS: Tip[] = [
  { t: "Organs: a paw a day", d: "Liver and other organs are rich. About the size of your dog's paw is plenty for a day." },
  { t: "Sardines: 1 per 9 kg", d: "One sardine for every 9 kg of dog, two or three times a week." },
  { t: "Spices: a pinch per 5 kg", d: "A pinch (about ⅛ tsp) of a dried spice for every 5 kg, mixed into the food. Fresh herbs: ¼ tsp per 9 kg." },
  { t: "Watching their weight? Swap, don't add", d: "Take 10% of their usual food away and give fresh toppers in its place, so the bowl stays the same size." },
];

// Step 2: how much of the bowl to make fresh. "Fresh" means lightly
// processed: complete home-made food (raw or cooked), store-bought fresh or
// raw, freeze-dried or dehydrated meals.
export type Rung = { id: string; share: string; label: string; tips: Tip[] };

export const LADDER: Rung[] = [
  {
    id: "toppers",
    share: "10%",
    label: "Toppers only",
    tips: [
      { t: "Keep the base, add fresh", d: "Keep their usual food. Just add the 10% toppers above. A real step on its own." },
      { t: "Better treats count too", d: "Swapping packaged treats for fresh bites or dried all-meat treats is a good first move." },
    ],
  },
  {
    id: "quarter",
    share: "25%",
    label: "A quarter fresh",
    tips: [
      { t: "Swap a quarter", d: "Replace a quarter of their usual food with fresh food. With toppers, that's about a third of the bowl fresh." },
      { t: "Take your time", d: "It's fine to take three months to get here. Just start somewhere." },
    ],
  },
  {
    id: "half",
    share: "50%",
    label: "Half fresh",
    tips: [
      { t: "Half the bowl", d: "Half fresh food plus toppers: about two thirds of what they eat is fresh." },
      { t: "Mix and match", d: "Some meals fully fresh, some half and half. Raw and cooked can share one bowl." },
    ],
  },
  {
    id: "all",
    share: "100%",
    label: "All fresh",
    tips: [
      { t: "The gold standard", d: "No packaged food at all, plus toppers. Home-made, store-bought fresh, or a mix of both." },
      { t: "Rotate", d: "Change proteins and recipes over time. Variety feeds the gut and covers more nutrients." },
    ],
  },
];

// Where to start on the ladder, from what is in the bowl now.
export const LADDER_START: Record<Bowl, string> = { kibble: "toppers", mix: "quarter", veg: "all", meat: "all", raw: "all" };

export const BOWL_NOTE: Record<Bowl, string> = {
  kibble: "Packaged food is a fine base to start from. Begin with toppers, then swap in fresh when you're ready.",
  mix: "You're already part way. Make sure the fresh part is a complete recipe.",
  veg: "A vegetarian bowl is fresh, but it can't be complete for a dog. Start by adding eggs or meat, cooked separately if your home is vegetarian.",
  meat: "Chicken, rice and veg is a good start. On its own it usually runs short on a few things dogs need, like calcium, omega-3 and vitamin D. Put in what you feed above, and we'll show what to add.",
  raw: "Raw meat and veg is a great base. On its own it usually runs short on a few things, like calcium, omega-3 and vitamin D. Put in what you feed above, and we'll show what to add.",
};

// Making the bowl complete: for a dog already on fresh food.
export const HOMEMADE_TIPS: Tip[] = [
  { t: "Add what's missing", d: "Meat, rice and veg alone run short on a few things. Add an egg (vitamin D, choline), sardines twice a week (omega-3), a little liver or mutton (zinc), and eggshell powder for calcium: about half a teaspoon per 500 g of meat." },
  { t: "Then check it in the bowl above", d: "Put in a normal day's bowl, weighed after cooking. We'll show what's still short, like zinc or vitamin E, and what to add, in grams." },
  { t: "Keep it steady", d: "Once the bowl balances, keep the same foods and amounts. Swapping one thing for another slowly unbalances it, and a human multivitamin won't fix it." },
];

// Cooking it at home, step by step. Shown under "Making it at home" and in
// the diet chart. Every amount on the site is a cooked weight.
export const COOKING: Tip[] = [
  { t: "Get a kitchen scale", d: "It's the one tool you need. Weigh the meat after it's cooked: every amount on Pet Buddha, in the diet chart and the bowl checker, is a cooked weight." },
  { t: "Pressure cook the meat", d: "Put the chicken in the cooker with at least as much water as meat (1:1, or a little more). One whistle is enough; more makes it tough. Or simmer it gently in a pan until just cooked through." },
  { t: "Keep the broth", d: "Don't throw the water away. It holds goodness from the meat, and a few spoons over the bowl makes any meal more welcome." },
  { t: "Bones out, every time", d: "Cooked bones turn brittle and splinter, and can cut their mouth or gut. Pick out every bone and throw them away." },
  { t: "No salt, chilli or masala", d: "Nothing from our spice box but a pinch of haldi, jeera or dalchini. No salt, chilli, onion, garam masala or ready pastes." },
  { t: "Plain is perfect for them", d: "Dogs have about a fifth of the taste buds we do, and they eat with their nose. Plain meat and its broth already smell wonderful to them, so there's no need to make it \"tasty\"." },
  { t: "Veg, lightly", d: "Steam or boil the veg lightly, or chop it raw and fine, then mix it in." },
];

export const HOMEMADE_LINKS = [
  { label: "Find a fresh food consultant", url: "https://freshfoodconsultants.org" },
];

// Packaged food: how to read the bag.
export const SKIP_INGREDIENTS = ["Any \"meal\" (meat meal, poultry meal)", "By-products", "Animal or poultry digest", "\"Animal fat\"", "Soy", "Added colours", "BHA, BHT or ethoxyquin", "Propylene glycol"];

// When and how much.
export const WHEN_TIPS: Tip[] = [
  { t: "An 8-hour window", d: "Give all of the day's food within about 8 hours, and nothing in the last 2 hours before bed." },
  { t: "One or two meals", d: "Grown dogs at a healthy weight do well on one or two meals a day. Pick the bowl up between meals." },
  { t: "A skipped meal is fine", d: "If a healthy dog doesn't want a meal, let them skip it. Some nutritionists suggest a fast day once a month for healthy adults.", src: "@georginaskitchen.india" },
  { t: "Treats with a purpose", d: "Treats are for rewards: pea-sized, fresh. No toast crusts or biscuits \"just because\"." },
];

// Shown for big dogs (25 kg and up).
export const BIG_DOG_TIPS: Tip[] = [
  { t: "Bloat: rest around meals", d: "Big dogs are prone to bloat, which can kill. Smaller meals, and no running for 30 minutes before and after food.", src: "@kaninenutrition" },
];

export const PUPPY_NOTE = "Puppies can start fresh food as soon as they're weaned, but they need more minerals and their amounts change as they grow (Carni Kitchen revises puppy charts every 2 months). Keep their meals spread through the day and ask your vet when to move to fewer.";

// Switching food.
export const SWITCH_TIPS: Tip[] = [
  { t: "Start with a tenth", d: "Day one: swap 10% of the old food for the new. Add 5 to 10% more each day if their poop stays firm." },
  { t: "Soft poop? Pause", d: "Hold at the same mix until it firms up, then carry on." },
  { t: "Pumpkin helps", d: "A teaspoon of plain cooked pumpkin per 5 kg firms up soft stools during a switch." },
  { t: "Buy before you run out", d: "Never jump straight to a new food because the old one ran out." },
];

// Indian kitchens: the habits that most often go wrong at home.
export const INDIAN_KITCHEN: Tip[] = [
  { t: "Cook theirs plain", d: "Set their portion aside before onion, salt, chilli and masala go in. Onion is one of the few truly toxic foods." },
  { t: "Animal protein first", d: "Dogs with chronic itchy skin are often on bowls heavy in rice, roti, bajra, jowar, dal or soya. Meat should be the base.", src: "@backintheday.in" },
  { t: "Skip the WhatsApp advice", d: "Rice isn't essential, and roti and rice isn't a diet. Start from the dog's biology, not human food habits.", src: "@georginaskitchen.india" },
  { t: "Fruit: a few cubes", d: "Three or four small cubes a day is plenty. Too much fruit sugar can feed yeast and itchy skin.", src: "@backintheday.in" },
  { t: "Veg-only bowls", d: "A good packaged food is better for a dog than an unbalanced or vegetarian home diet.", src: "@carnikitchen" },
  { t: "Chicken in summer is fine", d: "If they handle chicken well, keep it. Add a cooling protein alongside, or pause it a few days.", src: "@carnikitchen" },
  { t: "Fresh on a budget", d: "Rotating basic, cheaper meats works well. Exotic meats aren't needed for a fresh diet.", src: "@carnikitchen" },
  { t: "Curd: plain only", d: "A spoon of plain curd is fine. Skip flavoured and sweetened yoghurt.", src: "@kaninenutrition" },
  { t: "No biscuits as treats", d: "Swap Marie or Parle-G for fresh bites: carrot, cucumber, a bit of egg or chicken." },
  { t: "Your spice box helps", d: "Haldi, jeera, dalchini and fresh coriander are good for dogs in pinches. Skip nutmeg (jaiphal)." },
  { t: "Keep sweets away", d: "Chocolate and sugar-free sweets (xylitol) are toxic. Raisins in mithai and kheer are too." },
];

// For everyone, whatever the bowl.
export const FOOD_TIPS: Tip[] = [
  { t: "One change at a time", d: "Change six things in a day and you can't tell what upset the tummy. New food, treat or supplement: one at a time.", src: "@georginaskitchen.india" },
  { t: "Rotate proteins", d: "Keep at least 2 or 3 meats in rotation: chicken, mutton, fish, egg. The same one every day narrows what they get.", src: "@carnikitchen" },
  { t: "Bones: raw, never cooked", d: "Cooked bones splinter. Raw, dried or ground bone is fine, sized for your dog's size and age.", src: "@carnikitchen" },
  { t: "Keep supplements simple", d: "Good food first. A cupboard of supplements isn't the goal; add one only for a reason.", src: "@whatsinmydogbowl" },
  { t: "Read past the front", d: "\"With chicken\" or a blueberry on the pack means little. Check the ingredient order and what fills the rest.", src: "@georginaskitchen.india" },
  { t: "Watch the poop", d: "It tells you how fast to go. Firm is good. Soft means slow down." },
  { t: "Clean water", d: "Fresh, filtered water, always out." },
];

// Older dogs.
export const SENIOR_TIPS: Tip[] = [
  { t: "More protein, not less", d: "Less protein for seniors is a myth. Keeping muscle matters more with age, so keep good protein in the bowl.", src: "@kaninenutrition" },
  { t: "Ramps over jumps", d: "Jumping off beds and sofas adds up on joints. A ramp makes everyday movement easier.", src: "@carnikitchen" },
];

// Kept for the week plan: the first thing to try, by bowl.
export const BOWL_TIPS: Record<Bowl, Tip[]> = {
  kibble: [TOPPER_TIPS[0], TOPPER_TIPS[1]],
  mix: [TOPPER_TIPS[0], HOMEMADE_TIPS[0]],
  veg: [HOMEMADE_TIPS[0], HOMEMADE_TIPS[1]],
  meat: [HOMEMADE_TIPS[0], HOMEMADE_TIPS[1]],
  raw: [HOMEMADE_TIPS[0], TOPPER_TIPS[0]],
};

export const BODY_TIPS: Partial<Record<ProblemId, Tip[]>> = {
  tummy: [
    { t: "Plain pumpkin", d: "A teaspoon of plain cooked pumpkin per 5 kg on the food firms up loose stools." },
    { t: "Slow every change", d: "New foods one at a time, in tiny amounts. Wait for normal poop before the next one." },
    { t: "Gut support", d: "Probiotics and digestive enzymes before a food change make it easier. Mild loose stools in the first week of a probiotic usually settle.", src: "@georginaskitchen.india" },
    { t: "Ginger for gas", d: "Cooled ginger tea on the food can ease bloating, gas and acid reflux.", src: "@georginaskitchen.india" },
  ],
  picky: [
    { t: "Make it smell like food", d: "Picky eaters often come round for a stronger smell. Put a few tiny bits of cooked liver or chicken heart on top, then use less and less as they start eating." },
    { t: "Hide it, chop it fine", d: "Mix new foods right into the usual food, very finely chopped. A spoon of plain broth helps." },
    { t: "Meal times only", d: "Pick the bowl up between meals. A dog that grazes all day has no reason to be keen." },
  ],
  joints: [
    { t: "Keep them lean", d: "Every extra kilo loads the joints. A lean dog moves more easily, and for longer." },
    { t: "Rugs on slippery floors", d: "Marble and tile make dogs slip and strain. Runners or mats where they walk most help a lot, especially for older dogs." },
    SENIOR_TIPS[1],
    { t: "Little and often", d: "Two or three gentle walks are easier on joints than one long one, especially on stiff days." },
    { t: "Fish and cartilage in the bowl", d: "Omega-3 from sardines or mackerel calms inflammation. Chicken feet and bone broth bring natural collagen and glucosamine." },
    { t: "Start before it hurts", d: "Big and long-backed breeds are prone to joint trouble later. Joint support can start once they're fully grown.", src: "Doggiliciouus" },
  ],
  weight: [
    { t: "Check their body shape first", d: "Weight alone doesn't tell you much. A two-minute body condition check shows whether they're carrying extra, and how much to aim to lose." },
    { t: "Feed for the weight you want", d: "Work out the calories for their target weight, not the weight they are now, and feed that." },
    { t: "Weigh the food", d: "Use a kitchen scale for a week. Cups and handfuls creep up without anyone noticing." },
    { t: "Swap starch for veg", d: "Cut back the rice, roti or kibble and fill the gap with green beans, pumpkin or zucchini. Same full bowl, far fewer calories." },
    { t: "Treats count", d: "Keep treats under a tenth of the day. Use bits of their meal, or crunchy veg, as rewards." },
    { t: "Slow and steady", d: "Aim to lose about 1% of their body weight a week. Weigh them every week, same time, same scale. Ask your vet to confirm the target.", src: "@whatsinmydogbowl" },
  ],
};

// Fresh garlic per day by weight, from The Forever Dog (converted from pounds).
// Fresh cloves only: no garlic pills or powders. Onion is never safe.
export function garlicCloves(kg: number) {
  if (kg < 4.5) return null;
  if (kg < 9) return "half a clove";
  if (kg < 20) return "1 clove";
  if (kg < 34) return "1½ cloves";
  if (kg < 45) return "2 cloves";
  return "2½ cloves";
}

// The research behind the garlic advice. Summaries are ours, from each
// paper's abstract on PubMed (read 17 Oct 2026).
export const GARLIC_RESEARCH = [
  {
    title: "Hematologic changes after giving garlic extract to dogs",
    cite: "Lee, Yamato, Tajima, Kuraoka, Omae & Maede. American Journal of Veterinary Research, 2000",
    url: "https://doi.org/10.2460/ajvr.2000.61.1446",
    plain: "4 dogs got a very large dose: garlic extract equal to 5 g of whole garlic per kg of body weight, daily for 7 days. Their red blood cells showed damage, but no dog developed anaemia. The authors still advised against feeding garlic.",
  },
  {
    title: "Garlic and onion compounds on immune cells and platelets in dogs and humans",
    cite: "Chang, Yamato, Sakai, Yamasaki & Maede. Prostaglandins, Leukotrienes and Essential Fatty Acids, 2004",
    url: "https://doi.org/10.1016/j.plefa.2003.08.006",
    plain: "The study The Forever Dog points to. The same team tested garlic's compound on dog and human blood cells in the lab (not in dogs eating garlic) and concluded it may support immune function and heart health.",
  },
  {
    title: "Garlic and onion compounds slow tumour cell growth",
    cite: "Chang, Yamato, Yamasaki, Ko & Maede. Cancer Letters, 2005",
    url: "https://doi.org/10.1016/j.canlet.2004.10.008",
    plain: "A follow-up lab study on human tumour cell lines: garlic's compound slowed their growth. Again a lab study, not a feeding trial.",
  },
];

export const GARLIC_CONTEXT =
  "For scale: the book's amount for a 15 kg dog is about 1 clove (roughly 4 g) a day, around 20 times less than the dose in the 2000 study. No study has fed dogs everyday amounts of fresh garlic for a long time, so stick to the measured amounts and stop if they seem unwell.";

// Roughly how many calories a grown dog needs a day, from weight in kg
// (resting need; active dogs need more).
export const dailyCalories = (kg: number) => Math.round((kg * 30 + 70) / 10) * 10;

// Starch in dry food, from the label: 100 minus the rest. Ash is 6% if not listed.
export function starchPercent(v: { protein: number; fat: number; fibre: number; moisture: number; ash?: number }) {
  return Math.max(0, Math.round(100 - (v.protein + v.fat + v.fibre + v.moisture + (v.ash ?? 6))));
}
export const starchGrade = (pct: number) => (pct < 10 ? "Best" : pct < 15 ? "Better" : pct < 20 ? "Good" : "High in starch");

// Coming soon on the Food tab.
export const BALANCE = {
  title: "Balance the bowl",
  line: "Tell us what you feed, and we'll show what's missing. Coming soon.",
};

export const FOOD_CREDIT = { text: "Our food advice follows The Forever Dog by Rodney Habib and Dr. Karen Becker.", url: "https://foreverdog.com" };

// The three things to start this week: the first tip from each tab that applies.
// The first thing to do for problems whose tips live outside their tab.
const FIRST_STEP: Partial<Record<ProblemId, Tip>> = {
  pull: { t: "Tight lead, stop", d: "The moment the lead goes tight, stand still. Walk on when it's slack." },
};

// "Start with these three": one first step for each problem the owner asked
// about, in the order they appear in the questions. If they asked about
// fewer than three, the next most useful tips for those same problems fill
// in. Nothing they didn't ask about.
export function weekPlan(groups: Group[], needs: ProblemId[]): (Tip & { group: GroupId })[] {
  const out: (Tip & { group: GroupId })[] = [];
  const asked = needs.filter((p) => p !== ("" as ProblemId));
  const groupOf = (p: ProblemId): GroupId => groups.find((g) => g.problems.includes(p))?.id ?? "food";
  // Every tip that answers a problem, best first.
  const forProblem = (p: ProblemId): Tip[] => {
    const g = groups.find((x) => x.problems.includes(p));
    // Tips mainly about this problem (named first in `for`) come first.
    const tagged = (g?.tips ?? []).filter((t) => t.for?.includes(p)).sort((a, b) => a.for!.indexOf(p) - b.for!.indexOf(p));
    // Then anything else in the same tab, so a problem with few tips still fills up.
    return [...(FIRST_STEP[p] ? [FIRST_STEP[p]!] : []), ...tagged, ...(WALK_TIPS[p] ?? []), ...(BODY_TIPS[p] ?? []), ...(g?.tips ?? [])];
  };
  const add = (tip: Tip, p: ProblemId) => {
    if (out.length < 3 && !out.some((o) => o.t === tip.t)) out.push({ ...tip, group: groupOf(p) });
  };
  // One each, then a second each, and so on, until there are three.
  for (let round = 0; round < 4 && out.length < 3; round++) {
    for (const p of asked) {
      const tip = forProblem(p).filter((t) => !out.some((o) => o.t === t.t))[0];
      if (tip) add(tip, p);
    }
  }
  // Keep tips from the same tab next to each other, in the order their
  // tabs first came up, so the three read as one or two clear topics.
  const first = (g: GroupId) => out.findIndex((o) => o.group === g);
  return out.map((o, i) => ({ o, i })).sort((a, b) => first(a.o.group) - first(b.o.group) || a.i - b.i).map(({ o }) => o);
}

// A tab's tips with the ones for the asked-about problems first.
export function tipsFor(tips: Tip[], needs: ProblemId[]): Tip[] {
  // Only tips for what was asked, plus general ones that aren't tied to a problem.
  tips = tips.filter((t) => !t.for || t.for.some((p) => needs.includes(p)));
  // By the first asked problem it answers, then by how central that
  // problem is to the tip.
  const score = (t: Tip) => {
    const i = needs.findIndex((p) => t.for?.includes(p));
    return i === -1 ? 99 : i * 10 + t.for!.indexOf(needs[i]);
  };
  return [...tips].sort((a, b) => score(a) - score(b));
}

// The tab's headline and line under it, sharpened to the main problem asked.
// The Food tab's headline, by what's in the bowl. Anyone not already on a
// fresh, meat-based bowl is nudged towards one.
const BOWL_HEAD: Record<Bowl, { aha: string; why: string }> = {
  kibble: {
    aha: "Swap some of the packaged food for fresh meat.",
    why: "Even a quarter of the bowl as fresh, meat-based food cuts the starch and processing {who} eats every day. Start with fresh toppers, then swap in more.",
  },
  mix: {
    aha: "You're part way there. Swap more of the packaged food for fresh meat.",
    why: "Every bit of packaged food you replace with fresh, meat-based food brings the starch down. Aim for a bowl that's mostly meat.",
  },
  veg: {
    aha: "Dogs need meat. Start adding eggs and meat to the bowl.",
    why: "A vegetarian bowl is fresh, but it can't be complete for a dog: it runs short on taurine, protein and key nutrients. Eggs are an easy first step; cook meat separately if your home is vegetarian.",
  },
  meat: {
    aha: "Fresh, meat-based food is the best start. Now make it complete.",
    why: "Check {who}'s bowl below for anything missing, like calcium, omega-3 or vitamin D, and fix the gaps in a tap.",
  },
  raw: {
    aha: "Raw is a great base. Now make sure it's complete.",
    why: "Check {who}'s bowl below for anything missing, like calcium, omega-3 or vitamin D, and fix the gaps in a tap.",
  },
};

export function headlineFor(g: Group, needs: ProblemId[], bowl?: Bowl | null): { aha: string; why: string } {
  // Food: packaged, mixed and vegetarian bowls hear "switch to fresh meat"
  // first; meat-based and raw bowls let a problem they asked about lead.
  if (g.id === "food" && bowl && bowl !== "meat" && bowl !== "raw") return BOWL_HEAD[bowl];
  // The first problem asked about in this tab decides; if it has no sharper
  // line of its own, the tab's general one is used.
  const p = needs.find((x) => g.problems.includes(x));
  if (p && g.ahaFor?.[p]) return g.ahaFor[p]!;
  if (g.id === "food" && bowl) return BOWL_HEAD[bowl];
  return { aha: g.aha, why: g.why };
}

// Which tabs this dog gets, in order. Food is always there.
// The tab's name, from only what the owner ticked: "Barking" when they
// picked barking alone, not "Walks and barking".
const TAB_PARTS: Partial<Record<GroupId, { name: string; problems: ProblemId[] }[]>> = {
  energy: [
    { name: "Energy", problems: ["busy", "settle", "night"] },
    { name: "Chewing", problems: ["chew", "nip"] },
  ],
  walks: [
    { name: "Walks", problems: ["pull"] },
    { name: "Barking", problems: ["bark"] },
  ],
  skin: [
    { name: "Skin and coat", problems: ["itch", "coat"] },
    { name: "Ticks", problems: ["ticks"] },
  ],
};

export function tabName(g: Group, needs: ProblemId[]) {
  const parts = TAB_PARTS[g.id];
  if (!parts) return g.tab;
  const on = parts.filter((x) => x.problems.some((p) => needs.includes(p)));
  if (on.length !== 1) return g.tab;
  return on[0].name === "Ticks" ? "Ticks and fleas" : on[0].name;
}

export function groupsFor(needs: ProblemId[]) {
  return GROUPS.filter((g) => g.id === "food" || g.problems.some((p) => needs.includes(p)));
}

// ---------- why fresh: the bowl comparison ----------

// The opening of the Food tab: the bowl they feed now next to a fresh one,
// one difference per row, each with why it matters. From The Forever Dog
// (chapters 2, 5 and 8), in our own words. `for` marks the rows that speak
// to a problem the owner ticked, so those can be pointed out.
export type CompareRow = { topic: string; sticker: string; now: string; fresh: string; why: string; for?: ProblemId[] };
export type Compare = { now: string; fresh: string; rows: CompareRow[]; note?: string };

const KIBBLE_ROWS: CompareRow[] = [
  {
    topic: "Water",
    sticker: "bowl",
    now: "Dry: only about a tenth water.",
    fresh: "Mostly water, like real meat and veg.",
    why: "Dogs aren't designed to live on low-moisture, dried food. Fresh food hydrates with every bite.",
  },
  {
    topic: "Starch",
    sticker: "leaf",
    now: "Often 30 to 60% starch, which turns into sugar.",
    fresh: "Little starch. Under 10% is natural for dogs.",
    why: "Dogs need no starch. A carby meal can keep insulin raised for up to eight hours, meal after meal.",
    for: ["weight"],
  },
  {
    topic: "Cooking",
    sticker: "sparkle",
    now: "Extruded: cooked under pressure at very high heat.",
    fresh: "Lightly cooked, or raw.",
    why: "High heat creates harmful by-products. One study found dogs take in up to 122 times more of them than people do.",
  },
  {
    topic: "Skin",
    sticker: "paw",
    now: "Ultra-processed, carb-heavy food is a risk factor for allergies.",
    fresh: "Fresh, meat-based food is linked to fewer itchy-skin allergies.",
    why: "A Finnish study found a fresh, meat-based diet early in life protects against itchy skin, while a processed, carb-heavy one is a risk.",
    for: ["itch", "coat"],
  },
  {
    topic: "Gut",
    sticker: "heart",
    now: "Heat-processed food feeds a less varied gut.",
    fresh: "A richer, more varied gut.",
    why: "Researchers comparing diets found raw food fosters a much richer gut community, and heat by-products can feed harmful bacteria.",
    for: ["tummy"],
  },
  {
    topic: "Weight",
    sticker: "ball",
    now: "The more kibble dogs eat, the likelier they are to be overweight.",
    fresh: "Easier to keep lean on real food.",
    why: "Starch is quick fuel the body stores as fat when it isn't burned.",
    for: ["weight"],
  },
];

export const COMPARE: Record<Bowl, Compare> = {
  kibble: { now: "Packaged food", fresh: "A fresh bowl", rows: KIBBLE_ROWS },
  mix: {
    now: "The packaged part",
    fresh: "A fresh bowl",
    rows: KIBBLE_ROWS,
    note: "You're already part way there. The packaged half is where the starch and the heat damage come from, so every bit you swap counts.",
  },
  veg: {
    now: "A vegetarian bowl",
    fresh: "A complete fresh bowl",
    rows: [
      {
        topic: "Base",
        sticker: "bowl",
        now: "Rice or roti with dal, curd or paneer.",
        fresh: "Meat and organs first, vegetables second, little grain.",
        why: "Dogs run on protein and fat. Rice, roti and dal are mostly starch, which turns into sugar.",
        for: ["weight"],
      },
      {
        topic: "Heart",
        sticker: "heart",
        now: "Little taurine: plants carry almost none.",
        fresh: "Taurine from meat, dark chicken and fish.",
        why: "Taurine keeps the heart muscle strong. Diets heavy in lentils and peas have been linked to a heart disease called DCM.",
      },
      {
        topic: "Balance",
        sticker: "sparkle",
        now: "Short on omega-3, iron, zinc and vitamin D.",
        fresh: "A recipe made to meet a dog's nutrient needs.",
        why: "A UC Davis study found 95% of 200 home-made dog recipes short on at least one essential nutrient.",
        for: ["itch", "coat"],
      },
    ],
    note: "Eggs are an easy first step: their protein matches what a dog's body needs.",
  },
  meat: {
    now: "A typical home bowl",
    fresh: "A complete fresh bowl",
    rows: [
      {
        topic: "Base",
        sticker: "bowl",
        now: "Mostly rice or roti, with some dal or meat.",
        fresh: "Meat and organs first, vegetables second, little grain.",
        why: "Dogs do best getting their energy from protein and fat. Rice and roti are starch, which turns into sugar.",
        for: ["weight"],
      },
      {
        topic: "Balance",
        sticker: "sparkle",
        now: "Chicken, rice and veg, with nothing added.",
        fresh: "The same, plus egg, sardines and calcium.",
        why: "Chicken, rice and veg run short on calcium, omega-3 and vitamin D. Small add-ons fill the gaps, and Balance the bowl below shows which ones.",
        for: ["itch", "coat"],
      },
      {
        topic: "Cooking",
        sticker: "leaf",
        now: "Often pressure-cooked, fried or browned.",
        fresh: "Gently poached until just done, or raw.",
        why: "Browning food creates harmful by-products. Gentle cooking keeps more of the good stuff.",
        for: ["tummy"],
      },
    ],
    note: "Fresh, meat-based food is the best start there is. A few changes make it complete.",
  },
  raw: {
    now: "Raw, unchecked",
    fresh: "Raw and complete",
    rows: [
      {
        topic: "Balance",
        sticker: "sparkle",
        now: "Meat and veg, with nothing added.",
        fresh: "Plus organs, oily fish, and bone or calcium.",
        why: "Meat and veg alone run short on calcium, omega-3 and vitamin D. Small add-ons fill the gaps, and Balance the bowl below shows which ones.",
      },
      {
        topic: "Organs",
        sticker: "heart",
        now: "Mostly muscle meat.",
        fresh: "Organs like liver and heart in the mix.",
        why: "Organs carry vitamins and minerals muscle meat doesn't. A little goes a long way.",
      },
      {
        topic: "Handling",
        sticker: "leaf",
        now: "Meat from any shop, handled like a meal for people.",
        fresh: "Fresh meat from a trusted source, kept cold, bowls washed.",
        why: "Raw meat can carry germs like salmonella. Good sourcing and kitchen hygiene keep the risk low for the dog and your family.",
      },
    ],
    note: "You're feeding the gold standard. Just make sure it's complete.",
  },
};

// ---------- the perfect bowl, vegetarian bowls, and why garlic ----------

// What a complete fresh bowl is made of, by rough share of the bowl. From
// The Forever Dog: about half the calories from protein and half from fat,
// starch under 10%, made to a complete recipe. The shares are a picture of
// the idea, not a recipe.
export const PERFECT_BOWL: { id: string; label: string; share: number; color: string; line: string }[] = [
  { id: "meat", label: "Meat and organs", share: 55, color: "#d9654f", line: "The base. Muscle meat with a little liver or heart. This is where most of the protein and fat comes from." },
  { id: "fish", label: "Eggs and fish", share: 15, color: "#f2b33d", line: "Eggs, sardines or other oily fish. Egg protein matches what a dog's body needs, and fish brings omega-3 fats." },
  { id: "veg", label: "Vegetables and greens", share: 20, color: "#7fb069", line: "Chopped, lightly cooked or raw: broccoli, pumpkin, green beans, carrot. Fibre for the gut, without much starch." },
  { id: "extra", label: "Fruit and toppers", share: 7, color: "#8c9cf5", line: "A few cubes of fruit or berries, and fresh toppers. Part of the 10% extras." },
  { id: "herbs", label: "Herbs and spices", share: 3, color: "#2e6a4c", line: "A pinch of haldi, jeera or dalchini, fresh coriander, and measured fresh garlic." },
];

export const PERFECT_BOWL_RULES: Tip[] = [
  { t: "Half protein, half fat", d: "Roughly half a dog's calories should come from protein and half from fat. That's the diet dogs choose and do best on." },
  { t: "Starch under 10%", d: "Rice, roti and other grains turn into sugar. Dogs need none; under 10% is natural, up to 20% for very active dogs." },
  { t: "Nothing missing", d: "Meat and veg alone leave a few gaps, like calcium and vitamin D. A few measured add-ons, or a complete recipe, fill them." },
];

// Can a dog be vegetarian? From The Forever Dog (chapter 5) and our
// Indian nutritionists.
export const VEG_TIPS: Tip[] = [
  { t: "Dogs run on protein and fat", d: "They need no carbs at all: the body makes the glucose it needs from protein. Plants can't stand in for meat." },
  { t: "Dal and soya are mostly starch", d: "Dal, soya, rajma and grains are mostly starch, which the body turns into sugar. It fills a dog up without giving them what their body is built to run on." },
  { t: "Plant protein is harder to use", d: "Dogs digest plant protein less well than meat. Dal and other legumes carry natural compounds (trypsin inhibitors, phytates) that slow protein digestion and lock up minerals like zinc and iron." },
  { t: "The heart needs taurine", d: "Taurine keeps the heart muscle strong. Dogs make it from two amino acids, methionine and cysteine, that dal and grains are low in, and plants carry almost none. Diets heavy in lentils and peas have been linked to a heart disease called DCM." },
  { t: "Where taurine comes from", d: "Meat, especially dark chicken meat, and fish and shellfish like prawns and mussels. A meat-based bowl brings it naturally." },
  { t: "Vets who know food disagree", d: "Dogs can digest some starch, so some say they can be vegan. The Forever Dog's authors, one a vet, disagree. Vegan dog foods also tested highest for weedkiller residue." },
  { t: "Packaged food beats dal or curd rice", d: "If fresh food isn't possible yet, a good packaged dog food is still better than dal rice or curd rice. It's made to be complete; a vegetarian home bowl isn't.", src: "Indian canine nutritionists" },
  { t: "A vegetarian home?", d: "Cook their eggs or meat separately, or buy fresh dog food. Their bowl doesn't have to follow the family's." },
];

// The packaged foods we recommend, shown as links in the vegetarian card.
// Meghna will send the list; nothing shows until it's filled in.
export const RECOMMENDED_KIBBLES: { name: string; url: string }[] = [
  { name: "Hearty Chicken & Duck", url: "https://headsupfortails.com/products/hearty-oven-baked-food-for-adult-dog" },
  { name: "Hearty Lamb & Blueberry", url: "https://headsupfortails.com/products/hearty-oven-baked-lamb-blueberry-dry-food" },
  { name: "Hearty Grain-Free Turkey, Fish & Chicken", url: "https://headsupfortails.com/products/hearty-turkey-fish-chicken-grain-free-oven-baked-adult-dog-food" },
  { name: "Hearty Puppy, Chicken & Fish", url: "https://headsupfortails.com/products/hearty-oven-baked-food-for-puppy" },
];

// Why dal, rice and curd isn't a dog's diet, piece by piece.
export const DAL_RICE_CURD: Tip[] = [
  { t: "Rice: energy, little else", d: "Rice is starch. It turns into sugar and gives quick energy, but dogs need no carbohydrates and get little else from it." },
  { t: "Dal: the wrong protein", d: "Dal's protein is low in methionine and cysteine, the amino acids dogs use to make taurine for the heart, and it comes with compounds that slow digestion." },
  { t: "Curd: a topping, not a meal", d: "A spoon of plain curd is a fine extra. As a base it's mostly milk: some protein and calcium, but not the iron, zinc, omega-3 and vitamins a dog needs." },
  { t: "What goes missing", d: "Bowls like this run short on taurine, omega-3 (EPA and DHA, from fish), iron, zinc, choline and vitamins D and E. A UC Davis study found 95% of 200 home-made dog recipes short on at least one essential nutrient." },
];

// Questions people ask about food, answered plainly.
export const FOOD_FAQ: { q: string; a: string }[] = [
  {
    q: "My dog is healthy and running around on curd rice. Why change?",
    a: "Missing nutrients don't show up early. A young body covers the gaps by drawing on its own reserves, so a dog can look perfectly fine for years. The cost tends to arrive with age: skin and coat trouble, weaker muscles and joints, a struggling heart, and slow recovery from illness, when the body has nothing left to draw on.",
  },
  {
    q: "We don't cook meat at home. What can we do?",
    a: "Eggs are a great start: their protein matches what a dog's body needs. You can also buy fresh dog food from Indian kitchens that deliver, or ask a canine nutritionist for a plan that works for your home.",
  },
  {
    q: "Isn't rice good for an upset tummy?",
    a: "Plain rice for a day or two of loose motions is fine. As an everyday base, it's mostly starch and leaves too little room for what they need.",
  },
  {
    q: "Is curd good for dogs?",
    a: "A spoon of plain curd is a fine extra. Skip flavoured or sweetened yoghurt, and don't make it the main part of the bowl.",
  },
  {
    q: "How fast should I change their food?",
    a: "Slowly. Swap a tenth of the old food for the new on day one, and add more each day only if their poop stays firm. See Kitchen rules, Switching food.",
  },
];


// Why garlic, and why it isn't onion. From The Forever Dog (chapters 5 and 8).
export const GARLIC_WHY: Tip[] = [
  { t: "It isn't onion", d: "Onions carry about 15 times more of the compound that harms a dog's red blood cells. Fresh garlic in small, measured amounts is a different thing." },
  { t: "Good for the liver", d: "Garlic's sulfur helps the body make glutathione, which the liver uses to clear out toxins." },
  { t: "Against mould toxins", d: "Garlic lowered tumours caused by mycotoxins, the mould toxins that can turn up in grain-heavy food." },
  { t: "Fresh only", d: "Chop it fresh. Skip garlic pills, powders and extracts: Europe's toxic-food list names garlic extract, not fresh garlic." },
];

// Food that calms itchy skin. From The Forever Dog (chapters 5 and 8) and
// our Indian nutritionists.
export const SKIN_FOOD: Tip[] = [
  { t: "Cut the starch", d: "A processed, carb-heavy diet is a known risk factor for itchy-skin allergies. Less rice, roti and kibble, more meat.", src: "The Forever Dog" },
  { t: "Sardines, two or three times a week", d: "Oily fish brings omega-3 fats that calm inflamed, itchy skin. One sardine per 9 kg is plenty.", src: "The Forever Dog" },
  { t: "Quercetin foods", d: "A few blueberries, a slice of apple or a floret of broccoli. These carry quercetin, a plant compound that calms inflammation.", src: "The Forever Dog" },
  { t: "Feed the gut", d: "Most of the immune system sits in the gut. A spoon of plain curd or kefir, or a little fermented veg, if they'll eat it.", src: "The Forever Dog" },
  { t: "Animal protein first", d: "Itchy dogs are often on bowls heavy in rice, roti, dal or soya. Make meat the base.", src: "@backintheday.in" },
];
