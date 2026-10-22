---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast (chosen 2026-10-22)

Commits go to the `build` branch. `main` is production and changes only with the learner's explicit permission for that specific action (the learner's global rule).

## Slices

- [ ] **1. Her plan from the official source: Screen 1, then Your plan with the checklist, situation questions, and "Kulang pa"**
  Becomes usable: On the laptop in phone view, she opens the app, picks "BIR: Close my freelancer registration," and sees her plan:
  - the summary (₱30, about 3 working days, citations)
  - the three-step path (with the unfiled-returns warning when it applies)
  - the checklist, with "Kung naaangkop sa iyo" questions and the "Kulang pa" warning
  - the "last checked" date
  - "Kumuha ng number," which unlocks when everything that applies is ticked

  Ticks and answers survive a reload. Also usable: `/tv/voice-check` lists the browser's voices and test-speaks the call.
  Why now: This is the kernel, the whole path before she leaves home, so it comes first. The project scaffold lives inside it. The voice check is the spec's first investigation, and its result decides how the TV speaks in slice 3, so it needs lead time.
  PRD ref: `prd.md > Choosing the Transaction`, `prd.md > Your Plan`, `prd.md > States and Boundaries` (first use, saved on her phone, no official amount), `prd.md > Look and Feel`
  Spec ref:
  - `spec.md > How This Works, In Plain Language`, `spec.md > Stack`, `spec.md > Look and Feel`, `spec.md > File Structure`
  - `spec.md > Components` (Domain, Ports, Services, Adapters, Composition Root, Customer App: Screen 1, Customer App: Your Plan, Phone Storage, Speech)
  - `spec.md > Data Model` (plan file, her phone)
  - `spec.md > Decisions and Open Issues` (the one useful unknown)

  Build:
  - Scaffold Next.js (App Router), TypeScript, Tailwind, and shadcn/ui.
  - Add ESLint with `@shadcn/lint` and the layering `no-restricted-imports` rules.
  - Add the Stack/Inline/Grid/Container primitives, plus the theme tokens and Atkinson Hyperlegible.
  - Write the domain (`plan`, `checklist`, `citations`, `result`), ports, plan service, and composition root, with the file plan repository and source-texts reader.
  - Write `content/sources/` (the verified excerpts) and `content/plan/bir-closure.json` (steps, documents, fees, and meta, with quoted citations; questions come in slice 2), plus `npm run check:content`.
  - Build Screen 1 and the `/plan` components (PlanSummary, PathLine, Checklist, SituationItem, MissingWarning, LastChecked, GetNumberButton with ScanInstructions, ResetLink), `lib/phone-storage.ts`, and `/tv/voice-check`.

  Verify (mechanical):
  - `npm run typecheck`, `npm run lint`, and `npm run build` pass.
  - `npm test` (Node's test runner via `tsx`) on `checklistStatus` passes the situation rules: Hindi frees the document, while Oo, Hindi ko alam, or no answer lock the button. It also passes `validateCitations`, which catches a missing citation and a quote not in the source.
  - `npm run check:content` passes on the real plan file.
  - Start the dev server and fetch `/` and `/plan`. Confirm the key strings ("Ano'ng kailangan mong gawin?", "₱30", "Kung naaangkop sa iyo", "Huling sinuri").
  - In the browser pane: tick everything that applies, confirm the button unlocks, and confirm the ticks persist after a reload, with no console errors.
  - `/tv/voice-check` renders a voice list.

  Learner check:
  - Open http://localhost:3000 in phone view and choose the BIR closure. Read the plan top to bottom and answer the situation questions.
  - Leave one document unticked and read the "Kulang pa" warning, then tick it and watch "Kumuha ng number" unlock.
  - Check the requirements wording.
  - Open http://localhost:3000/tv/voice-check on the browser that will be your TV. Tell me which voices are listed and how "Numero B-001" sounds.

  Commit: `Show the official BIR closure plan with checklist`

- [ ] **2. Magtanong: pre-written answers from the official text, with citations**
  Becomes usable: She taps "Magtanong" and sees the common questions. Tapping one shows a normal card that quotes the official text, with its citation. Her penalty question shows the grey "not in the source" card, with the related RMC 47-2026 and relief-program passages and who to ask. The "?" on a document opens its explanation. Closing the sheet leaves her where she was.
  Why now: This completes the kernel, and you review the answer wording while there's time to change it.
  PRD ref: `prd.md > Asking Questions (Magtanong)`, `prd.md > Your Plan` (the "?" and the "Hindi ko alam" nudge)
  Spec ref: `spec.md > Components` (Magtanong (pre-written answers), Domain), `spec.md > Data Model` (plan file: questions), `spec.md > Important Failure Modes`
  Build:
  - Draft 6–8 Taglish questions and answers in `bir-closure.json` from the research file, each with quoted citations; the penalty and deadline questions are `not_in_source`.
  - Add document explanations.
  - Build AskSheet, AnswerCard, NotInSourceCard, and DocumentExplainer, and wire the "?" and the "Hindi ko alam" nudge.

  Verify (mechanical):
  - `npm run typecheck`, `npm run lint`, and `npm run build` pass.
  - `npm run check:content` passes: every answer and explanation has at least one citation, and every `quote` appears word for word in its source file.
  - `npm test` passes.
  - In the browser pane:
    - Open the sheet, tap the penalty question, and confirm the grey card shows all five parts and no peso amount.
    - Tap a direct question and confirm its citation shows.
    - Close the sheet and confirm the scroll position is unchanged.

  Learner check: Open your plan and tap "Magtanong." Tap "May penalty ba ako sa mga hindi ko na-file na returns bago ako makapag-close?" and read the grey card. Tap a question the source answers, and the "?" on a document. Edit any wording you'd change.
  Commit: `Add pre-written Magtanong answers with citations`

- [ ] **3. Get a number and get called (visit 1), including your real phone over Wi-Fi**
  Becomes usable: With her checklist done, "Kumuha ng number" says to scan the TV's QR code. Scanning it with the phone's camera (or opening `/join` in the laptop's phone view) gives B-001, shown on a ticket stub with "Step 1 of 3: Submit."
  - `/counter` shows the waiting list, with "Submit" and "Documents ready ✓."
  - "Call next" makes `/tv` flash and say the call, and her phone goes full-screen with "Ikaw na!" and a sound, within about 2 s.
  - Scanning before preparing lands on Screen 1.
  - An empty list says no one is waiting.
  - A real phone on the same Wi-Fi does all of this.

  Why now: The second cool moment depends on this, and so does the phone-to-laptop connection, the build's main remaining risk. Proving it now leaves time to switch to a hotspot. It also puts the voice-check result to use.
  PRD ref: `prd.md > Getting a Number`, `prd.md > Being Called`, `prd.md > Staff Counter`, `prd.md > TV Display`, `prd.md > States and Boundaries` (empty waiting list, privacy)
  Spec ref:
  - `spec.md > Components` (Domain, Ports, Services, Adapters, Customer App: Join, Customer App: In Line, Staff Counter, TV, Speech)
  - `spec.md > Data Model` (queue)
  - `spec.md > Where It Runs and How Someone Tries It` (run with a real phone)

  Build:
  - The queue domain and `formatTicketNumber`; the in-memory queue repository; the queue service.
  - Server actions: `issueTicket`, `callNext`, `finishVisit`, `boardState`, `getTicket`.
  - `lib/use-poll.ts`.
  - `/join`; `/line` (TicketStub, CalledOverlay, SoundPrompt).
  - `/counter`.
  - `/tv` (StartTvOverlay, CounterPanel, JoinQr with the printed address, Announcer), with `lib/speech.ts` set by the voice-check outcome. If the clips are needed, the learner records them.
  - The `dev:lan` script and `NEXT_PUBLIC_APP_URL`.

  Verify (mechanical):
  - `npm run typecheck`, `npm run lint`, and `npm run build` pass.
  - `npm test` on the queue service with in-memory fakes:
    - numbers go B-001, then B-002
    - `callNext` on an empty list returns `empty`
    - `callNext` calls the first waiting ticket
    - `finish` marks it done
  - In the browser pane, with `/line` (phone emulation), `/counter`, and `/tv`:
    - `/join` issues a number.
    - "Call next" makes `/tv` show and flash it, and `/line` shows "Ikaw na!" within 2 s.
    - `/join` with an unfinished checklist redirects to `/`.
    - No names appear in the `/tv` or `/counter` DOM.
  - With `npm run dev:lan`, a request to `http://<laptop-ip>:3000/tv` from the laptop returns 200, and the QR's encoded URL uses that address.

  Learner check: Run `npm run dev:lan` and open `/counter` and `/tv` side by side on the laptop. On your real phone, open the plan, tick everything, and scan the TV's QR code with your camera. Tap "Call next," hear the TV, and see "Ikaw na!" on your phone.
  Commit: `Issue numbers and call them on the counter, TV, and phone`

- [ ] **4. Two visits: "Balik ka sa [date]," the demo switch, and "Tapos na!"**
  Becomes usable: "Done" on visit 1 moves her phone to "Visit 1 done ✓. Balik ka sa [date] (3 working days). Dalhin: ₱30," with step 2 highlighted. The labeled "Demo: lumipas ang 3 working days" switch unlocks visit 2. Scanning again gives a new "Pay & claim" number, and "Done" shows "Tapos na!" with the total time across both visits.
  These states also work:
  - reopening the app lands on her current step
  - offline shows the "Offline: huling update" banner
  - being called while away shows "Tinawag ka na"
  - a ticket that's gone after a server restart shows "Hindi na makita ang number mo. Kumuha ulit."

  Why now: This completes the whole core journey. The date logic is pure and low-risk.
  PRD ref: `prd.md > Visit 1 Done and Coming Back`, `prd.md > Getting a Number` (visit 2), `prd.md > States and Boundaries` (reopening while in line, offline, called while away, between visits, next day)
  Spec ref: `spec.md > Components` (Domain, Customer App: In Line, Customer App: Join, Phone Storage), `spec.md > Data Model` (her phone, queue)
  Build:
  - `addWorkingDays`, `totalVisitTime`, and the journey rules.
  - VisitDone, DemoSkipSwitch, TaposNa, and OfflineBanner.
  - The visit-2 branch in `/join`.
  - The missing-ticket state.
  - Clear her ticks at "Tapos na!"

  Verify (mechanical):
  - `npm run typecheck`, `npm run lint`, and `npm run build` pass.
  - `npm test`:
    - `addWorkingDays`: Thu gives Tue, Fri gives Wed, Mon gives Thu, and the Asia/Manila midnight boundary holds
    - `totalVisitTime` adds both visits
  - In the browser pane:
    - Run the whole journey from visit 1 through "Tapos na!"
    - A reload mid-line lands on the current step.
    - Dispatching `offline` shows the banner.
    - A call made while the tab is hidden shows "Tinawag ka na" on `visibilitychange`.
    - After a server restart, the missing-ticket message appears.

  Learner check: Run the whole journey with your phone:
  1. Get a number, call it, and tap "Done."
  2. Read the return date.
  3. Flip the demo switch.
  4. Scan again for visit 2, call it, and tap "Done."
  5. See "Tapos na!"

  Commit: `Guide her through both visits to Tapos na`

- [ ] **5. Team edit screen and "Na-update ang requirements"**
  Becomes usable:
  - `/team` opens only with the passcode.
  - The team can edit steps, documents, fees, processing time, and the "last checked" date, saved to the plan file. Saving without a citation, or with a quote that isn't in the source, is refused.
  - Her reopened plan shows the "Na-update ang requirements" banner with the changes highlighted.
  - A new document starts unticked and locks the button again, while unchanged ticks stay.
  - Anyone already in line keeps her number.

  Why now: The PRD says this is built last. If time runs short, editing `bir-closure.json` directly is the fallback.
  PRD ref: `prd.md > Team Edit Screen`, `prd.md > States and Boundaries` (requirements updated, team access)
  Spec ref: `spec.md > Components` (Team Edit Screen, Services, Domain, Adapters: file plan repository), `spec.md > Data Model` (plan file revisions; her phone's `seen` snapshot)
  Build: `diffPlan`; the team service (`checkPasscode`, the save methods with `citation_required` and `quote_not_in_source`); the plan repository's atomic file writes; the passcode server action with a signed cookie; StepEditor, DocumentEditor, FeeEditor, and MetaEditor; UpdatedBanner and the tick rules on `/plan`.
  Verify (mechanical):
  - `npm run typecheck`, `npm run lint`, and `npm run build` pass.
  - `npm test` on `diffPlan` and on the team service refusing a missing citation and a quote not in the source.
  - `npm run check:content` still passes after an edit.
  - In the browser pane:
    - a wrong passcode is refused
    - a save without a citation is refused
    - adding a document shows the plan reload's banner, with the new document unticked and the button locked
    - an existing ticket is unchanged

  Learner check: Open `/team` and enter your passcode. Change "where to get it" on one document and add a test document. Reopen your plan, see the banner, then remove the test document.
  Commit: `Let the team update requirements with citations`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — after slice 2 (your plan plus Magtanong: the kernel)
- [ ] Integrated core journey on real devices — after slice 4 (your phone, the TV, and the counter, through both visits)
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: not started
Route and stops: not started
Edit outcome: not started
Reflection: not started
Activity mode: not started

## Revisions

- Pre-written cited answers replace live AI, and the build runs on the laptop with no deployment. This removes Supabase, Realtime, the Claude API, Vercel, and the in-app scanner; the old slice 5 (Supabase and Vercel) is gone, and the phone-over-Wi-Fi check moved into slice 3. The learner decided at the gut check that the video-only proof of concept needs neither live AI nor deployment. `prd.md`, `scope.md`, and `spec.md` were updated in the same pass.
