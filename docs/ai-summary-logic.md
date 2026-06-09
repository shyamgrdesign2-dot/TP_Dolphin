# AI Summary — generation logic

> How the 3–5 line summary shown at the top of every conversation is produced.
> In this POC the `summary` strings are pre-written in `src/data/mock.js`; this
> document specifies the logic the backend/LLM should follow to generate them
> for real, so the UI contract (≤5 lines, clinical tone) stays consistent.

## Input

For one **segmented** conversation chunk (already split per-patient by the
backend) we pass the model:

- `transcript` — diarised turns: `[{ speaker: "Doctor" | "Patient", text }]`
- `context` — `IPD` or `OPD`
- `identifiers` — extracted tags (bed/ward, name, age) — used for grounding, **not**
  echoed into the narrative
- `durationSec`, `time`

## Output contract

A single paragraph, **maximum 5 lines (~55–70 words)**, that summarises *what was
actually spoken* — no invented findings, no numbers that weren't said.

Structure the 5 lines as a funnel:

1. **Context line** — who/where/why: setting + reason for the encounter
   (e.g. "Post-operative day 2 review following lap cholecystectomy.").
2. **Status line(s)** — current state / how the patient is doing, in their own
   reported terms ("reports controlled pain, tolerated diet overnight").
3. **Findings line** — only objective things the doctor voiced (exam, vitals).
4. **Plan line** — what the doctor decided / advised / will do next.

If the conversation is short or low-signal (e.g. a refill query), collapse to
1–2 lines rather than padding.

## Tone & connotation rules

This is the part that makes it read like a clinician wrote it, not a chatbot:

- **Third person, present/near-present tense** for current state ("reports",
  "is improving"), **future/intent** for the plan ("plan to", "advised",
  "will reassess").
- **Hedged attribution** — distinguish what the *patient said* ("reports",
  "describes") from what was *observed* ("noted", "examination showed"). Never
  promote a patient-reported symptom to a confirmed finding.
- **No fabrication** — every clinical claim must trace to a transcript turn. If
  a value wasn't spoken, it doesn't appear. Prefer omission over guessing.
- **No identifiers in prose** — name/bed/MRN live in the identifier chips, not
  the summary sentence (privacy + de-duplication).
- **Neutral, non-alarming** — factual register; avoid speculation or severity
  language the doctor didn't use.
- **Uncertainty is explicit** — if diarisation/segmentation confidence is low,
  the wording itself signals it ("brief query regarding…", "appears to be…")
  rather than asserting.

## Suggested prompt (sketch)

```
SYSTEM: You are a clinical scribe. Summarise the following doctor–patient
conversation in at most 5 lines (~60 words). Capture reason for visit, the
patient's reported status, any examination/vitals the doctor stated, and the
plan. Use clinical shorthand and a neutral third-person register. Attribute
patient-reported items with "reports/describes" and observed items with
"noted/examination showed". Do NOT invent any finding, value, or medication
not present in the transcript. Do NOT include patient name, bed, or MRN in the
text. If the exchange is brief, write fewer lines.

USER: context=IPD; duration=6m12s
transcript:
Doctor: Good morning Mr. Sharma, how was the night? Any pain around the cuts?
Patient: Pain is much less now, maybe a three. I could sleep.
...
```

## Why ≤5 lines

The summary is a **scan-and-decide** surface: the doctor reads it to recall the
encounter and decide whether to open the structured notes. Beyond ~5 lines it
stops being a glance and competes with the Clinical-notes tab, which already
holds the full structured detail. The UI hard-clamps to 5 lines
(`line-clamp-5`) so a verbose model can't break the layout — the full detail
always lives in the tabs below.
