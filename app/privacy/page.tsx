import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Privacy · Pet Buddha",
  description: "What Pet Buddha keeps about you and your dog, and how to remove it.",
};

// Plain words on what we keep. Keep this in step with lib/account.ts and
// supabase/schema.sql if what we save ever changes.
export default function Privacy() {
  return (
    <main className="privacy">
      <Link href="/" aria-label="Pet Buddha home">
        <Logo />
      </Link>

      <h1>Privacy</h1>
      <p className="privacy-lead">Pet Buddha keeps as little as it can: the answers about your dog, and, only if you save your plan, your email.</p>

      <h2>Without an account</h2>
      <p>Your answers (your dog&apos;s name, breed, age, weight, sex, food and what you&apos;d like help with) stay in this browser on your device. Nothing is sent to us.</p>

      <h2>When you save your plan</h2>
      <p>You sign in with Google or with a link sent to your email. We then keep:</p>
      <ul>
        <li>Your email address, so you can sign in again.</li>
        <li>Your dog&apos;s answers, so the plan is there on any phone or laptop.</li>
      </ul>
      <p>If you sign in with Google, Google shares only your name, email and profile picture with us. We don&apos;t see your password, contacts or anything else in your Google account.</p>

      <h2>Where it&apos;s kept</h2>
      <p>On Supabase, in their Mumbai region. Only you can read or change your saved dogs; the database checks that on every request.</p>

      <h2>What we never do</h2>
      <ul>
        <li>No ads, and no selling or sharing your details with anyone.</li>
        <li>No marketing emails. The only email you get is the sign-in link you ask for.</li>
      </ul>
      <p>Links to shops on our pages go straight to the shop. We earn no commission, and what you do there is covered by their own privacy policy.</p>

      <h2>Removing your details</h2>
      <p>
        Email <a href="mailto:gangulymeghna@gmail.com">gangulymeghna@gmail.com</a> from the address you signed in with, and we&apos;ll delete your account and your dog&apos;s profile.
      </p>

      <p className="privacy-small">Last updated 26 October 2026.</p>
    </main>
  );
}
