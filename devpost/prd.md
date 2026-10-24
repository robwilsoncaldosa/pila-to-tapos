---
doc: prd
status: approved
---

# Pila to Tapos — Product Requirements

An independent helper for a former freelancer closing her BIR registration. It shows her the whole path before she leaves home (every step, every document, and how much to prepare), then guides her through both visits to the BIR counter, with a number for each.
Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`.

> **Revised during `4-spec` (2026-10-22).** The official source ([research](research/bir-closure-sources.md)) says she deals with one counter, the Registration Officer counter, across two visits about 3 working days apart. The learner chose to follow the real process. This replaced the earlier demo assumption of three windows in one visit. The affected sections are the Core Journey, Screens and Layout, Being Called, Visit 1 Done, the Staff Counter, the TV Display, States, and Product Decisions.
>
> **Language (2026-10-24, before shipping):** the learner added an **English language option**. Filipino/Taglish stays the default, and English is one tap away (an "English | Filipino" switch on Screen 1, the plan, the counter, and the TV, or `?lang=en` in any URL). The reasons: the judges and many users read English, and the English "Heart" voice mispronounces Filipino words. The demo video is recorded with the app in English and fully English narration. The official quotes are unchanged, and the plan's Filipino text has faithful English versions.
>
> **Final review (2026-10-22):** the plan screen was reworked for friendliness (a "what's next" card, "Saan galing?" links, compact situation questions, progress-first "Kulang pa," and a sticky action bar), the COR became a required document (agent default, learner to confirm), and the TV call is now spoken in English in the Kokoro "Heart" voice. The UX rework and the voice were learner decisions.
>
> **Revised again in `5-build` (2026-10-22).** The learner chose pre-written cited answers instead of live AI, and a laptop-only build with no deployment, where the phone scans the QR code with its own camera over Wi-Fi. The affected sections are Asking Questions (Magtanong), Getting a Number, Product Decisions, Deferred, Possible Later Enhancements, and Non-Goals.

## The Core Journey
Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

**At home, the night before (her phone)**
1. **Choose.** She opens Pila to Tapos. Screen 1 asks "Ano'ng kailangan mong gawin?" (What do you need to do?) and offers one choice: "BIR: Close my freelancer registration."
2. **See the plan.** One tap opens "Your plan," a single scrolling screen with a summary, the path, and the document checklist.
3. **Ask.** She taps "Magtanong" (Ask) and picks one of the common questions, or taps the "?" beside a document. The pre-written answer quotes the official source and shows its citation. Closing the panel puts her back where she was.
4. **Tick documents.** She ticks off the documents she has. Each unticked document appears in the "Kulang pa: ___" (still missing) warning, with where to get it and the citation. "Kumuha ng number" (Get my number) stays locked until every document is ticked.

**At BIR (her phone, the staff counter, the TV)**

5. **Get a number (visit 1).** With everything ticked, she scans the QR code on the TV and gets one number, for example B-014. Her phone shows the number big, "Step 1 of 3: Submit, [counter]," her path with the current step highlighted, and "All documents ready ✓."
6. **Called.** At the Registration Officer counter, staff see her number in the waiting list with a "Submit" badge and "Documents ready ✓," and tap "Call next." The TV flashes the counter's panel and says the call out loud in English, in the Heart voice ("Number B, zero, one, four. Registration counter."). At the same moment, her phone goes full-screen: "Ikaw na! [counter]" (It's your turn).
7. **Visit 1 done.** Staff tap "Done." Her phone moves on by itself to "Visit 1 done ✓. Balik ka sa [date] (3 working days). Dalhin: ₱30" (Come back on [date]. Bring ₱30.). Her path highlights step 2, "BIR checks your records (about 3 working days)." The return date skips weekends.
8. **Visit 2.** On the return date she scans the QR code again and gets a new number with a "Pay & claim" badge. Staff call her, and she pays ₱30 and receives her tax clearance at the same counter. For the demo, a clearly labeled "Demo: lumipas ang 3 working days" (Demo: 3 working days have passed) switch jumps straight to visit 2.
9. **Tapos na.** When staff tap "Done" on visit 2, her phone shows "Tapos na!" with the total time across both visits.

**Behind the scenes:** the team keeps the steps, documents, fees, and processing time current on the team edit screen, each with its citation and a "last checked" date. Customers see a change the next time their plan loads.

## Screens and Layout
Source: `scope.md > The POC Boundary`.

| Surface | Used by | Where |
|---|---|---|
| Customer app (her phone) | Her | At home and at the office |
| Staff counter | Staff at the Registration Officer counter | At the counter |
| TV | Everyone waiting | On the wall |
| Team edit screen | The team | A separate link, protected by a passcode |

**Customer app**
- **Screen 1, "Ano'ng kailangan mong gawin?":** one clear choice, "BIR: Close my freelancer registration." Other offices come later.
- **Screen 2, "Your plan":** one scrolling screen, in this order:
  1. Summary: how many steps, how much money to prepare, and roughly how long it takes.
  2. The path: a simple line of three steps, "Visit 1: Submit" → "BIR checks your records (about 3 working days)" → "Visit 2: Pay ₱30 & claim," showing the counter for each visit.
  3. The checklist: every document, each with a tick box and a small "?". When anything is unticked, the "Kulang pa" warning sits at the top of the checklist.
  4. The "Kumuha ng number" button at the bottom.

  A sticky bottom bar holds "Kumuha ng number" and "Magtanong" (revised in final review, so nothing covers the main action).
- **Magtanong panel:** opens over the plan with the list of common questions and their pre-written, cited answers. Closing it returns her to the same place.
- **In line:** her number, her current step and counter, the path with the current step highlighted, and "All documents ready ✓." It shows "Ikaw na!" full-screen when she's called. After visit 1, it shows "Visit 1 done ✓. Balik ka sa [date]" with the labeled demo switch. "Tapos na!" comes at the end of visit 2.

**Staff counter:** the counter's name at the top (one counter: the Registration Officer counter), the waiting list with a visit badge ("Submit" or "Pay & claim") on each row, a big "Call next" button, and, after calling, the current number with "Done."

**TV:** one panel for the Registration Officer counter showing the number being served, and a QR code in the corner.

**Team edit screen:** forms for the transaction's steps, documents, fees, processing time, citations, and "last checked" date.

## Look and Feel
Source: `scope.md > Inspiration & Identity`.

- **Feel:** calm and trustworthy, "like a helpful ate or kuya at the information desk."
- **Not like:** a government website (tiny text, crowded pages, official seals), a bank app, or a generic AI chatbot with purple gradients.
- **Colors:**
  - Background: warm off-white, like a clean paper form.
  - Text: deep navy, because navy reads as trust.
  - Accent: jeepney-signboard yellow, the one accent, used only for "your turn" moments and the number.
  - Green only for "ready ✓." Red-orange only for "Kulang pa."
  - Strong contrast everywhere, so seniors can read it.
- **Lettering:** a sturdy, friendly font made for easy reading, such as Atkinson Hyperlegible (designed for people with low vision). Numbers are big and bold, and 0/O and 1/l can't be confused.
- **References:**
  - A jeepney route signboard: bold and readable from far away. "Step 2 → Window 2" should read like a route.
  - A ticket stub: her number looks like a stub she can trust.
- **TV:** dark background with huge yellow numbers, readable from across the room.
- **Text size:** large and easy to read throughout, for seniors.
- **Language:** Filipino/Taglish labels as written in this document ("Ano'ng kailangan mong gawin?", "Kulang pa," "Kumuha ng number," "Magtanong," "Ikaw na!," "Tapos na!," and so on).
- **Trust cue:** a "not in the source" reply is a plain grey card with an info icon, visibly different from a real answer.
- **Languages:** Filipino/Taglish by default, with an English option that uses the English glosses in this document ("What do you need to do?", "Still missing," "Get my number," "Ask," "It's your turn!," "Come back on [date]," "All done!").
- **One rule:** no government logos or seals. Pila to Tapos is an independent helper, not an official BIR app.

## Features and Behavior

### Choosing the Transaction
Screen 1 offers exactly one choice for the proof of concept. One tap opens Your plan.

- [ ] Opening the app shows "Ano'ng kailangan mong gawin?" with one choice: "BIR: Close my freelancer registration."
- [ ] Tapping that choice opens Your plan.

### Your Plan
Source: `scope.md > The Unique Kernel`, `scope.md > The POC Boundary`.

Everything on this screen comes from the team's data for this transaction, which is drawn from the official source.

- **"What's next" card** (revised in final review, at the learner's request for a friendlier screen): progress ("N sa M dokumento, handa na"), the single next action ("Sagutin ang N tanong sa ibaba" → "I-tick ang N dokumentong kulang" → "Handa ka na! Kumuha ng number sa TV"), how much money to prepare, and roughly how long it takes. When no amount has been entered, it says no official amount is listed, never a guess.
- **"Saan galing?":** one link per section opens that section's exact quotes with official links, instead of a citation chip on every item.
- **Path:** three steps in order: "Visit 1: Submit" at the Registration Officer counter; "BIR checks your records (about 3 working days)," a waiting step that happens behind the scenes; and "Visit 2: Pay ₱30 & claim the tax clearance," at the same counter with a new number.
- **Unfiled-returns warning on the path:** if she answered Oo or Hindi ko alam to "May hindi ka pa na-file na returns?", the waiting step warns her upfront: if BIR finds unfiled returns, she must settle them within 30 days. It also shows the cited "Related" note about the one-time penalty relief program for micro taxpayers, which runs until 31 Dec 2026.
- **Checklist:** every document with a tick box and a "?". The "?" opens the Magtanong panel for that document.
- **Documents that depend on her situation:** each sits under a small heading, "Kung naaangkop sa iyo" (If this applies to you), with one simple question. Example: "May hindi ka pa na-file na returns?" (Do you have unfiled returns?), answered Oo / Hindi / Hindi ko alam (Yes / No / I'm not sure).
  - **Hindi (No):** the document greys out with "Hindi kailangan sa iyo" (Not needed for you) and the cited reason. It doesn't lock anything.
  - **Oo (Yes):** it becomes a normal required document with a tick box and locks "Kumuha ng number" until ticked.
  - **Hindi ko alam (I'm not sure), or no answer yet:** treated as required, so it locks the button, with a "?" nudge to ask Magtanong. An unanswered question is exactly the kind of surprise that wastes a trip.
- **"Kulang pa" warning:** while situation questions are still open, it says "Sagutin muna ang N tanong para makita ang kumpletong listahan." Once they're answered, it names each missing applicable document, where to get it, and its citation.
- **Situation questions** are compact rows with large Oo / Hindi / Hindi ko alam buttons. Answered rows collapse to one line with "Baguhin."
- **Last checked:** "Huling sinuri sa opisyal na source: [date]" (Last checked against the official source: [date]).
- **"Kumuha ng number":** locked until every document is ticked.

- [ ] The summary shows the step count, the amount to prepare, and the approximate time, each traceable to a citation.
- [ ] With no amount entered, the summary says no official amount is listed and shows no number.
- [ ] The path lists the three steps in order, with the counter for each visit and "about 3 working days" on the waiting step.
- [ ] Answering Oo or Hindi ko alam to the unfiled-returns question shows the 30-day warning and the cited relief-program note on the waiting step. Answering Hindi hides them.
- [ ] Every document has a tick box and a "?".
- [ ] With any document unticked, "Kulang pa" names it, says where to get it, and shows its citation, and "Kumuha ng number" is locked.
- [ ] Ticking the last document that applies clears the warning and unlocks "Kumuha ng number."
- [ ] A situation document shows under "Kung naaangkop sa iyo" with its question and Oo / Hindi / Hindi ko alam.
- [ ] Answering Hindi greys the document out with "Hindi kailangan sa iyo" and its cited reason, and it no longer locks the button.
- [ ] Answering Oo turns it into a required document with a tick box that locks the button until ticked.
- [ ] Answering Hindi ko alam, or not answering, keeps the button locked and shows a "?" nudge to Magtanong.
- [ ] The "last checked" date is visible on the plan.

### Asking Questions (Magtanong)
Source: `scope.md > The POC Boundary` (the official source is the only source).

> **Revised in `5-build`:** pre-written answers replace live AI. The learner decided the video-only proof of concept doesn't need free-form questions. Answers are written ahead of time from the official source and always show their citation. The video and write-up call them pre-written answers from the official source, not AI.

- The "Magtanong" button in the bottom bar opens a panel over the plan with a short list of common questions, written in Taglish. Her real question is one of them: "May penalty ba ako sa mga hindi ko na-file na returns bago ako makapag-close?"
- Tapping a question shows its pre-written answer. When the source answers it, the reply uses the normal style, quotes the official text, and shows its citation underneath.
- **When the source doesn't answer the question**, the reply:
  1. Says so plainly, without guessing: "Hindi ito direktang sinasagot ng opisyal na source." (The official source doesn't directly answer this.) It never makes up a penalty amount.
  2. Shows the closest thing the source does say, with its citation, labeled "Related, not a direct answer."
  3. Says who can answer: which desk or office to ask, plus a contact number if the official source lists one.
  4. Appears as a plain grey card with an info icon, so it looks different from a real answer.
  5. Includes the note "Gabay lang ito, hindi legal o tax advice." (This is only a guide, not legal or tax advice.)
- The "?" beside a document opens that document's pre-written explanation (what it is and where to get it), with its citation.
- Closing the panel returns her to the same place in her plan.
- There's no free-text box and no live AI.

- [ ] The panel lists the common questions, including her real penalty question.
- [ ] A question the source answers shows a normal-style reply that quotes the official text, with its citation underneath.
- [ ] Her penalty question shows the grey "not in the source" card with all five parts (including the cited relief-program note) and no amount that isn't in the source.
- [ ] Every quoted passage appears word for word in the official source excerpt it cites.
- [ ] Tapping a document's "?" opens that document's explanation, with its citation.
- [ ] Closing the panel leaves her at the same scroll position in her plan.

### Getting a Number
Source: `scope.md > The POC Boundary` (a number only when the checklist is complete).

- With every document that applies to her ticked, "Kumuha ng number" unlocks. Tapping it shows "I-scan ang QR sa TV gamit ang camera ng phone mo" (Scan the QR on the TV with your phone's camera). She scans the QR code on the TV with her phone's own camera and gets one number (a letter and three digits, such as B-014). *(Revised in `5-build`: the app runs on a laptop over local Wi-Fi, and phones only open the camera inside a website over HTTPS, so the phone's own camera does the scanning.)*
- Someone who scans the TV's QR code before preparing lands on Screen 1, with the button locked until their checklist is done.
- Her phone switches to the In line view: the number big, "Step 1 of 3: Submit, [counter]," the path with the current step highlighted, and "All documents ready ✓."
- Her number joins the end of the counter's waiting list with a "Submit" badge and "Documents ready ✓," meaning every document that applies to her is ticked.
- **Visit 2:** after visit 1 is done, "Kumuha ng number" becomes the visit 2 button. Scanning the QR code again issues a new number with a "Pay & claim" badge. *(Confirmed: before the return date it stays locked and shows "Balik ka sa [date]," unless the demo switch is on.)*

- [ ] With everything that applies ticked, tapping "Kumuha ng number" shows the scan instruction, and scanning the TV's QR code with the phone's camera issues exactly one number and shows the In line view.
- [ ] With anything that applies unticked, no number can be issued.
- [ ] Scanning the TV's QR code without a finished checklist opens Screen 1, with the button locked.
- [ ] The new number appears at the end of the counter's waiting list with "Submit" and "Documents ready ✓."
- [ ] After visit 1, scanning again issues a new number marked "Pay & claim."

### Being Called
- When staff call her number, her phone goes full-screen, "Ikaw na! [counter]," and plays a sound. Sound is turned on through a one-time "Tap to turn on sound alerts" prompt when she gets her number.

- [ ] Tapping "Call next" makes her phone show "Ikaw na! [counter]" full-screen, with a sound if she turned sound alerts on, at the same moment the TV speaks the call.

### Visit 1 Done and Coming Back
Source: `scope.md > The Unique Kernel` (a plan that spans days).

- When staff tap "Done" on visit 1, her phone moves on by itself to "Visit 1 done ✓. Balik ka sa [date] (3 working days). Dalhin: ₱30." Her path highlights step 2.
- The return date is 3 working days after visit 1, skipping Saturdays and Sundays.
- **Demo switch:** a clearly labeled "Demo: lumipas ang 3 working days" switch jumps to visit 2, so the video shows the whole journey in a minute. *(Confirmed: it sits on her phone's "Visit 1 done" screen.)*
- When staff tap "Done" on visit 2, her phone shows "Tapos na!" with the total time across both visits. *(Confirmed: total time means time spent at the office on visit 1 plus visit 2, from getting each number to its "Done.")*

- [ ] Tapping "Done" on visit 1 moves her phone to "Visit 1 done ✓. Balik ka sa [date]. Dalhin: ₱30" without her touching it.
- [ ] Done on a Thursday gives a return date of the following Tuesday (weekends skipped).
- [ ] The demo switch is visibly labeled as a demo and unlocks visit 2 right away.
- [ ] Tapping "Done" on visit 2 shows "Tapos na!" with the total time across both visits.

### Staff Counter
- One counter: the Registration Officer counter, named at the top.
- The waiting list shows the line in order. Each row has the number, the time waiting, a visit badge ("Submit" or "Pay & claim"), and the "Documents ready ✓" badge. No names.
- A big "Call next" button calls the first number in the list. After calling, the screen shows the current number with "Done."
- "Done" finishes that visit: visit 1 moves her phone to "Balik ka sa [date]," and visit 2 moves it to "Tapos na!"

- [ ] The screen shows the counter's waiting list in order, with number, time waiting, visit badge, and "Documents ready ✓," and no names.
- [ ] "Call next" calls the first number in the list and shows it as the current number with "Done."
- [ ] "Done" removes the number from the list and finishes that visit.

### TV Display
- One panel for the Registration Officer counter, showing the number being served.
- When a number is called, the panel flashes and the TV says it out loud in English, in the Heart voice: "Number B, zero, one, four. Registration counter."
- A QR code in the corner lets arriving people join.
- Numbers only, never names. Dark background with huge yellow numbers.

- [ ] The counter's panel shows its current number.
- [ ] "Call next" makes the panel flash and the TV say "Number [letter, digits]. [counter]." in English.
- [ ] The QR code is visible in a corner.
- [ ] No names appear anywhere on the TV.

### Team Edit Screen
Source: `scope.md > The POC Boundary` (editable path data, team edit screen). It's built last. If time runs short, the team edits the data file directly instead.

- Only the team can open it: a separate link that isn't shown anywhere in the customer app, protected by a simple team passcode. No full accounts.
- For the one transaction, the team can change:
  - Steps: name, counter, order, and (for the waiting step) how many working days.
  - Documents: name, where to get it, and whether it's required or depends on her situation (with the one question she answers).
  - Fees and processing time.
  - The citation for every item: which official source it came from and which part.
  - The "last checked" date that customers see.
- **No citation, no save:** the screen won't save an item without its source.
- **What customers see after a change:**
  - Changes show up the next time her plan loads (when she opens or refreshes it), not live.
  - A banner says "Na-update ang requirements" (The requirements were updated) and lists what changed. New or changed items are highlighted.
  - Her ticks stay for documents that didn't change. A new document shows up unticked, which locks "Kumuha ng number" again.
  - If she already has a number, she keeps it. An edit never costs her her place in line.

- [ ] The edit screen opens only with the team passcode, and no link to it appears in the customer app.
- [ ] Saving an item without a citation is refused.
- [ ] After a change is saved, reopening the plan shows the "Na-update ang requirements" banner listing the change, with the changed item highlighted.
- [ ] Adding a new document leaves existing ticks in place, shows the new one unticked, and locks "Kumuha ng number."
- [ ] Someone already in line keeps her number and step after an edit.

## States and Boundaries
- **First use:** nothing is ticked and no situation question is answered. The "what's next" card asks her to answer the questions, "Kulang pa" asks her to answer them first, and "Kumuha ng number" is locked.
- **All ticked:** the warning is gone and "Kumuha ng number" is unlocked.
- **Saved on her phone, no login:** her ticks stay on her phone across closes and reopens until she finishes the transaction or clears them herself.
- **Reopening while in line:** the app checks with the office and shows where she is now. If staff moved her on while the app was closed, she lands on the new step.
- **Offline:** her number and step stay visible with a small banner, "Offline: huling update 10:42" (last updated 10:42). It refreshes by itself when the signal returns.
- **Called while the app was closed or offline:** reopening shows it right away, full-screen: "Tinawag ka na sa [counter]" (You've been called to [counter]).
- **Between visits:** her phone shows "Visit 1 done ✓. Balik ka sa [date]. Dalhin: ₱30," and the path highlights the waiting step. Her ticks stay.
- **Next day:** a number is good for that day only. Visit 2 always gets a new number, and her ticks are still there.
- **No official amount entered:** the summary says no official amount is listed.
- **The source doesn't answer:** the grey "not in the source" card (see Asking Questions).
- **Requirements updated:** the banner, highlights, and tick rules (see Team Edit Screen).
- **Privacy:** numbers only on the TV and the staff counter, never names.
- **Team access:** the edit screen sits behind a separate link and the team passcode.
- **Empty waiting list:** when no one is waiting, the staff list says so, and "Call next" does nothing.

## Product Decisions
- **One transaction: BIR, closing a freelancer's registration.** It's her real story.
- **Path and checklist on one scrolling screen.** She sees the whole journey at once.
- **Questions in a floating panel over the plan.** Asking never makes her lose her place.
- **A "?" on each document,** so she can ask about the exact thing she's unsure of.
- **"Kumuha ng number" locked until everything is ticked.** No number until she's ready.
- **Office features kept to what proves the core idea:** her number and current step, the staff waiting list with the "Documents ready ✓" badge, "Call next" and "Done," the TV's spoken call, the QR code, and "Tapos na!" Everything else waits, to protect the 2–4 hours.
- **First extras if time allows:** the people-ahead count and the next 3 on the TV. Both are small, and only after the core works.
- **"Not in the source" replies never guess.** They show related cited text, say who can answer, and look visibly different, so she can tell how far to trust a reply.
- **No account or login.** Progress is saved on her phone.
- **Edits appear on the next load, not live.**
- **A simple team passcode, no full accounts,** to keep the proof of concept small.
- **No citation, no save,** so the app stays grounded.
- **An edit never costs her her place in line.**
- **Numbers only, never names,** for privacy.
- **No government logos or seals.** It's an independent helper, not an official BIR app.
- **Situation documents ask one simple question.** "Hindi" frees her from the document. "Oo," "Hindi ko alam," or no answer keeps it required, because an unanswered question is exactly the kind of surprise that wastes a trip.
- **"Documents ready ✓" means every document that applies to her is ticked.**
- **Confirmed in review:**
  - Scanning before preparing lands on Screen 1. (The scanner itself was later replaced by the phone's own camera; see the next item.)
  - "Ikaw na!" plays a sound after a one-time prompt.
  - An empty staff list says no one is waiting.
- **Follow the real process: one counter, two visits** (decided in `4-spec`). It keeps the app true to the official source, and showing a plan that spans days is something normal queue apps can't do.
- **The second "oh, that's cool" moment is now "Visit 1 done ✓. Balik ka sa [date]. Dalhin: ₱30,"** replacing "Done moves her to Window 2."
- **"Tapos na!" moves to the end of visit 2.**
- **A clearly labeled demo switch** jumps over the 3 working days, so the video shows the whole journey in a minute.
- **Pre-written answers instead of live AI** (decided in `5-build`). The proof of concept is shown only on video, so free-form questions aren't needed. This removes the API key, the cost, and the riskiest piece of the build, and every answer still quotes the official source with a citation. It's described honestly as pre-written, not AI.
- **No deployment: the app runs on the laptop** (decided in `5-build`). Deployment is optional for the hackathon. A real phone on the same Wi-Fi still joins by scanning the TV's QR code with its own camera.
- **Confirmed in spec review (from the two-visit change):** the demo switch sits on her phone's "Visit 1 done" screen; visit 2 stays locked before the return date unless the demo switch is on; and total time counts time at the office on both visits.

## What We're Building
- Screen 1, with the single BIR transaction.
- Your plan: summary, the three-step path (with the unfiled-returns warning and relief note when they apply), checklist with "?" and the "Kulang pa" warning, situation documents with their Oo / Hindi / Hindi ko alam question, the "last checked" date, and the locked "Kumuha ng number" button.
- The Magtanong panel: a list of common questions with pre-written answers from the official source, each with citations; the grey "not in the source" card; and a "?" explanation for each document.
- Getting a number by scanning the TV's QR code, only when the checklist is complete, plus a new number for visit 2.
- The In line view: number, current step, path, "Ikaw na!" full-screen, "Visit 1 done ✓. Balik ka sa [date]," the labeled demo switch, and "Tapos na!" with the total time across both visits.
- Progress saved on her phone, reopening to the current step, the offline banner, and "Tinawag ka na."
- The staff counter: one counter, waiting list with visit and "Documents ready ✓" badges, "Call next," and "Done."
- The TV: one counter panel, flash and spoken call in English (Heart voice), and the QR code.
- The team edit screen (built last): passcode, edit forms, no citation no save, and the "Na-update ang requirements" behavior on her phone.

## Deferred From the POC
- **"Malapit ka na!" alert when she's 3 away:** reliable alerts with her phone in her pocket are hard, and the idea is proven without them.
- **People-ahead count:** first extra if time allows.
- **Rough wait time:** needs an estimate the proof of concept doesn't need.
- **"Call again" at the counter:** not needed for the demo.
- **No-show and the "Na-skip ka" state:** not needed for the demo.
- **Next 3 in line on the TV:** first extra if time allows.
- **"Save this question" ("Itanong sa Window 1"):** a nice reminder, but not part of the proof.
- **Live updates when the requirements change:** the next load is enough.
- **Full accounts for staff or the team:** a passcode is enough for the proof of concept.
- **Philippine holidays in the return date:** only weekends are skipped for now.
- **Telling her the real outcome of BIR's records check:** BIR contacts her directly by email or phone. The app only warns her upfront.
- **Live AI answers to any typed question** (the original Magtanong idea: Claude grounded in the official source, with citations): replaced by pre-written cited answers, since the proof is shown on video.
- **Deployment and a hosted database:** the app runs on the laptop, and a phone joins over the same Wi-Fi.
- **An in-app camera scanner:** phones block the camera inside a website on a local address, so the phone's own camera scans instead.
- **Editing the common questions and answers on the team screen:** they're edited in the plan data file for now.

## Possible Later Enhancements
- More transactions and offices: civil registry corrections, business tax registration, business and property tax payments, IDs, passports, driver's licenses, clearances, and city hall payments (`scope.md > Later`).
- Designing for the wider user groups: small business owners, seniors, parents, students, and fresh grads (`scope.md > Later`).
- Live AI answers grounded in the official source, with citations: the original Magtanong idea.
- Deploying it so other people can try it on their own phones.

## Non-Goals
- **Not an official BIR app:** no government logos or seals.
- **No answers from beyond the official source, no made-up amounts, and no legal or tax advice:** wrong or unclear information is the problem being solved.
- **No claiming the pre-written answers are AI:** honesty in the video and the write-up.
- **No names on shared screens:** privacy.
- **No connection to BIR's real systems** (their queue, payments, or registration records): the proof of concept simulates the office (`scope.md > Explicitly Cut`).
- **No other transactions or offices in the proof of concept:** one story, proven well.
- **No invented cross-office documents:** a document from another office is highlighted only if the official source lists one (`scope.md > The POC Boundary`).

## Open Questions
Both earlier questions were answered by the `4-spec` research ([devpost/research/bir-closure-sources.md](research/bir-closure-sources.md)). The sources are RMC 47-2026, Citizen's Charter 2026 entry 28-A, and RMC 84-2026 for the relief note. Their steps, documents, fee, and time are now in this PRD and in `spec.md`.

None open. The three two-visit assumptions were confirmed in spec review (2026-10-22).
