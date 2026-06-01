# Tatva Scribe — Voice Summary (Mobile POC)

A mobile web app for the doctor-worn audio pendant flow: the device captures a
doctor's day, the backend segments it into **per-patient conversation chunks**,
and the doctor reviews each chunk — assigning it to a real patient
(human-in-the-loop) before pushing structured clinical notes to their RxPad.

Built on the **TatvaPractice design system** (tokens ported from `VoiceRx-L`),
light mode, AI-forward aesthetic.

## Stack

- Vite + React 19
- Tailwind v4 (TP tokens exposed via `@theme` in `src/index.css`)
- Framer Motion (transitions, waveform, sheets)
- React Router 7
- lucide-react icons

## Run

```bash
npm install
npm run dev   # http://localhost:5180
```

Open in a mobile viewport (375×812) or use a desktop browser — the app renders
inside a centered phone frame on larger screens.

## Structure

```
src/
  data/mock.js              # device, today's IPD round (7 patients) + OPD, patient DB
  store/store.jsx           # in-memory state: assignment, task toggles, device status
  pages/
    Home.jsx                # live device hero + waveform, today stats, sessions, latest
    Conversations.jsx       # captures list — search, filter chips, session grouping
    ConversationDetail.jsx  # title, identifiers, assign bar, Summary/Transcript/Tasks tabs
    Settings.jsx            # profile, device, capture & AI prefs, privacy
  components/
    ui/                     # BorderBeam, ShinyText, NumberTicker, Waveform, Sheet, Toast, backgrounds
    layout/BottomNav.jsx
    home/DeviceHero.jsx
    conversation/           # ConversationCard, IdentifierTag, AssignBar, SoapNotes, TranscriptView, TasksView
```

## Core flow

1. **Home** — device status (Listening / Paused), live Siri-style waveform, captured-today + counts.
2. **Captures** — AI-segmented conversation cards, each with extracted identifier
   tags (bed / name / MRN / age / mobile…), a short summary, confidence, and
   review status.
3. **Detail** — AI-titled heading, detected identifiers, **Assign to patient**
   (AI-suggested match, pick from DB). Tabs: **Summary** (AI summary + structured
   SOAP notes), **Transcript** (diarised), **Tasks** (extracted action items).
   `Copy to RxPad` unlocks only after a patient is assigned.

> All data is mocked. Assignment, task toggles, and device pause/resume mutate
> in-memory state and reset on reload.
