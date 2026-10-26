// Saving a dog's profile to an account, so the plan is there on any phone
// or laptop. Sign-in is Google or a link by email, through Supabase.
// Until the Supabase keys are set (in Vercel and .env.local) `accounts` is
// null and the site works exactly as before, with nothing to sign in to.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Bowl, ProblemId, Sex } from "./content";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const accounts: SupabaseClient | null =
  url && key && typeof window !== "undefined"
    ? createClient(url, key, { auth: { flowType: "pkce", detectSessionInUrl: true, persistSession: true } })
    : null;

// What we keep about a dog: the answers to the questions, nothing else.
export type SavedDog = {
  name: string | null;
  breed: string;
  ageMonths: number;
  dateOfBirth: string | null;
  weightKg: number;
  weightSure: boolean;
  sex: Sex | null;
  needs: ProblemId[];
  bowl: Bowl | null;
  // Everything they ticked; older saves only have `bowl`.
  foods?: Bowl[];
};

// Set just before leaving for Google or the email link, so that coming back
// signed in saves the plan they were looking at.
const SAVE_ON_RETURN = "petbuddha.saveOnReturn";

export function markSaveOnReturn() {
  try {
    localStorage.setItem(SAVE_ON_RETURN, "1");
  } catch {}
}

export function takeSaveOnReturn() {
  try {
    const yes = localStorage.getItem(SAVE_ON_RETURN) === "1";
    localStorage.removeItem(SAVE_ON_RETURN);
    return yes;
  } catch {
    return false;
  }
}

export function localDog(): SavedDog | null {
  try {
    const raw = localStorage.getItem("petbuddha.profile");
    return raw ? (JSON.parse(raw) as SavedDog) : null;
  } catch {
    return null;
  }
}

// Back to the same page after signing in.
const home = () => window.location.origin + window.location.pathname;

export async function signInWithGoogle() {
  if (!accounts) return;
  markSaveOnReturn();
  await accounts.auth.signInWithOAuth({ provider: "google", options: { redirectTo: home() } });
}

export async function signInWithEmail(email: string) {
  if (!accounts) return "Saving isn't switched on yet.";
  markSaveOnReturn();
  const { error } = await accounts.auth.signInWithOtp({ email, options: { emailRedirectTo: home() } });
  return error ? error.message : null;
}

export async function signOut() {
  await accounts?.auth.signOut();
}

// One dog per account for now; the table allows more later.
export async function loadDog(): Promise<SavedDog | null> {
  if (!accounts) return null;
  const { data } = await accounts.from("dogs").select("profile").order("updated_at", { ascending: false }).limit(1).maybeSingle();
  return (data?.profile as SavedDog) ?? null;
}

export async function saveDog(profile: SavedDog) {
  if (!accounts) return;
  const { data: auth } = await accounts.auth.getUser();
  if (!auth.user) return;
  const { data } = await accounts.from("dogs").select("id").order("updated_at", { ascending: false }).limit(1).maybeSingle();
  const row = { profile, updated_at: new Date().toISOString() };
  if (data?.id) await accounts.from("dogs").update(row).eq("id", data.id);
  else await accounts.from("dogs").insert({ ...row, owner: auth.user.id });
}
