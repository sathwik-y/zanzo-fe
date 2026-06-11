"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Gift,
  Link as LinkIcon,
  Loader2,
  MousePointerClick,
  Search,
} from "lucide-react";
import { api, ENGAGEMENT_STATUS_LABEL, Resource, ResourceList, ResourceRow } from "@/lib/api";

const PAGE_SIZE = 15;

const TABS = [
  { key: "", label: "All" },
  { key: "harvested", label: "Harvested" },
  { key: "tap", label: "Needs a tap" },
  { key: "progress", label: "In progress" },
  { key: "dead", label: "No reply" },
] as const;

const STATUS_TONE: Record<string, string> = {
  RESOURCE_RECEIVED: "bg-sage-500/15 text-sage-300",
  INTERACTION_REQUIRED: "bg-ochre-500/15 text-ochre-300",
  EXHAUSTED: "bg-zinc-800 text-zinc-500",
  FAILED: "bg-clay-500/15 text-clay-300",
};

function domain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.slice(0, 32);
  }
}

export default function ResourcesPage() {
  const [data, setData] = useState<ResourceList | null>(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<string>("");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async (q: string, status: string, pageNo: number) => {
    try {
      const params = new URLSearchParams({
        limit: String(PAGE_SIZE),
        offset: String(pageNo * PAGE_SIZE),
      });
      if (q.trim()) params.set("search", q.trim());
      if (status) params.set("status", status);
      setData(await api<ResourceList>(`resources?${params}`));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  // initial + background refresh of the current view
  useEffect(() => {
    load(search, tab, page);
    const t = setInterval(() => load(search, tab, page), 20000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, page]);

  function onSearch(value: string) {
    setSearch(value);
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(() => {
      setPage(0);
      load(value, tab, 0);
    }, 300);
  }

  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 font-display text-3xl tracking-tight">
          <Gift className="size-6 text-copper-400" /> Resources
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Links harvested from &quot;comment the keyword&quot; reels — found by following
          creators and watching their reply.
        </p>
      </div>

      {/* search + filter tabs */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <label className="relative grow sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search creator, keyword, link…"
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900/70 py-2 pl-9 pr-3 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-copper-500/60"
          />
        </label>
        <div className="flex items-center gap-1 rounded-full border border-line bg-surface p-1 text-xs">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setPage(0);
              }}
              className={`rounded-full px-3 py-1.5 transition-colors ${
                tab === t.key ? "bg-raised text-ink" : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-clay-500/30 bg-clay-500/10 p-4 text-sm text-clay-300">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-10 text-zinc-500">
          <Loader2 className="size-6 animate-spin" />
        </div>
      )}

      {!loading && !error && total === 0 && (
        <div className="flex flex-col items-center gap-2 py-16 text-zinc-500">
          <Gift className="size-8" />
          <p className="max-w-md text-center text-sm">
            {search || tab
              ? "Nothing matches this filter."
              : "No auto-engagements yet. When you save a reel that says “comment X for the link”, Zanzo engages and the resource shows up here."}
          </p>
        </div>
      )}

      <div className="space-y-2.5">
        {(data?.rows ?? []).map((r) => <Row key={r.item_id} row={r} />)}
      </div>

      {/* pagination */}
      {total > PAGE_SIZE && (
        <div className="mt-6 flex items-center justify-between text-sm text-zinc-500">
          <span>
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} of {total}
          </span>
          <span className="flex items-center gap-2">
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
              className="flex items-center gap-1 rounded-lg border border-zinc-800 px-3 py-1.5 hover:bg-zinc-900 disabled:opacity-40"
            >
              <ChevronLeft className="size-4" /> Prev
            </button>
            <button
              disabled={page >= pages - 1}
              onClick={() => setPage((p) => p + 1)}
              className="flex items-center gap-1 rounded-lg border border-zinc-800 px-3 py-1.5 hover:bg-zinc-900 disabled:opacity-40"
            >
              Next <ChevronRight className="size-4" />
            </button>
          </span>
        </div>
      )}
    </div>
  );
}

function Row({ row }: { row: ResourceRow }) {
  const tone = STATUS_TONE[row.status] ?? "bg-zinc-800/80 text-zinc-400";
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-4 py-3 transition-colors hover:border-zinc-700">
      <div className="flex items-baseline justify-between gap-3">
        <Link
          href={`/items/${row.item_id}`}
          className="min-w-0 truncate text-sm font-medium text-zinc-100 hover:underline"
        >
          {row.headline}
        </Link>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${tone}`}>
          {ENGAGEMENT_STATUS_LABEL[row.status] ?? row.status.toLowerCase()}
        </span>
      </div>
      <p className="mt-0.5 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-zinc-600">
        @{row.creator_username} · {row.keyword}
      </p>
      {row.resources.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {row.resources.map((res, i) => (
            <ResourcePill key={i} res={res} />
          ))}
        </div>
      )}
    </div>
  );
}

function ResourcePill({ res }: { res: Resource }) {
  const tap = res.source === "interaction_required";
  return (
    <a
      href={res.url}
      target="_blank"
      rel="noreferrer"
      title={res.text || res.url}
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${
        tap
          ? "border-ochre-500/30 bg-ochre-500/10 text-ochre-300 hover:bg-ochre-500/20"
          : "border-copper-500/30 bg-copper-500/10 text-copper-300 hover:bg-copper-500/20"
      }`}
    >
      {tap ? (
        <MousePointerClick className="size-3 shrink-0" />
      ) : (
        <LinkIcon className="size-3 shrink-0" />
      )}
      <span className="truncate">{tap ? "claim in Instagram" : domain(res.url)}</span>
    </a>
  );
}
