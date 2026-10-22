---
doc: scope
status: approved
---

# Pila to Tapos

A BIR queue number that shows you the whole path before you leave home (every step, every document, and how much to prepare), then guides you through every visit until you're done.

> **Revised during `4-spec` (2026-10-22).** The official source says this transaction uses one counter across two visits, about 3 working days apart, not three windows in one visit. The learner chose to follow the real process. The sections below are updated; see `prd.md` for the details.
>
> **Revised in `5-build` (2026-10-22).** Magtanong uses pre-written answers from the official source, with citations, instead of live AI. The app runs on a laptop with no deployment, and the phone joins over Wi-Fi by scanning the QR code with its own camera. The learner decided this because the proof of concept is shown only on video.

## The Unique Kernel
Before she leaves home, she sees the whole path: every step, every document (including any from other offices that this transaction depends on), and how much money to prepare. It all comes from the official BIR source with the citation shown, not from whatever a staff member happens to say that day. Then one queue number carries her along that same path inside the office.

Today's queue only manages the people already standing in the office. This one starts the night before.

## Who It's For
A working individual who used to freelance as a virtual assistant (VA). She needs to close her BIR freelancer registration so she stops owing filings for work she no longer does.

What she does today: takes a day off work, goes to BIR, gets the requirements one at a time and not always correctly, isn't told how much to prepare, and is sent home because a document is missing. She loses a whole day of leave and fares, and still isn't done.

## The Core Loop
1. **Night before (phone):** She picks BIR and the transaction. She taps her real questions (in plain Taglish) and reads pre-written answers that quote the official source, with a citation. She sees the full path (steps, documents, amount to prepare) and ticks off documents. If one is missing, the app tells her what it is and where to get it, before she spends any fare.
2. **At the office:** With everything ticked, she scans the QR code on the TV and gets one number (B-014) that knows her path.
3. **Visit 1:** Staff tap "Call next," the TV says the call out loud in English, in the Heart voice, and her phone shows "You're up." Staff tap "Done," and her phone moves on by itself to "Balik ka sa [date]. Dalhin: ₱30."
4. **Visit 2 and finish:** She comes back, gets a new number, pays ₱30, and claims her tax clearance. Her phone shows "Tapos na!" with the total time.

## Inspiration & Identity
- Plain words and Filipino/Taglish, the way she actually asks: "May penalty ba ako sa mga hindi ko na-file na returns bago ako makapag-close?"
- Spoken calls in English, in a natural voice (Kokoro "Heart": "Number B, zero, one, four. Registration counter.") and a full-screen phone call display, for seniors and anyone who can't read the TV well.
- Trustworthy over clever: every answer shows where it came from.
- Official source: BIR's published requirements for this one transaction (exact pages to be pinned down later).

## Why This Matters to the Learner
Someone they know well lost a whole day of work at BIR and was sent home for missing documents. More broadly: "Instructions are incomplete and unclear, and the requirements are never fully explained upfront," and that costs Filipinos fares, lost income, and leave from work.

## What "Working" Looks Like
A one-minute demo:
1. **At home (phone):** She picks BIR and closing her freelancer registration. She taps her question, "May penalty ba ako sa mga hindi ko na-file na returns bago ako makapag-close?", and sees what the official source says, with the citation shown.
2. **The whole path (phone):** Every step, every document, and how much to prepare. She leaves one document unticked, and the app warns her that it's missing and where to get it.
3. **Arriving (phone + TV):** With everything ticked, she scans the QR code on the TV and gets B-014.
4. **Called (counter + TV + phone, side by side):** Staff tap "Call next." The TV says "Number B, zero, one, four. Registration counter." out loud, and at the same moment her phone flips to "You're up."
5. **Visit 1 done:** Staff tap "Done," and her phone shows "Visit 1 done ✓. Balik ka sa [date] (3 working days). Dalhin: ₱30" by itself.
6. **Visit 2 and done:** A labeled demo switch skips the 3 working days. She gets a new number, is called again, and finishes with "Tapos na!" and the total time.

**The "oh, that's cool" moments:** first, the app catches the missing document at home, with the official citation, before she wastes a trip. Second, a single tap at the counter makes the TV speak, and then her phone tells her exactly when to come back and what to bring.

## The POC Boundary
- **One office, one transaction:** BIR, closing a freelancer's registration.
- **Steps and documents:** whatever the official BIR source actually lists for this transaction. Per the source (RMC 47-2026 and Citizen's Charter 28-A), that means one counter (Registration Officer) and two visits: submit, BIR checks for about 3 working days, then pay ₱30 and claim.
- **The only source** is the official BIR requirements for this transaction. Answers are pre-written from it, and every answer shows its citation.
- **Documents from other offices:** highlighted only if the official source lists one. If it doesn't, that point is dropped.
- **Editable path data:** steps, documents, and amounts are data the team can update when BIR changes the process or an amount becomes known, each with its official citation. Nothing is hardcoded. If no amount has been entered, the app says no official amount is listed instead of guessing.
- **Team edit screen (the fifth screen):** where the team updates that data. It's built last. If time runs short, the team edits the data file directly instead.
- **Checklist with a missing-document warning** that says where to get the document.
- **A number is issued only when the checklist is complete,** via the QR code on the TV.
- **Staff counter:** "Call next" and "Done."
- **TV:** shows who is being served at the counter and speaks each call in English (Heart voice).
- **Phone:** updates live to "You're up," then "Balik ka sa [date]," then (after visit 2) "Tapos na!" with the total time.

## Later
- "Step out" alert: the phone vibrates and beeps when she's 3 away.
- A "people ahead of you" count.
- A "No-show" button on the staff counter.
- More transactions and offices: civil registry corrections, business tax registration, business and property tax payments, IDs, passports, driver's licenses, clearances, and city hall payments.
- Designing for the wider user groups: small business owners, seniors, parents, students, and fresh grads.

## Explicitly Cut
- **Business permit renewal and the barangay clearance example:** that's a city hall transaction. The proof of concept is built on her real BIR story.
- **Inventing a cross-office document for the demo:** cross-office documents appear only if the official source lists one.
- **Answers from anything beyond the official BIR source for this transaction:** wrong or unclear information is the very problem being solved.
- **Live AI answers** (decided in `5-build`): the proof is shown only on video, so pre-written cited answers prove the same kernel with no API key, cost, or risk.
- **Deployment** (decided in `5-build`): optional for the hackathon. The app runs on the laptop, and a phone joins over Wi-Fi.
- **Connecting to BIR's real systems (their queue, payments, or registration records):** the proof of concept simulates the office. Real integration isn't needed to prove the kernel.
