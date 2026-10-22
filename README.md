# Pila to Tapos

An independent helper (not an official BIR app) for a former freelancer closing her BIR registration. It shows the whole path, every document, and the cost before she leaves home. Every item cites the official BIR text, and `npm run check:content` verifies each quote word for word.

See `devpost/spec.md` for the full plan.

## Run it (laptop only)

```bash
npm install
npm run dev          # http://localhost:3000
```

Open these in separate tabs (use the browser's device toolbar for the phone view):

- http://localhost:3000, in phone view (`/` then `/plan`)
- http://localhost:3000/counter (staff)
- http://localhost:3000/tv (click "Simulan ang TV" once so it may speak)

In the phone-view tab, tick the checklist, then open `http://localhost:3000/join?c=registration`. It does the same thing as scanning the TV's QR code. The queue lives in the server's memory, so restart the server to start again from B-001.

## Run it with a real phone

1. Find the laptop's Wi-Fi address: `ipconfig getifaddr en0` (or check Wi-Fi settings). The phone must be on the same Wi-Fi; a phone hotspot that the laptop joins always works.
2. Put `NEXT_PUBLIC_APP_URL=http://<that-address>:3000` in `.env.local` (see `.env.example`).
3. Start the server on the network: `npm run dev:lan` (allow macOS's "accept incoming connections" prompt). Open `http://<that-address>:3000/tv` on the laptop.
4. On the phone, open `http://<that-address>:3000`, or scan the TV's QR code with its camera.

## Recording the demo

`npm run demo` builds the app and starts it on the network (`next build && next start -H 0.0.0.0`), which is smoother than dev mode for recording. Set `NEXT_PUBLIC_APP_URL` before running it, since the address is baked in at build time.

How the TV speaks is set by `NEXT_PUBLIC_SPEECH_MODE`: `auto` (the default) uses the browser's Filipino voice if it has one, else the default voice told it is `fil-PH`; `clips` plays recordings from `public/audio/` and falls back to the voice if a clip is missing.

Other scripts: `npm run build`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run check:content`.

## Pages built so far

- `/` Screen 1, `/plan` Your plan (ticks and answers are saved in this browser only)
- `/join` the QR code's target: checks the checklist, issues a number, and opens `/line`
- `/line` her number, the path, and the full-screen "Ikaw na!" when she is called
- `/counter` the staff screen: waiting list, Call next, Done
- `/tv` the waiting-room TV: the current number, the spoken call, and the QR code
- `/tv/voice-check` lists the browser's voices and test-speaks "Numero B-001, Registration counter"

The plan lives in `content/plan/bir-closure.json`; the official excerpts it quotes are in `content/sources/`.
