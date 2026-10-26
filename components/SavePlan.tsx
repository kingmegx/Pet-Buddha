"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { accounts, signInWithEmail, signInWithGoogle, signOut } from "@/lib/account";

// "Save plan" in the bar of the plan. Signed out, it opens a small sheet:
// Google, or a sign-in link by email; no passwords. Signed in, it shows
// where the plan is saved, with a way to sign out.
export function SavePlan({ email, who }: { email: string | null; who: string }) {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const ready = useReady();
  if (!ready || !accounts) return null;

  if (email) {
    return (
      <span className="acct-saved">
        <button className="acct-chip" onClick={() => setMenu((m) => !m)} aria-expanded={menu}>
          <Tick /> Saved
        </button>
        {menu && (
          <span className="acct-menu" role="menu">
            <span>Saved to {email}</span>
            <button className="linklike" role="menuitem" onClick={() => signOut().then(() => setMenu(false))}>
              Sign out
            </button>
          </span>
        )}
      </span>
    );
  }

  return (
    <>
      <button className="acct-chip is-save" onClick={() => setOpen(true)}>
        Save plan
      </button>
      <SaveSheet open={open} onClose={() => setOpen(false)} who={who} />
    </>
  );
}

// The same sheet, opened from a card further down the plan.
export function SaveCard({ email, who }: { email: string | null; who: string }) {
  const [open, setOpen] = useState(false);
  const ready = useReady();
  if (!ready || !accounts || email) return null;
  const whose = who === "your dog" ? "your dog's" : `${who}'s`;
  return (
    <div className="s-help-card">
      <h3>Keep {whose} plan</h3>
      <p>Save it and it&apos;s here next time, on your phone or laptop. Change the profile any time and it stays up to date.</p>
      <button className="pill" onClick={() => setOpen(true)}>
        Save plan
      </button>
      <SaveSheet open={open} onClose={() => setOpen(false)} who={who} />
    </div>
  );
}

// Accounts only exist in the browser, so wait until the page is running
// there before showing anything, or the server and browser disagree.
function useReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready;
}

function SaveSheet({ open, onClose, who }: { open: boolean; onClose: () => void; who: string }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const whose = who === "your dog" ? "your dog's" : `${who}'s`;
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const send = async () => {
    if (!valid || busy) return;
    setBusy(true);
    setError(null);
    const err = await signInWithEmail(email.trim());
    setBusy(false);
    if (err) setError("That didn't send. Check the email and try again in a minute.");
    else setSent(true);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="acct" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className="acct-sheet"
            role="dialog"
            aria-label={`Save ${whose} plan`}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="pcard-circle acct-close" onClick={onClose} aria-label="Close">
              <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden>
                <path d="M5 5l10 10M15 5 5 15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>

            {sent ? (
              <>
                <h2>Check your inbox</h2>
                <p className="acct-lead">
                  We&apos;ve sent a sign-in link to <strong>{email.trim()}</strong>. Open it on this device and you&apos;ll land back on {whose} plan, saved.
                </p>
                <p className="acct-small">Nothing there? Look in spam or promotions, or <button className="linklike" onClick={() => setSent(false)}>use another email</button>.</p>
              </>
            ) : (
              <>
                <h2>Save {whose} plan</h2>
                <p className="acct-lead">Come back to it on any phone or laptop. No password to remember.</p>

                <button className="acct-google" onClick={() => signInWithGoogle()}>
                  <GoogleMark /> Continue with Google
                </button>

                <p className="acct-or">
                  <span>or get a link by email</span>
                </p>

                <form
                  className="acct-email"
                  onSubmit={(e) => {
                    e.preventDefault();
                    send();
                  }}
                >
                  <input type="email" inputMode="email" autoComplete="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Your email" />
                  <button className="pill" type="submit" disabled={!valid || busy}>
                    {busy ? "Sending…" : "Email me a link"}
                  </button>
                </form>
                {error && <p className="acct-error">{error}</p>}

                <p className="acct-small">We only keep the answers about your dog. No ads, no spam.</p>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Tick() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Google's "G", in its own colours, as their sign-in guidelines ask.
function GoogleMark() {
  return (
    <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}
