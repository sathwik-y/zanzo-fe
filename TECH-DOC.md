# Zanzo — Frontend Technical Documentation

> The web dashboard for [Zanzo](https://github.com/sathwik-y/zanzo) — *Zanzō (残像)*, "afterimage". This document covers the **frontend** end to end. The backend (API, pipeline, data model, full REST reference) is documented in the main repo's `docs/TECH-DOC.md`.

---

## 1. Overview

A Next.js 16 (App Router) dashboard for browsing, searching, and acting on the items Zanzo ingests. It is a **thin client**: it holds no business logic and no database. It talks only to the Zanzo backend, and it does so through a **server-side proxy** so the backend API key never reaches the browser.

Pages: a feed of all saves, a per-item detail view (media player, click-to-seek transcript, structured extraction, resources, actions), category views, a Resources view (auto-fetched links), Settings (poller health, AI spend, engagement caps), and a Failed view.

---

## 2. Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16, App Router, React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (dark-mode by default) |
| Icons | lucide-react |
| Fonts | Geist / Geist Mono (next/font) |
| Build | Turbopack (Next 16 default); standalone output for Docker |

> Next.js 16 specifics in use: async `params` (route params are a `Promise`, unwrapped with React's `use()` in client components / `await` in server components), Turbopack by default, React 19.

---

## 3. Repository layout

```
app/
  layout.tsx                  # root layout: sidebar + main, dark theme, metadata
  globals.css                 # Tailwind import + dark palette + scrollbar styling
  page.tsx                    # "/" Feed
  resources/page.tsx          # "/resources" Resources view
  category/[slug]/page.tsx    # "/category/events|recipes|travel|educational|tech|other"
  failed/page.tsx             # "/failed" failed items
  settings/page.tsx           # "/settings" poller, spend, engagement caps
  items/[id]/page.tsx         # "/items/{id}" detail view
  api/backend/[...path]/route.ts  # server-side proxy to the backend (injects API key)
components/
  sidebar.tsx                 # left nav (client; highlights active route)
  feed.tsx                    # reusable feed: search + filters + cards + load-more
  item-card.tsx               # one feed card (thumbnail, badges, headline, subtitle)
  badges.tsx                  # CategoryBadge, StatusChip, SourceChip
  extraction-view.tsx         # per-category rendering of extraction payloads
  engagement-settings.tsx     # engagement caps editor + recent engagements (Settings)
lib/
  api.ts                      # api() fetch helper + all shared types + category/status maps
Dockerfile                    # standalone production image
.env.example                  # BACKEND_URL, BACKEND_API_KEY
```

---

## 4. Configuration

Server-side only (never exposed to the browser). Set in `.env.local`:

| Env var | Default | Purpose |
|---|---|---|
| `BACKEND_URL` | `http://localhost:8000` | Zanzo backend base URL |
| `BACKEND_API_KEY` | `change-me` | Must equal the backend's `API_KEY`; injected by the proxy |

---

## 5. The proxy (security model)

`app/api/backend/[...path]/route.ts` is the single point of contact with the backend. The browser calls **`/api/backend/<path>`** (same-origin); the route handler forwards the request to `${BACKEND_URL}/<path>`, adding the `X-API-Key` header from server env. It streams the response back (including `Content-Disposition` for the `.ics` download and binary bodies).

This means:
- The API key lives only in server env, never in client JS or network tab.
- The browser never needs CORS to the backend.
- Presigned media URLs returned by the backend point directly at S3/MinIO and are loaded by the browser as-is.

All client data access goes through `lib/api.ts::api<T>(path, init?)`, which wraps `fetch('/api/backend/' + path)`, sets JSON headers, throws on non-2xx, and returns parsed JSON (or `undefined` for 204).

---

## 6. Routes & data flow

| Route | Component | Backend calls (via proxy) |
|---|---|---|
| `/` | `Feed` | `GET items?limit&offset&search&category` |
| `/category/[slug]` | `Feed` (fixed category) | same, `category` pinned |
| `/failed` | `Feed` (fixed status) | `GET items?status=failed` |
| `/resources` | `ResourcesPage` | `GET resources` |
| `/items/[id]` | `ItemPage` | `GET items/{id}`; actions: `POST items/{id}/recategorize\|retry`, `PATCH items/{id}`, `DELETE items/{id}`, `POST actions/event/{id}/add-to-calendar` |
| `/settings` | `SettingsPage` + `EngagementSettings` | `GET stats`, `GET poller/status`, `POST poller/resume`, `GET/PUT engagement/config`, `GET engagement` |

### Feed (`components/feed.tsx`)
Reusable across `/`, category views, and `/failed` via `fixedCategory` / `fixedStatus` props. Holds search box (debounced 350ms → `search` param → backend hybrid search), category dropdown, item count, infinite "Load more" (offset paging), and loading/empty/error states. Search results come back ranked with a `match_reason`.

### Item detail (`app/items/[id]/page.tsx`)
Client component; unwraps `params` with `use()`. Renders:
- Media: `<video>` with a ref for reels (transcript timestamps call `videoRef.currentTime = seg.start`), or `<img>` for posts.
- Caption, and a scrollable **transcript** where each segment is a button that seeks the video.
- Sidebar: **Auto-engagement** status (if any), **Resources** card (harvested links / claim links), **Extracted** card (`ExtractionView`), **Actions** (add-to-calendar for events, copy-recipe, open on Instagram, retry if failed, archive, delete), and a **Category** select that calls recategorize.

### ExtractionView (`components/extraction-view.tsx`)
Switches on `category` and renders the payload nicely per type: EVENT (date/venue/links), RECIPE (ingredients list + numbered steps + dietary tags), TRAVEL (places mentioned + tips), TECH_REFERENCE (tools, code snippets in `<pre>`, comparisons), EDUCATIONAL (takeaways, concepts, resources), OTHER (summary + notable text + tags).

### Resources view (`app/resources/page.tsx`)
Polls `GET /resources` every 15s. Splits into **Harvested** (engagements with links — direct links open in a new tab; tap-gated ManyChat replies show a "Claim in Instagram" deep link) and **In progress** (commented, awaiting reply, etc., with the engagement status label).

### Settings (`app/settings/page.tsx` + `components/engagement-settings.tsx`)
Poller health card with a **Resume** button surfaced when Instagram needs manual verification; AI spend (this month / all time); library breakdown bars; and the **Auto-engagement** panel: enable toggle, numeric caps + delays (saved via `PUT /engagement/config`), and a live table of recent engagements with deferred-by-cap count. Auto-refreshes every 15s.

---

## 7. Shared types & maps (`lib/api.ts`)

TypeScript mirrors of the backend schemas: `Item`, `ItemDetail`, `Extraction`, `TranscriptSegment`, `Resource`, `EngagementInfo`, `EngagementConfig`, `EngagementRow`, `ResourceRow`, `Stats`, `PollerStatus`. Plus:
- `CATEGORIES` and `CATEGORY_META` (label, slug, Tailwind color/ring per category).
- `SLUG_TO_CATEGORY` (reverse map for category routes).
- `ENGAGEMENT_STATUS_LABEL` (human labels for engagement statuses, e.g. `RESOURCE_RECEIVED → "resource received"`, `INTERACTION_REQUIRED → "reply needs a tap in Instagram"`).
- `extractionHeadline(item)` — picks the best title field across categories for cards.

Adding a category to the backend? Add it to `CATEGORIES` + `CATEGORY_META` here and (optionally) a branch in `ExtractionView`; everything else is data-driven.

---

## 8. Styling

Dark by default (`globals.css` sets a near-black background and light foreground; Tailwind v4 `@theme inline` tokens). Components use zinc/violet accents consistently: violet for active nav, badges, and the Resources/engagement surfaces; category badges get per-type colors from `CATEGORY_META`. Thin custom scrollbars. Responsive: the sidebar collapses to a horizontal scroll bar on small screens; the feed and detail grids stack.

---

## 9. Running & building

```bash
cp .env.example .env.local          # set BACKEND_URL + BACKEND_API_KEY
npm install
npm run dev                         # http://localhost:3000 (needs the backend running)

npm run build && npm start          # production
npx tsc --noEmit                    # typecheck
```

`next.config.ts` sets `output: "standalone"` for the included `Dockerfile` (multi-stage Node 22 build → minimal runtime image).

---

## 10. Relationship to the backend

This repo is **frontend-only**. It assumes a running Zanzo backend reachable at `BACKEND_URL`. The contract between them is the REST API documented in the backend repo's `docs/TECH-DOC.md` §13. If the backend adds an endpoint or field, update the matching type in `lib/api.ts` and the consuming component here.
