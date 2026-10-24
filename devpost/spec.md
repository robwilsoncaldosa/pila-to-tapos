---
doc: spec
status: approved
---

# Pila to Tapos — Technical Spec

Implements `prd.md`, as revised for the one-counter, two-visit process in `4-spec` and for pre-written answers and a laptop-only build in `5-build`. Official-source research: [devpost/research/bir-closure-sources.md](research/bir-closure-sources.md).

> **Language (2026-10-24):** an English option was added. The locale is `fil` (the default) or `en`, kept in the `pila-lang` cookie, set by a switch or by `?lang=en|fil` on any URL (middleware/proxy redirects without the param). It uses typed dictionaries (the English keys must match the Filipino ones), `localizePlan(plan, locale)` for the plan file's per-item `en` fields, and locale-aware dates and durations. `check:content` also fails when an English field is missing. Quotes are unchanged.
>
> **Revised in `5-build` (2026-10-22).** The learner replaced live AI with pre-written cited answers and dropped deployment. This removes Supabase, Realtime, the Claude API, Vercel, and the in-app scanner. The app now runs as one server on the laptop. The data lives in a plan file and in the server's memory, the screens check for updates every 2 seconds, and a phone on the same Wi-Fi scans the TV's QR code with its own camera. The earlier choices and their reasons are kept under Decisions and Open Issues.

## How This Works, In Plain Language

Pila to Tapos is **one Next.js web app running on your laptop**. Each screen just opens a different address on the laptop:

| Page | Opened on | What it is |
|---|---|---|
| `/` and `/plan` | Her phone (or the laptop in phone view) | Screen 1 and "Your plan" (with the Magtanong panel) |
| `/line` | Her phone | Her number, "Ikaw na!", "Balik ka sa [date]," "Tapos na!" |
| `/counter` | The laptop (staff) | The Registration Officer counter |
| `/tv` | The laptop or TV | The panel for the counter, the spoken call, and the QR code |
| `/team` | The laptop | The passcode-protected edit screen |

A real phone reaches the laptop over **the same Wi-Fi**. The TV's QR code holds the laptop's local address (for example `http://192.168.1.23:3000/join`), and the phone's own camera opens it.

