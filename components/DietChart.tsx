"use client";

import { dietChart } from "@/lib/balance";
import { COOKING, FRESH_MEAT_SHOP, FRESH_READY, garlicCloves } from "@/lib/plan";
import type { Preset } from "./BalanceBowl";

// A day's bowl for a healthy adult dog, by the gram, in the shape of The
// Forever Dog's complete homemade recipes, made with Indian food. It teaches
// what a bowl should look like; Balance the bowl then shows the gaps it
// still has (zinc, vitamin D and so on) and what closes them.

const VEG = ["Broccoli", "Pumpkin", "Green beans", "Celery", "Red bell pepper", "Carrot", "Zucchini", "Spinach (a little)", "Sweet potato (a little)", "Beetroot (a little)"];
const SEEDS = ["Flax", "Chia", "Pumpkin", "Sunflower", "Basil (sabja)"];
const HERBS = ["Coriander", "Tulsi", "Parsley", "Mint"];
const EXTRAS = ["Kefir", "Fermented vegetables", "Moringa", "Bee pollen", "Milk thistle", "Apple cider vinegar"];
const SNACKS = ["1 egg, or 2 quail eggs", "A chicken neck or feet", "A little bone broth", "A few cubes of paneer", "Curd with a little fruit"];

// ¼, ½, 1½ and so on.
function tsp(n: number) {
  const whole = Math.floor(n);
  const part = ["", "¼", "½", "¾"][Math.round((n - whole) * 4)];
  return `${whole || ""}${part || (whole ? "" : "¼")} tsp`;
}

export function DietChart({ kg, months, need, who, onLoad, onExperts }: { kg: number; months: number; need: number; who: string; onLoad: (p: Omit<Preset, "key">) => void; onExperts: () => void }) {
  // Puppies under 8 months eat three meals; after that, two meals with a snack in between.
  const meals = months < 8 ? 3 : 2;
  const c = dietChart(kg, need);
  const per = (g: number) => Math.round(g / meals / 5) * 5;
  const garlic = garlicCloves(kg);
  const puppy = months < 12;

  const disclaimer = (
    <div className="dc-note">
      <strong>{puppy ? "For grown dogs only." : "For healthy adult dogs."}</strong>{" "}
      {puppy
        ? `Puppies need a recipe made for growth, with more calcium and minerals than this. Ask one of the nutritionists below for one made for ${who}.`
        : `This is a general guide to what a bowl should look like, not a prescription. If ${who} has a medical condition, is pregnant, nursing or on medication, ask one of the nutritionists below for a diet made for them.`}{" "}
      <button className="dc-link" onClick={onExperts}>
        <span className="link-words">See the nutritionists</span> <span aria-hidden>↓</span>
      </button>
    </div>
  );
  if (puppy) return <div className="dc">{disclaimer}</div>;

  const rows: { part: string; grams?: number; amount?: string; what: string; pick?: string[]; note?: string }[] = [
    { part: "Meat", grams: c.meat, what: "Chicken thigh, mutton, buff or fish. Rotate between them.", note: "Chicken breast is leaner: add a teaspoon of ghee or coconut oil with it." },
    { part: "Liver", grams: c.liver, what: "Chicken or mutton liver (kaleji)." },
    { part: "Other organs", grams: c.organs, what: "Gizzard, heart or kidney. Two or three kinds is best." },
    { part: "Vegetables", grams: c.veg, what: "Any three at once, chopped fine or lightly cooked.", pick: VEG },
    { part: "Seeds", amount: tsp(c.seedTsp), what: "Ground together and kept in a jar.", pick: SEEDS },
    { part: "Calcium", amount: tsp(c.shellTsp), what: "Eggshell powder, or a bone meal. Skip it if they eat raw meaty bones." },
  ];

  return (
    <div className="dc">
      {disclaimer}

      <div className="dc-head">
        <div className="dc-total">
          <strong>{c.total} g</strong>
          <span>
            of fresh food a day for {who} at {kg} kg, about {need} calories. All cooked weights: weigh after cooking.
          </span>
        </div>
        <span className="dc-meals-note">{meals === 3 ? "Split into 3 meals a day" : "Split into 2 meals a day, with a snack in between"}</span>
      </div>

      <ol className="dc-rows">
        {rows.map((r) => (
          <li key={r.part}>
            <span className="dc-part">{r.part}</span>
            <span className="dc-amount">
              {r.grams ? (
                <>
                  <strong>{per(r.grams)} g</strong> <small>a meal · {r.grams} g a day</small>
                </>
              ) : (
                <>
                  <strong>{r.amount}</strong> <small>a day</small>
                </>
              )}
            </span>
            <span className="dc-what">
              {r.what}
              {r.note && <em>{r.note}</em>}
              {r.pick && (
                <span className="dc-pick">
                  {r.pick.map((x) => (
                    <i key={x}>{x}</i>
                  ))}
                </span>
              )}
            </span>
          </li>
        ))}
      </ol>

      <div className="dc-extra">
        <div>
          <span className="dc-part">A few times a week</span>
          <p>
            Oily fish for omega-3 and vitamin D: {c.sardines} sardine{c.sardines > 1 ? "s" : ""} or a piece of bangda, two or three times a week. An egg on other days.
          </p>
        </div>
        <div>
          <span className="dc-part">A pinch of</span>
          <p>
            {HERBS.join(", ")}, and turmeric paste (turmeric, a crushed peppercorn and coconut oil). One crushed clove a day.
            {garlic ? ` Up to ${garlic} of fresh garlic a day.` : ""}
          </p>
        </div>
        <div>
          <span className="dc-part">Kitchen extras</span>
          <p>{EXTRAS.join(" · ")}. Add one at a time, a little at first.</p>
        </div>
        <div>
          <span className="dc-part">Snacks</span>
          <p>{SNACKS.join(" · ")}. Count them in the day&apos;s food.</p>
        </div>
      </div>

      {/* How to cook it, and where to get fresh meat cut for dogs. */}
      <div className="dc-cook">
        <span className="dc-part">How to cook it</span>
        <ol className="tc tc-compact">
          {COOKING.map((c, i) => (
            <li key={c.t}>
              <span className="tc-num">{String(i + 1).padStart(2, "0")}</span>
              <strong>{c.t}</strong>
              <p>{c.d}</p>
            </li>
          ))}
        </ol>
      </div>
      <FreshMeatCard />

      <div className="dc-gaps">
        <p>
          <strong>Even a good home bowl misses a few things</strong>, like zinc, vitamin D and E, and iodine. The book&apos;s recipes add them as supplements. Load this bowl into the checker above to see what&apos;s missing and what fixes it.
        </p>
        <button
          className="pill"
          onClick={() =>
            onLoad({
              lines: [
                ["thigh", c.meat],
                ["liver", c.liver],
                ["organs", c.organs],
                ["veg", c.veg],
                ["seeds", c.seedG],
                ["eggshell", c.shellG],
              ],
            })
          }
        >
          Load it into the bowl above <span className="arrow" aria-hidden />
        </button>
      </div>
      <p className="dc-src">Built on the complete homemade recipes in The Forever Dog by Rodney Habib and Dr. Karen Becker, with Indian foods.</p>
    </div>
  );
}

