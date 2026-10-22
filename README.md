# Pila to Tapos

An independent helper (not an official BIR app) for a former freelancer closing her BIR registration. It shows the whole path, every document, and the cost before she leaves home. Every item cites the official BIR text, and `npm run check:content` verifies each quote word for word.

See `devpost/spec.md` for the full plan.

## Run it (laptop only)

```bash
npm install
npm run dev          # http://localhost:3000
npm run dev:lan      # listen on the network so a phone on the same Wi-Fi can open it
```

Other scripts: `npm run build`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run check:content`.

## Pages built so far

- `/` Screen 1, `/plan` Your plan (ticks and answers are saved in this browser only)
- `/tv/voice-check` lists the browser's voices and test-speaks "Numero B-001, Registration counter"

The plan lives in `content/plan/bir-closure.json`; the official excerpts it quotes are in `content/sources/`.
