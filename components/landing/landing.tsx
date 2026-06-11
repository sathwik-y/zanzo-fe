"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  CalendarDays,
  Eye,
  Languages,
  Link2,
  ScanSearch,
  Server,
  Users,
} from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { DmDemo } from "@/components/landing/dm-demo";
import { LandingNavbar } from "@/components/landing/navbar";

const BACKEND_REPO = "https://github.com/sathwik-y/zanzo";
const FRONTEND_REPO = "https://github.com/sathwik-y/zanzo-fe";

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
};

export function Landing() {
  return (
    <div className="relative overflow-x-clip">
      <LandingNavbar />

      {/* ————— Hero ————— */}
      <section className="grain relative">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 45% at 75% 10%, rgba(192,118,58,0.10) 0%, transparent 65%), radial-gradient(45% 40% at 10% 90%, rgba(192,118,58,0.06) 0%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto grid min-h-svh max-w-6xl items-center gap-14 px-6 pb-16 pt-28 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-copper-400"
            >
              Self-hosted Instagram archive
            </motion.p>

            <h1 className="mt-5 font-display text-5xl leading-[1.05] text-ink sm:text-6xl">
              {["Saved", "it.", "Never"].map((w, i) => (
                <motion.span
                  key={w + i}
                  className="inline-block"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  {w}&nbsp;
                </motion.span>
              ))}
              <motion.em
                className="inline-block text-copper-300"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                lost it.
              </motion.em>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.4 }}
              className="mt-6 max-w-lg text-base leading-relaxed text-ink-dim"
            >
              Zanzo watches the reels you save or DM and turns each one into structured,
              searchable data — the recipe with its quantities, the event with its date, the
              place with its name. Not bookmarks. An archive that answers questions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/login"
                className="rounded-full bg-transparent px-10 py-3.5 text-sm font-bold uppercase tracking-widest text-ink shadow-[inset_0_0_0_2px_var(--color-line-strong)] transition duration-200 hover:bg-ink hover:text-paper hover:shadow-[inset_0_0_0_2px_var(--color-ink)]"
              >
                Get started
              </Link>
              <a
                href={BACKEND_REPO}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 text-sm text-ink-dim transition-colors hover:text-ink"
              >
                <GitHubIcon className="size-4" />
                Star on GitHub
                <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="mt-10 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ink-faint"
            >
              FastAPI · Postgres + pgvector · Gemini · Whisper / Deepgram · Next.js
            </motion.p>
          </div>

          {/* live pipeline, ticking while you read */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="hidden justify-center lg:flex lg:justify-end"
          >
            <DmDemo />
          </motion.div>
        </div>
      </section>

      {/* ————— How it works ————— */}
      <section id="how" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <motion.p {...fadeUp} className="rule-label">
            how it works
          </motion.p>
          <motion.h2 {...fadeUp} className="mt-8 max-w-2xl font-display text-3xl text-ink sm:text-4xl">
            DM a reel to your bot account.
            <br />
            <em className="text-copper-300">That&apos;s the whole workflow.</em>
          </motion.h2>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              {
                n: "01",
                title: "Save or DM",
                body: "A poller watches a dedicated bot account's saved collection and DMs. Forward any reel from your own account — no URL pasting, no browser extension, no app switching.",
              },
              {
                n: "02",
                title: "The pipeline reads it",
                body: "Each reel is transcribed (multilingual — English, Hindi, Telugu and more), classified into a category, and run through a schema-specific extractor. Silent reels get read visually, frame by frame.",
              },
              {
                n: "03",
                title: "Search it. Act on it.",
                body: "Hybrid semantic search means “that tokyo ramen place” finds the reel even if nobody ever said ramen. Events export to your calendar as .ics in one click.",
              },
            ].map((s) => (
              <motion.div key={s.n} {...fadeUp} className="border-t border-line pt-6">
                <span className="font-mono text-sm text-copper-400">{s.n}</span>
                <h3 className="mt-3 font-display text-xl text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-dim">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— Pipeline rail ————— */}
      <section id="pipeline" className="border-t border-line bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <motion.p {...fadeUp} className="rule-label">
            the pipeline
          </motion.p>
          <motion.div
            {...fadeUp}
            className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-5"
          >
            {[
              { step: "fetch", desc: "media pulled & stored in S3/MinIO" },
              { step: "transcribe", desc: "Deepgram nova-2, Whisper fallback" },
              { step: "classify", desc: "six categories, multimodal" },
              { step: "extract", desc: "per-category JSON schemas" },
              { step: "embed", desc: "pgvector, 1536 dims" },
            ].map((p, i) => (
              <div key={p.step} className="group bg-paper p-6 transition-colors hover:bg-raised">
                <p className="font-mono text-[0.65rem] text-ink-faint">{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-3 font-mono text-sm uppercase tracking-[0.14em] text-copper-300">
                  {p.step}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-ink-dim">{p.desc}</p>
              </div>
            ))}
          </motion.div>
          <motion.p {...fadeUp} className="mt-6 text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint">
            idempotent stages · resumable · non-destructive on quota errors
          </motion.p>
        </div>
      </section>

      {/* ————— What comes out ————— */}
      <section id="features" className="border-t border-line">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <motion.p {...fadeUp} className="rule-label">
            what comes out
          </motion.p>
          <motion.h2 {...fadeUp} className="mt-8 max-w-2xl font-display text-3xl text-ink sm:text-4xl">
            Not tags. <em className="text-copper-300">Fields.</em>
          </motion.h2>
          <motion.p {...fadeUp} className="mt-4 max-w-xl text-sm leading-relaxed text-ink-dim">
            Every category has its own extraction schema. An event reel yields a start time, a
            venue and a ticket link — so “add to calendar” is one click, not a re-watch.
          </motion.p>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: CalendarDays,
                title: "Category-aware extraction",
                body: "Events get starts_at, venue, ticket_url. Recipes get ingredients with quantities and ordered steps. Tech reels get the actual commands shown on screen.",
              },
              {
                icon: ScanSearch,
                title: "Hybrid semantic search",
                body: "Vector similarity over pgvector fused with text matching. Search what you remember, not what was said.",
              },
              {
                icon: Languages,
                title: "Multilingual transcription",
                body: "Deepgram nova-2 with per-reel language detection — English, Hindi, Telugu and more. Falls back to local Whisper at zero cost.",
              },
              {
                icon: Eye,
                title: "Visual extraction",
                body: "Reels with no useful audio — or that point at on-screen content — are read visually by Gemini, frames and captions together.",
              },
              {
                icon: Link2,
                title: "Resource harvesting",
                body: "“Comment GUIDE for the link”? The bot comments, watches its DMs, and files the link into the item. Capped, delayed, opt-in.",
              },
              {
                icon: Users,
                title: "Multi-user & admin",
                body: "JWT auth, per-user libraries, Instagram identity verified by DM code and bound to the stable account ID — handle renames can't break it.",
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  {...fadeUp}
                  className="group rounded-2xl border border-line bg-surface/60 p-6 transition-colors hover:border-line-strong hover:bg-raised/60"
                >
                  <span className="flex size-9 items-center justify-center rounded-lg border border-line bg-paper/70 text-copper-300">
                    <Icon className="size-4" />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-ink">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-dim">{f.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ————— Open source ————— */}
      <section id="open-source" className="border-t border-line bg-surface/40">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <motion.p {...fadeUp} className="rule-label">
            open source
          </motion.p>
          <motion.h2 {...fadeUp} className="mt-8 max-w-2xl font-display text-3xl text-ink sm:text-4xl">
            Your saves live on <em className="text-copper-300">your hardware.</em>
          </motion.h2>
          <motion.p {...fadeUp} className="mt-4 max-w-xl text-sm leading-relaxed text-ink-dim">
            The whole stack is on GitHub, end to end. Run it on a laptop with Docker, or on AWS
            for the price of a coffee or two a month. No subscription. No third-party cloud
            holding your data.
          </motion.p>

          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {[
              {
                href: BACKEND_REPO,
                name: "sathwik-y/zanzo",
                desc: "Backend — FastAPI, the ingestion poller, the AI pipeline, auth, and the engagement reconciler.",
                tags: "Python · FastAPI · SQLAlchemy · Redis",
              },
              {
                href: FRONTEND_REPO,
                name: "sathwik-y/zanzo-fe",
                desc: "Dashboard — this interface. Feed, category views, search, settings and the admin panel.",
                tags: "Next.js 16 · React 19 · Tailwind v4",
              },
            ].map((r) => (
              <motion.a
                key={r.name}
                {...fadeUp}
                href={r.href}
                target="_blank"
                rel="noreferrer"
                className="group rounded-2xl border border-line bg-paper p-6 transition-colors hover:border-copper-600/50"
              >
                <div className="flex items-center gap-2.5">
                  <GitHubIcon className="size-4 text-ink-dim" />
                  <span className="font-mono text-sm text-ink">{r.name}</span>
                  <ArrowUpRight className="ml-auto size-4 text-ink-faint transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-copper-300" />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-dim">{r.desc}</p>
                <p className="mt-4 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
                  {r.tags}
                </p>
              </motion.a>
            ))}
          </div>

          <motion.div
            {...fadeUp}
            className="mt-12 flex items-start gap-4 rounded-2xl border border-ochre-500/25 bg-ochre-500/[0.06] p-5"
          >
            <Server className="mt-0.5 size-4 shrink-0 text-ochre-400" />
            <p className="text-sm leading-relaxed text-ink-dim">
              <span className="font-semibold text-ochre-300">Run it honest.</span> Automating an
              Instagram account is against Instagram&apos;s terms and can get that account banned.
              Zanzo is built for a dedicated bot account — never your main — with conservative
              pacing, daily caps, and a kill switch in the dashboard. You bring your own account,
              your own keys, and your own risk.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ————— Footer ————— */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Logo size={20} />
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-ink-faint">
              The afterimage of everything you scroll. Built as a personal tool, shared as open
              source.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-dim">
            <a href={BACKEND_REPO} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
              Backend
            </a>
            <a href={FRONTEND_REPO} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
              Dashboard
            </a>
            <a href={`${BACKEND_REPO}#setup`} target="_blank" rel="noreferrer" className="transition-colors hover:text-ink">
              Self-host guide
            </a>
            <a
              href="https://github.com/sathwik-y"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-ink"
            >
              @sathwik-y
            </a>
          </div>
        </div>
        <div className="border-t border-line py-5 text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint">
          no subscription · no telemetry · your data
        </div>
      </footer>
    </div>
  );
}