// Fresh meat, delivered: for anyone moving to a fresh, meat-based bowl.
export function FreshMeatCard() {
  return (
    <div className="dc-shop">
      <p>
        <strong>No butcher you trust?</strong> {FRESH_MEAT_SHOP.name} delivers farm-fresh meat and organs cut for dogs (chicken, mutton, buffalo, duck and more), and ready-cooked fresh meals. Check they deliver to your city.
      </p>
      <p className="s-links">
        <a href={FRESH_MEAT_SHOP.meat} target="_blank" rel="noreferrer">
          Fresh meat and organs <span aria-hidden>→</span>
        </a>
        <a href={FRESH_MEAT_SHOP.meals} target="_blank" rel="noreferrer">
          Ready fresh meals <span aria-hidden>→</span>
        </a>
      </p>
    </div>
  );
}

// Fresh food, ready-cooked: for kibble feeders who won't cook, and for
// vegetarian homes, who see the paneer and vegetable recipes first.
export function ReadyFreshCard({ veg = false }: { veg?: boolean }) {
  const r = FRESH_READY;
  return (
    <div className="dc-shop">
      {veg ? (
        <p>
          <strong>Short on time?</strong> {r.name} from Heads Up For Tails is fresh dog food, cooked and ready to serve. It has vegetarian recipes too, Paneer &amp; Veggies and Vegetable Biryani, from {r.from}.
        </p>
      ) : (
        <p>
          <strong>Want fresh without cooking?</strong> {r.name} from Heads Up For Tails is fresh dog food, cooked and ready to serve, from {r.from}. Start with the trial pack and mix a little into their usual food.
        </p>
      )}
      <p className="s-links">
        {veg ? (
          <>
            <a href={r.paneer} target="_blank" rel="noreferrer">
              Paneer &amp; Veggies <span aria-hidden>→</span>
            </a>
            <a href={r.vegBiryani} target="_blank" rel="noreferrer">
              Vegetable Biryani <span aria-hidden>→</span>
            </a>
          </>
        ) : (
          <>
            <a href={r.trial} target="_blank" rel="noreferrer">
              Trial pack of 3 <span aria-hidden>→</span>
            </a>
            <a href={r.chicken} target="_blank" rel="noreferrer">
              Chicken &amp; Brown Rice <span aria-hidden>→</span>
            </a>
          </>
        )}
        <a href={r.all} target="_blank" rel="noreferrer">
          All recipes <span aria-hidden>→</span>
        </a>
      </p>
    </div>
  );
}