**Where things live:**
- **The plan** (steps, documents, fees, time, situation questions, the common questions and their pre-written answers, and a citation for every item) is **one data file**, `content/plan/bir-closure.json`, which the server reads. The team edit screen writes changes back to it.
- **The official BIR text** is three short, verified text excerpts stored as plain text files (RMC 47-2026, Citizen's Charter entry 28-A, and the RMC 84-2026 digest). Every quoted answer is checked word for word against them.
- **The queue** (numbers, who's waiting, who's called) lives **in the server's memory** while the laptop runs it. When staff tap "Call next," the server updates the queue. The TV, the counter, and her phone **check for updates every 2 seconds**, so they react within moments. Restarting the server clears the queue, which is handy between demo takes.
- **Her ticks, her answers, and her journey** (which visit she's on, her return date) live **on her phone**, in the browser's `localStorage`, a sticky note the browser keeps for one site. That's why there's no login.

**How Magtanong works:** the panel lists common questions. Each answer was written ahead of time from the official excerpts and shows its citation. When the source doesn't answer a question, the answer is the grey "not in the source" card. A check script confirms every quoted passage really appears in its source file, so nothing is invented. There's no AI call.

**How the TV speaks:** it plays pre-generated clips in Kokoro's "Heart" voice, the same voice as your MLRSS teaser: "Number B, zero, zero, one. Registration counter." If a clip is missing, the browser's own English voice reads the same line.

**Why this shape:** the proof of concept is shown on video, so one laptop server is enough. There are no accounts, no keys, no hosting, and nothing to pay for.

**How the code is organized** (from your usual conventions): business rules never read files or memory directly. They receive what they need ("a plan repository," "a queue repository," "a clock") as arguments, and one file, the *composition root*, plugs in the real versions. The in-memory and file versions are product code, and they keep the business rules testable without the server running.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.

1. **Choose** → she opens `/` → a server-rendered page shows the single transaction (`prd.md > Choosing the Transaction`).
2. **See the plan** → `/plan` → the page asks the **plan service** for the plan → the **plan repository** reads `bir-closure.json` → she sees the summary, the three-step path, and the checklist. Her phone compares the plan's item revisions with the snapshot in `localStorage` to decide whether to show "Na-update ang requirements" (`prd.md > Your Plan`, `prd.md > Team Edit Screen`).
3. **Ask** → she taps "Magtanong" or a document's "?" → the sheet shows the questions or the document's explanation, already loaded with the plan → a normal card or the grey card, with citations (`prd.md > Asking Questions (Magtanong)`).
4. **Tick documents** → ticks and situation answers are saved to `localStorage` → the pure domain function `checklistStatus()` decides what's missing and whether "Kumuha ng number" unlocks (`prd.md > Your Plan`).
5. **Get a number (visit 1):**
   - She taps "Kumuha ng number" and sees "I-scan ang QR sa TV gamit ang camera ng phone mo."
   - Her phone's camera opens the QR's URL, `http://<laptop-ip>:3000/join?c=registration`.
   - `/join` checks her readiness from `localStorage`, then calls the server action `issueTicket({ journeyId, visit: 1, docsReady: true })`.
   - The **queue service** asks the in-memory **queue repository** for the next number of the day, `B-001`.
   - Her phone stores the ticket id and opens `/line` (`prd.md > Getting a Number`).
6. **Called** → staff tap "Call next" on `/counter` → server action `callNext()` → the queue service marks the first waiting ticket `called` → within 2 s, `/tv`'s poll sees the new current number (flash and speak), and `/line`'s poll sees its ticket `called` (full-screen "Ikaw na!" with a sound) (`prd.md > Being Called`, `prd.md > TV Display`).
7. **Visit 1 done** → staff tap "Done" → server action `finishVisit()` → ticket `done` → `/line` computes the return date with `addWorkingDays(doneAt, 3)` (skips Sat/Sun, Asia/Manila time) and shows "Visit 1 done ✓. Balik ka sa [date]. Dalhin: ₱30" (`prd.md > Visit 1 Done and Coming Back`).
8. **Visit 2** → the labeled demo switch sets `demoSkip` in `localStorage` (or the return date arrives) → "Kumuha ng number" unlocks for visit 2 → the same `/join` flow issues a ticket with `visit: 2` ("Pay & claim") (`prd.md > Getting a Number`, `prd.md > Visit 1 Done and Coming Back`).
9. **Tapos na** → "Done" on the visit 2 ticket → `/line` shows "Tapos na!" with the total time: (visit 1 done − visit 1 issued) + (visit 2 done − visit 2 issued). Her saved ticks are cleared (`prd.md > Visit 1 Done and Coming Back`, `prd.md > States and Boundaries`).

Behind the scenes: `/team` → passcode → server actions → the **team service** validates "no citation, no save" → the plan repository writes the item back to `bir-closure.json` and bumps its revision.

```
 Phone (/plan, /line)      Laptop: staff (/counter)     Laptop/TV (/tv)
   │ localStorage:               │                            │
   │ ticks, answers, journey     │                            │
   │                             │                            │
   ├── issueTicket ──► server actions ◄── callNext / finishVisit
   │                        │
   │                 services (plan, queue, team)
   │                        │
   │        plan repository ─┴─ queue repository
   │        (bir-closure.json)   (server memory)
   │                                                          │
   └──── every 2 s: getTicket ───────── boardState every 2 s ─┘
            (same Wi-Fi: http://<laptop-ip>:3000)
```

## Stack
All learner-selected unless marked *derived*. Versions are as of 2026-10-22 (`npm view`). `create-next-app` and the shadcn CLI pick compatible versions at setup.

| Piece | Choice | Version | Why | Docs |
|---|---|---|---|---|
| Framework | Next.js (App Router) + React | next 16.4.x, react 19.3.x | Your familiar stack; server actions keep the server code small | https://nextjs.org/docs |
| Language | TypeScript | 7.0.x | Familiar | https://www.typescriptlang.org/docs/ |
| Styling | Tailwind CSS + shadcn/ui | tailwindcss 4.3.x, shadcn CLI 4.22.x | Familiar; accessible primitives | https://tailwindcss.com/docs, https://ui.shadcn.com/docs |
| Lint | ESLint + `@shadcn/lint` (`shadcn/no-restyle`) + `no-restricted-imports` for layering | eslint 10.x, @shadcn/lint 0.2.x | *Derived* from your global conventions | https://github.com/shadcn-ui/lint/blob/main/SETUP.md |
| Live updates | Polling every 2 s through server actions | built-in | Laptop-only, so no realtime service is needed | https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations |
| Speech | Browser `speechSynthesis` (Web Speech API), with recorded clips as fallback | built-in | No service or key | https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis |
| QR display | `qrcode.react` (`QRCodeSVG`) | 4.2.x | Small and stable | https://github.com/zpao/qrcode.react |
| Tests (domain only) | Node's built-in test runner via `tsx` | node 22+, tsx | *Derived*: no new test framework | https://nodejs.org/api/test.html |
| Fonts | Atkinson Hyperlegible via `next/font/google` | — | From `prd.md > Look and Feel` | https://fonts.google.com/specimen/Atkinson+Hyperlegible |

No external services, API keys, or accounts are needed.

## Where It Runs and How Someone Tries It

**Environment:** Node.js 22 LTS or newer (this laptop has 24). A phone on the **same Wi-Fi** as the laptop. Public or office Wi-Fi often blocks devices from seeing each other; a phone hotspot that the laptop joins always works.

`.env.example` (committed, with no values):
```
TEAM_PASSCODE=
TEAM_COOKIE_SECRET=
NEXT_PUBLIC_APP_URL=http://localhost:3000   # set to http://<laptop-ip>:3000 so the TV's QR code works from a phone
```
Real values go in `.env.local` (git-ignored). Never paste them into chat.

**Run on the laptop only:**
```bash
npm install
npm run dev
```
Open these:
- http://localhost:3000, in phone view (use the browser's device toolbar)
- http://localhost:3000/counter
- http://localhost:3000/tv
- http://localhost:3000/team

On the laptop, opening `http://localhost:3000/join?c=registration` in the phone-view tab does the same thing as scanning.

**Run with a real phone:**
1. Find the laptop's Wi-Fi address with `ipconfig getifaddr en0`.
2. Set `NEXT_PUBLIC_APP_URL=http://<that-address>:3000` in `.env.local`.
3. Start the server listening on the network with `npm run dev:lan`, which runs `next dev -H 0.0.0.0`. Allow macOS's "accept incoming connections" prompt.
4. On the phone, open `http://<that-address>:3000`, or scan the TV's QR code with the phone's camera.

**Reset between demo takes:** restart the server to clear the queue. On the phone, use the "I-reset" link at the bottom of the plan to clear the ticks and the journey.

**Deployment:** not planned (`prd.md > Deferred From the POC`). It's optional for the hackathon.

**Recording the demo video (about 1 minute):** the laptop screen shows `/counter` and `/tv` side by side. A real phone opens the laptop's address and is screen-recorded (or filmed) next to it. The flow:
1. Plan: open Magtanong, tap the penalty question, and see the grey card with the cited relief-program note.
2. Leave one document unticked and see "Kulang pa."
3. Tick it, then scan the TV's QR code with the phone's camera to get B-001.
4. "Call next": the TV speaks and the phone shows "Ikaw na!"
5. "Done": the phone shows "Balik ka sa [date]."
6. Demo switch, then the visit 2 number, then call, then "Done": "Tapos na!"

The submission needs the video and the public GitHub repository.

## Look and Feel
From `prd.md > Look and Feel` and `scope.md > Inspiration & Identity`. Not re-asked.

- **Tokens** (CSS variables in `src/app/globals.css`, mapped to shadcn theme variables; exact values can be tuned):
  - `--background: #FAF6EE` (warm off-white, like a paper form)
  - `--foreground: #14213D` (deep navy)
  - `--accent-turn: #FFD21F` (jeepney yellow), used **only** for the number and "your turn" moments, always with navy text on it
  - `--ready: #1E7A3C` text on `#D9F2E1`, for "ready ✓" only
  - `--missing: #A3330F` text on `#FFE1D6`, for "Kulang pa" only
  - `--muted-card: #EEF0F3` with `#475066` text, for the grey "not in the source" card
  - TV: `--tv-bg: #0E1525`, numbers in `--accent-turn`
  - Every text and background pair must meet WCAG AA contrast (4.5:1).
- **Type:** Atkinson Hyperlegible (400 and 700) for everything. Phone body text is 18px minimum; headings bold. The number uses 700 at about 4rem on the phone and `clamp(6rem, 18vw, 16rem)` on the TV. Verify that its 0 and O, and 1 and l, look distinct.
- **Route signboard:** `PathLine` renders steps like a jeepney signboard: bold, high contrast, with arrows between steps ("Visit 1: Submit → BIR checks (3 working days) → Visit 2: Pay ₱30 & claim").
- **Ticket stub:** `TicketStub` shows the number on a yellow stub with a dashed tear line, and the step and counter beside it.
- **Density:** spacious and calm, one column on the phone, large tap targets (48px minimum).
- **Copy tone:** plain Taglish exactly as written in the PRD, like a helpful ate or kuya at the info desk.
- **Never:** government logos or seals, purple gradients, tiny text.
- **Motion** (learner request at checkpoint 1, following Emil Kowalski's design-engineering principles; these are the defaults on the shared primitives):
  - **Easing tokens** in `globals.css`: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`, `--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1)`. Never use `ease-in`.
  - **Only `transform` and `opacity` animate.** Name the exact properties; never `transition: all`.
  - **Buttons and other pressable elements:** `transform` over 160ms `--ease-out`, `scale(0.97)` on `:active`.
  - **Sheet:** enters over 300ms `--ease-drawer` and exits over 200ms `--ease-out`.
  - **Dialog:** 180ms `--ease-out`, from `scale(0.95)` and opacity 0, centered.
  - **Checkbox check:** fades in from `scale(0.9)` over 120ms.
  - **Content that appears or disappears** ("Kulang pa," path notices, situation results): opacity plus `translateY(8px)`, 200ms `--ease-out`.
  - **"Ikaw na!" overlay** (rare, important): `scale(0.96)` → 1 plus a fade, 250ms `--ease-out`.
  - **TV call:** an opacity pulse on the panel, with no layout movement.
  - **Ticket stub and "Balik ka sa [date]" card:** a short enter animation (200–250ms).
  - **Never animate** repeated staff actions ("Call next," "Done"), beyond the button's press scale.
  - **Hover effects** only behind `@media (hover: hover) and (pointer: fine)`.
  - **`prefers-reduced-motion: reduce`:** no movement, only short opacity fades.
- **Stack fit:** shadcn primitives are used as-is (Button, Card, Checkbox, Badge, Sheet, Dialog, Switch, Alert, Input, Textarea, RadioGroup). The look comes from theme tokens and `cva` variants, not from restyling primitives inline, so `shadcn/no-restyle` stays green.

## Components

### Domain (pure rules)
Types and pure functions with no IO: `Plan`, `Step`, `PlanDocument`, `Fee`, `Question`, `Citation`, `Ticket`, `Journey`, and `Result<T, E>`.
- `checklistStatus(plan, ticks, answers)` returns `{ missing: PlanDocument[], ready: boolean }`. It applies the situation rules: Hindi means not needed, while Oo, Hindi ko alam, or no answer mean required. Implements `prd.md > Your Plan`.
- `addWorkingDays(date, n)` skips Saturdays and Sundays in Asia/Manila. Implements `prd.md > Visit 1 Done and Coming Back`.
- `diffPlan(snapshot, plan)` returns `{ added, changed }` item ids, for the "Na-update" banner. Implements `prd.md > Team Edit Screen`.
- `formatTicketNumber(letter, seq)` returns `B-001`.
- `validateCitations(plan, sources)` returns the list of problems: an item without a citation, or a `quote` that doesn't appear word for word in the cited source text. It backs "no citation, no save" and the content check.
- `totalVisitTime(journey)` sums both visits.

### Ports
Hand-written contracts:
- `PlanRepository`: `getPlan(transactionId)`, `saveStep`, `saveDocument`, `saveFee`, `saveMeta`. Every save requires a citation and bumps the item's revision.
- `QueueRepository`: `issueTicket({ journeyId, visit, docsReady, issuedAt })`, `listWaiting(counterId)`, `getCurrent(counterId)`, `callNext(counterId, at)`, `finish(ticketId, at)`, `getTicket(id)`.
- `SourceTexts`: `get(sourceId)` returns the excerpt text (used by `validateCitations`).
- `Clock`: `now()`. `Ids`: `uuid()`.

### Services
Factories that take ports and return functions. Types are `ReturnType<typeof createX>`.
- **Plan service:** `getPlan()`. Implements `prd.md > Your Plan` and `prd.md > Asking Questions (Magtanong)`; the questions and explanations come with the plan.
- **Queue service:** `issueTicket`, `callNext`, `finishVisit`, `getTicket`, `boardState` (current number plus waiting list). It refuses `callNext` on an empty list with `{ ok: false, error: "empty" }`. Implements `prd.md > Getting a Number`, `prd.md > Staff Counter`, and `prd.md > Being Called`.
- **Team service:** `checkPasscode`, plus `saveStep`, `saveDocument`, `saveFee`, and `saveMeta`, each rejecting a missing citation (`citation_required`) or a quote not found in the source (`quote_not_in_source`). Implements `prd.md > Team Edit Screen`.

### Adapters
- **File plan repository** (`src/adapters/file/plan-repository.ts`, `server-only`). It reads and writes `content/plan/bir-closure.json`, writing through a temp file and a rename so a crash can't leave half a file. It's the only server code that imports `node:fs` (besides the sources reader and `scripts/`).
- **Source texts reader** (`src/adapters/file/source-texts.ts`, `server-only`). It reads `content/sources/*.txt` plus `sources.json` (title, URL, effective date).
- **In-memory queue repository** (`src/adapters/memory/queue-repository.ts`, `server-only`). This is product code: an array of tickets kept on `globalThis`, so it survives hot reload. Numbers restart at B-001 each day (Asia/Manila) and on a server restart.
- **Server actions** (`src/app/actions/`) are adapters too: parse input, call exactly one service method, and map the `Result` to a plain serializable response. `getTicket` and `boardState` are what the screens poll.

### Composition Root
`src/composition-root.ts` (`server-only`) builds the services with the file plan repository, the source texts reader, the in-memory queue repository, the system clock, and `crypto.randomUUID`, and caches them on `globalThis`. Only server actions and server components call it. Domain and service tests call `createXService` with plain object fakes.

### Customer App: Screen 1
`src/app/page.tsx` plus `src/app/components/`. One choice card linking to `/plan`. PRD ref: `prd.md > Choosing the Transaction`.

### Customer App: Your Plan
`src/app/plan/page.tsx` (a server component fetches the plan) plus client components in `src/app/plan/components/`:
- `PlanSummary`: step count, amount (₱30, plus "taxes or penalties if BIR finds any: no official amount listed"), and "about 3 working days," each with a citation chip.
- `PathLine` (shared): the three steps. The waiting step shows the 30-day warning and the cited relief note when the unfiled-returns answer is Oo or Hindi ko alam.
- `Checklist`, `ChecklistItem`, and `SituationItem` (RadioGroup: Oo, Hindi, Hindi ko alam), plus `MissingWarning` ("Kulang pa").
- `LastChecked`, `UpdatedBanner` ("Na-update ang requirements" plus highlights).
- `GetNumberButton`, which opens `ScanInstructions` ("I-scan ang QR sa TV gamit ang camera ng phone mo," plus a "Bumalik" button).
- `ResetLink` ("I-reset").

PRD ref: `prd.md > Your Plan`.

### Magtanong (pre-written answers)
In `src/app/plan/components/`:
- `AskSheet` (shadcn Sheet from the bottom): the question list. Tapping one shows its answer, and a "Mga tanong" back button returns to the list.
- `AnswerCard` (normal style): the answer text, then each citation as a quoted passage with its source title and locator, linking to the official PDF.
- `NotInSourceCard` (grey, info icon): "Hindi ito direktang sinasagot ng opisyal na source," the related quote labeled "Related, not a direct answer," who to ask, and "Gabay lang ito, hindi legal o tax advice."
- `DocumentExplainer`: the "?" on a document opens the same sheet showing that document's explanation and citation. The "Hindi ko alam" nudge opens it too.

The sheet overlays the page and doesn't navigate, so the scroll position is kept. PRD ref: `prd.md > Asking Questions (Magtanong)`.

### Customer App: Join (QR target)
`src/app/join/page.tsx` is a client page. It reads the journey from `localStorage`:
- **Not ready:** redirect to `/` (Screen 1).
- **Ready for visit 1:** `issueTicket(visit 1)`.
- **Visit 1 done and the return date reached or `demoSkip` on:** `issueTicket(visit 2)`.
- **Visit 2 locked:** go to `/line`, which shows "Balik ka sa [date]."

On success it stores the ticket id and goes to `/line`. PRD ref: `prd.md > Getting a Number`.

### Customer App: In Line
`src/app/line/page.tsx` plus `src/app/line/components/`:
- `TicketStub` and `PathLine` (current step highlighted), with "All documents ready ✓."
- `CalledOverlay` ("Ikaw na! [counter]" full-screen; plays a chime if sound alerts are on).
- `SoundPrompt` (the one-time "Tap to turn on sound alerts," which unlocks audio).
- `VisitDone` ("Visit 1 done ✓. Balik ka sa [date]. Dalhin: ₱30" plus `DemoSkipSwitch`, labeled "Demo: lumipas ang 3 working days").
- `TaposNa` ("Tapos na!" with the total time).
- `OfflineBanner` ("Offline: huling update HH:MM," driven by `navigator.onLine` and the last successful poll).

`usePoll(getTicket, 2000)` polls every 2 s, and immediately on load, on reconnect, and when the page becomes visible again. If the ticket is already `called`, it shows "Tinawag ka na sa [counter]." PRD refs: `prd.md > Being Called`, `prd.md > Visit 1 Done and Coming Back`, and `prd.md > States and Boundaries`.

### Staff Counter
`src/app/counter/page.tsx` plus components:
- `CounterHeader` (the counter's name).
- `WaitingList` (rows: number, time waiting, visit badge "Submit" or "Pay & claim," and "Documents ready ✓"; no names; "Walang naghihintay" when empty).
- `CallNextButton` (does nothing when the list is empty).
- `CurrentTicket` (number plus "Done").

It polls `boardState` every 2 s. PRD ref: `prd.md > Staff Counter`.

### TV
`src/app/tv/page.tsx` plus components:
- `StartTvOverlay` ("Simulan ang TV": the one tap that unlocks speech and audio).
- `CounterPanel` (the current number in huge yellow; flashes for 3 s on a new call).
- `JoinQr` (`QRCodeSVG` of `${NEXT_PUBLIC_APP_URL}/join?c=registration`, with the address printed small underneath).
- `Announcer`, which calls `speak()` when the polled current ticket changes.

Dark theme. PRD ref: `prd.md > TV Display`.

### Speech
`src/lib/speech.ts`. `speak(ticketNumber, counterSpeechLabel)`:
1. (Revised in final review: English and the Heart voice, the learner's choice.) Play the whole-call clip `public/audio/call-b-NNN.m4a` (pre-generated for B-001 to B-030 with Kokoro `af_heart` through the product-video engine).
1. If it's missing, play the word clips in sequence (`word-number`, `letter-b`, `digit-0` … `digit-9`, `counter`, all `.m4a`).
1. If those are missing too, the browser's voice reads "Number B, zero, zero, one. Registration counter." in `en-US`.
1. `NEXT_PUBLIC_SPEECH_MODE=voice` skips the clips.
2. Otherwise, play clips in sequence from `public/audio/` (`numero.mp3`, `letter-b.mp3`, `digit-0.mp3` … `digit-9.mp3`, `counter.mp3`), recorded by the team.

`src/app/tv/voice-check/page.tsx` lists the available voices and test-speaks the call. **This is built in slice 1** (see Decisions and Open Issues).

### Team Edit Screen
`src/app/team/page.tsx` plus components:
- `PasscodeForm`: server action `unlockTeam(passcode)`, which does a timing-safe compare with `TEAM_PASSCODE` and sets an httpOnly, signed (HMAC with `TEAM_COOKIE_SECRET`) cookie for 8 hours.
- `StepEditor`, `DocumentEditor`, `FeeEditor`, `MetaEditor` (last-checked date, processing time). Each form has a **required** citation (source picker plus locator such as "Sec. 4(1)").

Server actions call the team service, which writes the plan file. The common questions and answers are edited in the data file directly (`prd.md > Deferred From the POC`). Built **last**. PRD ref: `prd.md > Team Edit Screen`.

### Phone Storage
`src/lib/phone-storage.ts`: a typed wrapper around `localStorage` key `pila:v1`. Every read and write goes through `try/catch`, and it falls back to in-memory if storage is blocked (private mode). See Data Model.

## Data Model

### Plan file (`content/plan/bir-closure.json`)
This is the single source of the plan. **You review its wording in slice 1 and slice 2.**

```ts
{
  transaction: { id: "bir-closure-freelancer", title, processingTimeLabel: "about 3 working days",
                 processingCitation: Citation, lastCheckedOn: "2026-10-22", revision: number },
  counter: { id: "registration", label: "Registration Officer counter", speechLabel: string },
  steps:     { id, position, name, kind: "visit" | "wait", visitNo?: 1 | 2, waitWorkingDays?: 3,
               citation: Citation, revision,
               notices?: { id, kind: "warning" | "related", text, citations: Citation[] }[] }[],
               // notices: the waiting step's 30-day warning and relief note (added in slice 1)
  documents: { id, position, name, whereToGet, requirement: "required" | "situation",
               situationQuestion?: string, notNeededReason?: string,
               explanation: string, citation: Citation, revision }[],
  fees:      { id, label, amountPhp: number | null, visitNo, citation: Citation, revision }[],
  questions: { id, question: string, kind: "direct" | "not_in_source",
               answer: string,                    // direct: the plain-language answer
               citations: Citation[],             // direct: at least one
               related?: Citation[],              // not_in_source: the closest cited passage(s)
               whoToAsk?: string }[]              // not_in_source: e.g. "RDO – Client Support Section"
}
// Citation = { sourceId: "rmc-47-2026" | "cc-28a" | "rmc-84-2026", locator: string, quote: string }
//   quote must appear word for word in content/sources/<sourceId>.txt
```

**Steps:**
1. "Visit 1: Submit," at the Registration Officer counter. Citation: CC 28-A, step 1.
2. "BIR checks your records," a wait of 3 working days. Citation: RMC 47-2026 Sec. 6 and CC 28-A "Total processing time: 3 days."
3. "Visit 2: Pay ₱30 & claim the tax clearance." Citation: CC 28-A, steps 11–12.

**Documents:**

| Document | Requirement | Where to get it | Citation |
|---|---|---|---|
| BIR Form 1905 (2 original copies) | Required | RDO Client Support Section, or download from bir.gov.ph | RMC 47-2026 Sec. 4(1) |
| Original COR / eCOR (Form 2303) | Situation: "Nasa iyo pa ba ang original COR mo?" (Lost COR handling isn't in the sources, so "Hindi" routes to the RDO and the question nudges Magtanong) | | RMC 47-2026 Sec. 4(4)(a) |
| Unused invoices / receipts and their inventory | Situation: "May natira ka pang hindi nagamit na invoices o resibo?" | | RMC 47-2026 Sec. 4(3) |
| Other BIR permits (Authority to Print, Notice to Issue Invoice, CRM/POS permit, EIS certificate) | Situation: "May iba ka pang BIR permit (hal. Authority to Print)?" | | RMC 47-2026 Sec. 4(4)(b–e) |
| Ending inventory list | Situation: "VAT-registered ka ba?" Hindi gives "Hindi kailangan sa iyo: para lang sa VAT-registered" | | RMC 47-2026 Sec. 4(2) |
| Notarized SPA plus IDs | Situation: "May ibang magpa-file para sa iyo?" | | RMC 47-2026 Sec. 4(5)(a) |
| Final/short-period returns filed (zero returns for no-activity periods) | Situation: "May hindi ka pa na-file na returns?" This drives the path warning and relief note | | RMC 47-2026 Sec. 5; relief: RMC 84-2026 |

**Fees:**
- ₱30 documentary stamp, visit 2. Citation: CC 28-A step 11.
- "Taxes or penalties, if BIR finds any": amount null, so the app says "no official amount listed." Citation: RMC 47-2026 Sec. 6.

**Common questions (draft, 6–8 in Taglish):** these are drafted from the research file in slice 2, and you edit the wording. They include:
- Anong form ang gagamitin?
- Magkano ang babayaran?
- Gaano katagal?
- Kailangan ko ba ng ending inventory?
- Ano ang gagawin sa natirang resibo?
- May deadline ba?
- **May penalty ba ako sa mga hindi ko na-file na returns bago ako makapag-close?** This one is `not_in_source`: no case-specific amount exists. Its related passages are RMC 47-2026 Sec. 6 (penalties stop accruing after submission) and RMC 84-2026 (the one-time relief program until 31 Dec 2026), and who to ask is the RDO.
- "May deadline ba?" is also `not_in_source`: no official deadline was found.

### Queue (server memory)
`tickets: { id, day ("YYYY-MM-DD", Asia/Manila), seq, number ("B-001"), journeyId, visitNo, counterId, docsReady, status: "waiting" | "called" | "done", issuedAt, calledAt?, doneAt? }[]`, held on `globalThis`. There's no personal data. A server restart clears it.

### Her phone (`localStorage` key `pila:v1`)
```ts
{
  journeyId: string,                  // uuid, created on first plan visit
  ticks: Record<docId, true>,
  answers: Record<docId, "oo" | "hindi" | "hindi_ko_alam">,
  seen: { revision: number, items: Record<itemId, number> },  // for "Na-update"
  visits: { 1?: { ticketId, issuedAt, doneAt? }, 2?: { ticketId, issuedAt, doneAt? } },
  demoSkip: boolean,
  soundOn: boolean
}
```
**What happens when she leaves and comes back:**
- Ticks, answers, and visits stay until "Tapos na!" (which clears ticks and answers) or "I-reset."
- The ticket's live status always comes from the server.
- If the server was restarted and her ticket no longer exists, `/line` says "Hindi na makita ang number mo. Kumuha ulit." and unlocks a new scan.
- After a plan change, ticks are kept for unchanged documents and dropped for changed ones, and new documents start unticked.

## File Structure

```
pila-to-tapos/
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Atkinson Hyperlegible, theme tokens, <html lang="fil">
│   │   ├── globals.css                # color tokens (Look and Feel)
│   │   ├── page.tsx                   # Screen 1 (composition only)
│   │   ├── components/                # Screen 1 pieces + index.ts
│   │   ├── plan/
│   │   │   ├── page.tsx               # Your plan (server component fetches plan)
│   │   │   └── components/            # PlanSummary, Checklist, ChecklistItem, SituationItem, MissingWarning,
│   │   │                              # UpdatedBanner, LastChecked, GetNumberButton, ScanInstructions, ResetLink,
│   │   │                              # AskSheet, AnswerCard, NotInSourceCard, DocumentExplainer + index.ts
│   │   ├── join/page.tsx              # QR target: issue visit 1/2 number or send to Screen 1
│   │   ├── line/
│   │   │   ├── page.tsx               # In line
│   │   │   └── components/            # TicketStub, CalledOverlay, SoundPrompt, VisitDone,
│   │   │                              # DemoSkipSwitch, TaposNa, OfflineBanner + index.ts
│   │   ├── counter/
│   │   │   ├── page.tsx               # staff counter
│   │   │   └── components/            # CounterHeader, WaitingList, CallNextButton, CurrentTicket + index.ts
│   │   ├── tv/
│   │   │   ├── page.tsx               # TV
│   │   │   ├── voice-check/page.tsx   # slice 1: list voices, test the call
│   │   │   └── components/            # StartTvOverlay, CounterPanel, JoinQr, Announcer + index.ts
│   │   ├── team/
│   │   │   ├── page.tsx               # passcode + editors
│   │   │   └── components/            # PasscodeForm, StepEditor, DocumentEditor, FeeEditor, MetaEditor + index.ts
│   │   └── actions/                   # server actions (adapters): queue.ts, plan.ts, team.ts
│   ├── components/
│   │   ├── ui/                        # shadcn primitives + stack.tsx, inline.tsx, grid.tsx, container.tsx + index.ts
│   │   ├── path-line/                 # PathLine (used by /plan and /line) + index.ts
│   │   └── index.ts
│   ├── domain/                        # plan.ts, checklist.ts, queue.ts, journey.ts, working-days.ts,
│   │   │                              # plan-diff.ts, citations.ts, result.ts  (pure, no IO)
│   │   └── *.test.ts                  # node:test files for the pure rules
│   ├── ports/                         # plan-repository.ts, queue-repository.ts, source-texts.ts, clock.ts, ids.ts
│   ├── services/                      # plan-service.ts, queue-service.ts, team-service.ts (+ *.test.ts)
│   ├── adapters/
│   │   ├── file/                      # server-only: plan-repository.ts (reads/writes the plan file), source-texts.ts
│   │   └── memory/                    # server-only: queue-repository.ts (product code)
│   ├── composition-root.ts            # server-only; builds services; cached on globalThis
│   └── lib/
│       ├── phone-storage.ts           # typed localStorage journey
│       ├── use-poll.ts                # poll a server action every 2 s (+ on focus/online)
│       ├── speech.ts                  # speechSynthesis or clips
│       └── utils.ts                   # shadcn cn()
├── content/
│   ├── sources/                       # rmc-47-2026.txt, cc-28a.txt, rmc-84-2026.txt, sources.json
│   └── plan/bir-closure.json          # the plan, questions and answers, all with citations
├── scripts/check-content.ts           # npm run check:content — validateCitations over the plan file
├── public/audio/                      # fallback clips (only if no Filipino voice)
├── devpost/                           # planning docs + research (learner-profile.md is git-ignored)
├── .env.example
├── eslint.config.mjs                  # next config + @shadcn/lint + no-restricted-imports (layering)
├── components.json                    # shadcn
├── package.json                       # scripts: dev, dev:lan, build, lint, typecheck, test, check:content
└── README.md                          # what it is, how to run, how to demo
```

**Layering rule (ESLint `no-restricted-imports`):** `node:fs` and `fs` are allowed only in `src/adapters/**` and `scripts/**`. `src/domain/**` may not import from `ports`, `services`, `adapters`, `app`, or React. `src/services/**` may import only `domain` and `ports`.

## External Services and Dependencies

None at runtime: no APIs, databases, hosting, or keys.

**npm packages:** `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, shadcn (CLI) + `class-variance-authority` + Radix primitives (added by shadcn), `qrcode.react`, `server-only`, `eslint`, `@shadcn/lint`, `@typescript-eslint/parser`, and `tsx` (to run tests and scripts).

**The official sources** are cited by URL in `sources.json` (from the research file):
- RMC 47-2026: https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%2047-2026.pdf (digest: https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%2047-2026%20Digest.pdf)
- Citizen's Charter 2026, entry 28-A: https://bir-cdn.bir.gov.ph/BIR/pdf/BIR%20Citizen's%20Charter%20(2026%20Edition)%20final.pdf
- RMC 84-2026 digest: https://bir-cdn.bir.gov.ph/BIR/pdf/RMC%20No.%2084-2026%20Digest.pdf

## Important Failure Modes

- **The phone can't reach the laptop** (a different Wi-Fi, Wi-Fi that blocks devices from seeing each other, or the macOS firewall) → use the phone's hotspot with the laptop joined to it, and allow incoming connections. As a last resort, record with the laptop's phone view only.
- **The laptop's address changes** (a new network) → `/tv` prints the address under the QR code. Update `NEXT_PUBLIC_APP_URL` and restart.
- **No Filipino voice on the TV's browser** → the pre-recorded clips play instead. Browsers block sound until a tap, so the TV always starts with a "Simulan ang TV" tap.
- **A quoted answer drifts from the official text** → `npm run check:content` fails the build step and names the item. The team edit screen refuses a save the same way.
- **The server restarts mid-demo** → the queue empties, and her phone says "Hindi na makita ang number mo. Kumuha ulit." Treat it as a reset.
- **localStorage is blocked** (private browsing) → the app still works for the session, but ticks won't survive a reload. A small note says so.

## What Was Simplified and Why

- **Pre-written answers instead of live AI** (learner decision in `5-build`). The proof is shown on video, so a curated list of questions with quoted, cited answers proves the kernel without an API key, cost, or the riskiest integration. The fuller version (Claude with the citations feature) is described under Decisions.
- **A laptop server instead of a hosted database and realtime service** (learner decision in `5-build`). One process keeps the queue in memory, and screens poll every 2 s. The fuller version would need Supabase (or similar), Realtime, and hosting.
- **The phone's own camera instead of an in-app scanner.** Phones require HTTPS for the camera inside a website, and a local address isn't HTTPS. The QR code is a plain URL, so the native camera works.
- **The plan is a JSON file instead of database tables.** It has the same shape, and the team screen writes back to it.
- **Readiness is self-reported on her phone.** The server trusts `docsReady`.
- **The return date skips weekends, not Philippine holidays.**
- **The staff counter and TV pages are open URLs on the local network;** only the team edit screen has a passcode.
- **One office, one counter, one transaction, and the number letter is always B.**
- **A demo switch simulates the 3 working days**, labeled on screen.

The kernel isn't faked: the requirements, quotes, and citations come from the real official text, and a script checks every quote.

## Decisions and Open Issues

### Learner decisions
- **Stack:** Next.js, TypeScript, shadcn/ui, and Tailwind, because they're familiar.
- **TV speech:** browser speech, checking early for a Filipino voice, with pre-recorded clips as the fallback.
- **QR:** a small library.
- **Process:** follow the real one counter and two visits (`prd.md > Product Decisions`).
- **Pre-written cited answers instead of live AI** (`5-build`). "It's only video… this is a proof of concept only." It must be described honestly as pre-written, not AI.
- **No deployment** (`5-build`). This removes Supabase and Vercel too, and the phone joins over Wi-Fi.
- **Superseded `4-spec` choices,** kept for the record and as the path back if you want them later:
  - Supabase with Realtime: you'd used it before, and it was needed for deployment.
  - The Claude API with citations and no vector database.
  - Vercel's free tier.

### Derived from your decisions or global conventions (implementation detail)
- **Code structure:** the functional repository pattern with ports, factory services, file and in-memory adapters as product code, a composition root, and lint-enforced layering (`fs` only in adapters and scripts).
- **Live updates:** polling every 2 s through server actions.
- **Quote checking:** `validateCitations` plus `npm run check:content` keep every quote word for word in its source file.
- **Domain tests:** Node's built-in test runner, so there's no new framework.

### The one useful unknown: is there a Filipino voice on the TV's browser?
You raised it: "Check early whether a Filipino voice is available on the TV's browser." Voices depend on the browser and the operating system, not on our code, and many systems have no `fil-PH` voice.

**Agreed investigation (slice 1):** open `/tv/voice-check` on the actual browser that will play the TV. It lists every voice and plays "Numero B-001, Registration counter" with the best match.

**Evidence needed:** the voice list plus your ear's verdict. If there's no Filipino voice, or it sounds wrong, record the clips (`public/audio/`) and switch `speak()` to clip mode before the TV is built in slice 3.

### Assumptions confirmed in spec review (2026-10-22)
1. The demo switch sits on her phone's "Visit 1 done" screen.
2. Before the return date, visit 2 stays locked ("Balik ka sa [date]") unless the demo switch is on.
3. "Total time" means time at the office on both visits added together, not calendar days.
4. The staff counter and TV pages have no passcode; only the team edit screen does.
5. The exact spoken counter name is set in the data (`counter.speechLabel`), for example "Registration counter."

### Open issues (non-blocking, resolved in the build)
- **Content review:** you review the plan wording (slice 1) and the common questions and answers (slice 2) before the demo.
- **RMC 47-2026 is a scanned PDF:** the excerpt uses the OCR-verified quotes in the research file and the clean "Digest" PDF, and cites both.
- **Citizen's Charter 28-A predates RMC 47-2026:** where they conflict (the ending inventory, audit thresholds), RMC 47-2026 controls, per its own repealing clause. Record this in `sources.json`.
- **Lost COR, eCOR surrender, and ORUS-only closure** aren't covered by the sources. If they're added as questions, they're `not_in_source` with who to ask.
- **Verify at the start of the build:** that Atkinson Hyperlegible's 0/O and 1/l look distinct. **Verify before slice 3:** that the phone reaches `http://<laptop-ip>:3000` on the network you'll record on.
