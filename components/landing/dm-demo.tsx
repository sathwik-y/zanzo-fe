"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChefHat,
  FileText,
  Link2,
  Search,
  Send,
  Sparkles,
} from "lucide-react";

/* A looping illustration of the actual flow: you DM a reel to the bot, the
   pipeline events tick in one by one, and structured data falls out. */

type Event = {
  icon: React.ElementType;
  color: string;
  title: string;
  detail: string;
};

const EVENTS: Event[] = [
  {
    icon: Send,
    color: "text-ink-dim",
    title: "Reel received via DM",
    detail: "@you → @your-zanzo-bot",
  },
  {
    icon: FileText,
    color: "text-slateblue-400",
    title: "Transcribed",
    detail: "0:42 · hindi → detected automatically",
  },
  {
    icon: ChefHat,
    color: "text-ochre-400",
    title: "Categorized · Recipe",
    detail: "confidence 0.96",
  },
  {
    icon: Sparkles,
    color: "text-copper-300",
    title: "Extracted",
    detail: "9 ingredients · 6 steps · 25 min",
  },
  {
    icon: Link2,
    color: "text-sage-400",
    title: "Resource harvested",
    detail: "commented “RECIPE” → link arrived by DM",
  },
  {
    icon: Search,
    color: "text-patina-400",
    title: "Searchable",
    detail: "“that paneer thing” now finds it",
  },
];

export function DmDemo() {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const t = setInterval(() => {
      setCount((c) => (c >= EVENTS.length ? 1 : c + 1));
    }, 1600);
    return () => clearInterval(t);
  }, []);

  const visible = EVENTS.slice(0, count).reverse();

  return (
    <div className="relative w-full max-w-sm">
      <div className="rounded-2xl border border-line bg-surface/80 p-4">
        <div className="flex items-center gap-2 border-b border-line pb-3">
          <span className="size-2 rounded-full bg-sage-400" />
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-faint">
            live pipeline
          </p>
          <p className="ml-auto font-mono text-[0.65rem] text-ink-faint">
            {count}/{EVENTS.length}
          </p>
        </div>

        <ul className="mt-3 flex min-h-[19rem] flex-col gap-2">
          <AnimatePresence initial={false}>
            {visible.map((e, i) => {
              const Icon = e.icon;
              return (
                <motion.li
                  key={e.title}
                  layout
                  initial={{ opacity: 0, y: -14, scale: 0.97 }}
                  animate={{ opacity: i === 0 ? 1 : 0.55, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  className="flex items-center gap-3 rounded-xl border border-line bg-raised/70 px-3.5 py-2.5"
                >
                  <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg border border-line bg-paper/60 ${e.color}`}>
                    <Icon className="size-3.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ink">{e.title}</span>
                    <span className="block truncate font-mono text-[0.7rem] text-ink-faint">
                      {e.detail}
                    </span>
                  </span>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>
      </div>

      {/* soft copper glow behind the card */}
      <div
        aria-hidden
        className="absolute -inset-8 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 60%, rgba(192,118,58,0.12) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
