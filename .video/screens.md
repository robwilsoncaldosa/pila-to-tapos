# Pila to Tapos: verified routes and selectors

These were proven by the `pila-to-tapos-demo` dry run on 2026-10-23.

**Demo instance:** run `npm run build`, then start the `.claude/launch.json` entry `pila-demo`. That runs `next start -p 3105 -H 127.0.0.1` with `PILA_DEMO_RESET=1`.
**Reset:** `curl -fsS -X POST http://localhost:3105/api/demo-reset` empties the in-memory queue. It returns 404 unless `PILA_DEMO_RESET=1`. The recorder's browser starts with empty localStorage, so the phone journey starts fresh.

| Screen | Route | Element | Selector | Notes |
|---|---|---|---|---|
| Screen 1 | `/` | heading | `text=Ano'ng kailangan mong gawin?` | |
| Screen 1 | `/` | transaction card | `text=BIR: Close my freelancer registration` | navigates to `/plan` |
| Plan | `/plan` | title | `text=Ang plano mo` | |
| Plan | `/plan` | what's-next action | `text=Sagutin ang 5 tanong sa ibaba` | becomes `text=Handa ka na! Kumuha ng number sa TV` once everything is ticked |
| Plan | `/plan` | situation answer | `#situation-<docId>-<oo\|hindi\|hindi_ko_alam>` | docIds: `unused-invoices`, `other-permits`, `ending-inventory`, `spa-ids`, `final-returns`; answered rows collapse |
| Plan | `/plan` | document tick | `#tick-<docId>` | `form-1905`, `cor`, plus `final-returns` when answered Oo |
| Plan | `/plan` | missing warning | `text=Kulang pa` | |
| Plan | `/plan` | Magtanong (bottom bar) | `role=button[name="Magtanong"]` | opens the bottom sheet |
| Plan | sheet | penalty question | `text=May penalty ba ako sa mga hindi ko na-file na returns bago ako makapag-close?` | |
| Plan | sheet | grey card heading | `text=Hindi ito direktang sinasagot ng opisyal na source.` | `Escape` closes the sheet |
| Plan | sheet | related label | `text=Related, not a direct answer` | |
| TV | `/tv` | start overlay | `role=button[name="Simulan ang TV"]` | needs a click after every load |
| TV | `/tv` | QR caption | `text=I-scan para kumuha ng number` | QR is the page's `svg` |
| Join | `/join?c=registration` | (no UI) | — | issues a number when the checklist is ready, then goes to `/line` |
| Line | `/line` | ticket stub | `[aria-label="Ang number mo"]` | |
| Line | `/line` | called overlay | `#called-title` | shows on load when the ticket is already called |
| Line | `/line` | come-back card | `text=Balik ka sa` | after visit 1 Done |
| Line | `/line` | demo switch | `#demo-skip` | |
| Line | `/line` | finished | `text=Tapos na!` | |
| Counter | `/counter` | ready row | `text=Documents ready ✓` | |
| Counter | `/counter` | call | `role=button[name="Call next"]` | disabled while a number is called |
| Counter | `/counter` | current | `text=Kasalukuyang number` | |
| Counter | `/counter` | done | `role=button[name="Done"]` | |

**Gotchas:**
- The TV only pulses and speaks for a call made while it's open. A `/tv` loaded after the call just shows the number.
- Recorder audio isn't captured, so the TV's spoken call isn't in the video. The narration describes it.
