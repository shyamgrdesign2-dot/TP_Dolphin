/* ──────────────────────────────────────────────────────────────────────────
   Mock data for the Tatva Scribe voice-summary POC.
   Models the real flow: an audio pendant captures a doctor's day, the backend
   segments it into per-patient conversation chunks, each tagged with extracted
   identifiers and structured into SOAP clinical notes — pending human review.
   ────────────────────────────────────────────────────────────────────────── */

export const doctor = {
  name: "Dr. Aparna Rao",
  firstName: "Aparna",
  specialty: "Internal Medicine",
  hospital: "Apollo · Ward 3B",
  initials: "AR",
};

export const device = {
  name: "Tatva Pendant",
  model: "TP-Scribe v2",
  status: "listening", // listening | paused | offline
  battery: 78,
  signal: "strong",
  pairedSince: "08:02 AM",
  storage: 0.34, // fraction used
};

export const todayStats = {
  capturedMinutes: 214,
  conversations: 9,
  pendingReview: 6,
  assigned: 3,
};

// Identifier tag types the AI extracts from speech.
export const TAG_META = {
  name: { label: "Name", icon: "User" },
  bed: { label: "Bed", icon: "BedSingle" },
  ward: { label: "Ward", icon: "Building2" },
  mrn: { label: "MRN", icon: "Hash" },
  mobile: { label: "Mobile", icon: "Phone" },
  age: { label: "Age", icon: "Cake" },
  uhid: { label: "UHID", icon: "IdCard" },
};

export const patientDB = [
  { id: "p1", name: "Ramesh Sharma", age: 64, sex: "M", mrn: "MRN-48201", phone: "+91 98200 11234", bed: "3B-14" },
  { id: "p2", name: "Lakshmi Iyer", age: 52, sex: "F", mrn: "MRN-48190", phone: "+91 98330 55621", bed: "3B-09" },
  { id: "p3", name: "Imran Qureshi", age: 47, sex: "M", mrn: "MRN-48233", phone: "+91 90087 33410", bed: "3B-21" },
  { id: "p4", name: "Sunita Deshpande", age: 71, sex: "F", mrn: "MRN-48155", phone: "+91 91450 99820", bed: "3B-02" },
  { id: "p5", name: "Arjun Nair", age: 34, sex: "M", mrn: "MRN-48299", phone: "+91 99404 12000", bed: "3B-17" },
  { id: "p6", name: "Fatima Sheikh", age: 59, sex: "F", mrn: "MRN-48177", phone: "+91 97011 45233", bed: "3B-06" },
  { id: "p7", name: "Vikram Patel", age: 45, sex: "M", mrn: "MRN-48261", phone: "+91 98765 43210", bed: "3B-11" },
  { id: "p8", name: "Meera Krishnan", age: 28, sex: "F", mrn: "MRN-48310", phone: "+91 90000 88776", bed: "OPD" },
];

const soap = (s, o, a, p) => ({ subjective: s, objective: o, assessment: a, plan: p });

export const conversations = [
  {
    id: "c1",
    session: "Morning IPD Round",
    context: "IPD",
    time: "08:14 AM",
    duration: "6m 12s",
    confidence: 0.94,
    status: "unassigned",
    assignedPatientId: null,
    suggestedPatientId: "p1",
    title: "Post-op day 2 — wound review & mobilisation",
    tags: [
      { type: "bed", value: "Bed 3B-14" },
      { type: "name", value: "Mr. R. Sharma" },
      { type: "age", value: "64 yrs" },
      { type: "mrn", value: "MRN-48201" },
    ],
    summary:
      "Post-operative day 2 following laparoscopic cholecystectomy. Patient reports controlled pain (3/10) and tolerated soft diet overnight. Wound clean and dry, no signs of infection. Advised early mobilisation and continued DVT prophylaxis; planning step-down today.",
    soap: soap(
      [
        "Post-op day 2, lap cholecystectomy. Pain 3/10, controlled on oral analgesia.",
        "Tolerated soft diet overnight, passed flatus. No nausea or vomiting.",
        "Slept well, ambulating with assistance.",
      ],
      [
        "Afebrile, T 98.4°F. HR 78, BP 124/80, SpO₂ 98% on room air.",
        "Abdomen soft, port sites clean and dry, no erythema or discharge.",
        "Chest clear bilaterally.",
      ],
      [
        "Satisfactory post-operative recovery, POD-2 lap cholecystectomy.",
        "Low DVT risk, no infective signs.",
      ],
      [
        "Continue oral analgesia, step down IV fluids.",
        "Encourage early ambulation, incentive spirometry.",
        "Continue DVT prophylaxis (enoxaparin 40mg SC OD).",
        "Plan discharge tomorrow if stable; remove dressing on review.",
      ]
    ),
    transcript: [
      { speaker: "Doctor", t: "00:04", text: "Good morning Mr. Sharma, how was the night? Any pain around the cuts?" },
      { speaker: "Patient", t: "00:11", text: "Morning doctor. Pain is much less now, maybe a three. I could sleep." },
      { speaker: "Doctor", t: "00:22", text: "That's good. Did you manage some food? Any nausea?" },
      { speaker: "Patient", t: "00:30", text: "I had the soft khichdi. No vomiting, and I passed gas also." },
      { speaker: "Doctor", t: "00:41", text: "Excellent. Let me see the port sites… clean, dry, no redness. We'll keep the blood thinner injection going and get you walking more today." },
      { speaker: "Doctor", t: "01:03", text: "If everything looks good on rounds tomorrow, we'll plan your discharge." },
    ],
    tasks: [
      { label: "Continue enoxaparin 40mg SC OD", done: false, kind: "med" },
      { label: "Step down IV fluids to oral", done: false, kind: "order" },
      { label: "Physio: assisted ambulation + spirometry", done: false, kind: "referral" },
      { label: "Reassess for discharge tomorrow AM", done: false, kind: "followup" },
    ],
  },
  {
    id: "c2",
    session: "Morning IPD Round",
    context: "IPD",
    time: "08:23 AM",
    duration: "4m 47s",
    confidence: 0.89,
    status: "unassigned",
    assignedPatientId: null,
    suggestedPatientId: "p2",
    title: "CHF follow-up — diuresis & fluid status",
    tags: [
      { type: "bed", value: "Bed 3B-09" },
      { type: "name", value: "Mrs. Lakshmi" },
      { type: "age", value: "52 yrs" },
    ],
    summary:
      "Known heart failure admitted with decompensation. Breathlessness improving on IV diuretics, now able to lie flat. Reduced pedal oedema and 1.8 kg weight loss since admission. Plan to continue diuresis with daily weights and electrolyte monitoring.",
    soap: soap(
      [
        "Breathlessness improving, can now lie flat (was orthopnoeic on admission).",
        "Less leg swelling. Good urine output reported overnight.",
      ],
      [
        "RR 18, SpO₂ 96% RA. JVP mildly raised. Bibasal crackles reducing.",
        "Pedal oedema down to grade 1. Weight 68.2 kg (↓1.8 kg from admission).",
      ],
      ["Decompensated CHF, responding well to IV diuresis.", "Euvolaemia not yet reached."],
      [
        "Continue IV furosemide 40mg BD, reassess in 24h.",
        "Daily weights and strict input/output charting.",
        "Repeat U&E today — watch potassium.",
        "Fluid restriction 1.2L/day.",
      ]
    ),
    transcript: [
      { speaker: "Doctor", t: "00:03", text: "How is the breathing today? Are you able to lie flat now?" },
      { speaker: "Patient", t: "00:09", text: "Yes doctor, much better. Last night I slept with one pillow only." },
      { speaker: "Doctor", t: "00:18", text: "Good, and the swelling in the legs?" },
      { speaker: "Patient", t: "00:24", text: "It has come down. I am also passing more urine." },
      { speaker: "Doctor", t: "00:33", text: "We'll continue the water tablets through the drip and check your salts today." },
    ],
    tasks: [
      { label: "Continue IV furosemide 40mg BD", done: false, kind: "med" },
      { label: "Repeat U&E today (monitor K⁺)", done: false, kind: "lab" },
      { label: "Daily weight + strict I/O chart", done: false, kind: "order" },
    ],
  },
  {
    id: "c3",
    session: "Morning IPD Round",
    context: "IPD",
    time: "08:31 AM",
    duration: "5m 02s",
    confidence: 0.82,
    status: "unassigned",
    assignedPatientId: null,
    suggestedPatientId: "p3",
    title: "Community-acquired pneumonia — day 3 antibiotics",
    tags: [
      { type: "bed", value: "Bed 3B-21" },
      { type: "name", value: "Mr. Imran Q." },
      { type: "age", value: "47 yrs" },
      { type: "mrn", value: "MRN-48233" },
    ],
    summary:
      "Day 3 of IV antibiotics for right lower lobe pneumonia. Fever settling, cough now productive but easing. Oxygen requirement weaned to room air. Plan IV-to-oral switch tomorrow if afebrile, with chest physio continued.",
    soap: soap(
      ["Fever reducing, last spike 18h ago.", "Cough productive, less frequent. Appetite returning."],
      ["T 99.1°F. SpO₂ 95% RA (off oxygen).", "Right base crepitations, reducing. HR 88."],
      ["RLL community-acquired pneumonia, improving on IV co-amoxiclav.", "CURB-65 now low."],
      [
        "Complete 48h afebrile then switch IV→oral co-amoxiclav.",
        "Continue chest physiotherapy.",
        "Repeat CXR before discharge.",
      ]
    ),
    transcript: [
      { speaker: "Doctor", t: "00:05", text: "Has the fever come down? Any chills last night?" },
      { speaker: "Patient", t: "00:12", text: "No fever since yesterday evening. Cough is there but less." },
      { speaker: "Doctor", t: "00:21", text: "Your oxygen is fine without support now. If no fever today, we switch to tablets tomorrow." },
    ],
    tasks: [
      { label: "Switch IV→oral co-amoxiclav if 48h afebrile", done: false, kind: "med" },
      { label: "Continue chest physiotherapy", done: false, kind: "referral" },
      { label: "Repeat CXR pre-discharge", done: false, kind: "order" },
    ],
  },
  {
    id: "c4",
    session: "Morning IPD Round",
    context: "IPD",
    time: "08:39 AM",
    duration: "7m 28s",
    confidence: 0.91,
    status: "assigned",
    assignedPatientId: "p4",
    suggestedPatientId: "p4",
    title: "Diabetic foot — glycaemic control & dressing",
    tags: [
      { type: "bed", value: "Bed 3B-02" },
      { type: "name", value: "Mrs. Sunita D." },
      { type: "age", value: "71 yrs" },
      { type: "uhid", value: "UHID 7741902" },
    ],
    summary:
      "Type 2 diabetic admitted with an infected foot ulcer. Sugars trending down on basal-bolus insulin. Wound granulating with reducing slough after debridement. Continue IV antibiotics per culture; podiatry and vascular review planned.",
    soap: soap(
      ["Less pain at ulcer site. Eating well.", "No fever, no new numbness."],
      [
        "FBS 142, post-lunch 188 mg/dL. T afebrile.",
        "Left plantar ulcer 3×2cm, granulating, slough reducing. Pedal pulses present.",
      ],
      ["Infected diabetic foot ulcer, improving.", "Glycaemia improving on basal-bolus."],
      [
        "Continue IV piptaz per culture sensitivity.",
        "Daily saline dressing, podiatry review.",
        "Titrate insulin per sliding scale; HbA1c sent.",
        "Vascular opinion for run-off assessment.",
      ]
    ),
    transcript: [
      { speaker: "Doctor", t: "00:06", text: "How is the foot feeling today, aunty? Any throbbing?" },
      { speaker: "Patient", t: "00:14", text: "Less pain now doctor. I am able to sleep." },
      { speaker: "Doctor", t: "00:25", text: "Sugars are coming down nicely. We'll keep the dressing daily and ask the foot specialist to see you." },
    ],
    tasks: [
      { label: "Continue IV piperacillin-tazobactam", done: true, kind: "med" },
      { label: "Daily saline dressing", done: false, kind: "order" },
      { label: "Podiatry + vascular review", done: false, kind: "referral" },
      { label: "Send HbA1c", done: true, kind: "lab" },
    ],
  },
  {
    id: "c5",
    session: "Morning IPD Round",
    context: "IPD",
    time: "08:48 AM",
    duration: "3m 55s",
    confidence: 0.76,
    status: "unassigned",
    assignedPatientId: null,
    suggestedPatientId: "p5",
    title: "Renal colic — pain control & imaging",
    tags: [
      { type: "bed", value: "Bed 3B-17" },
      { type: "name", value: "Mr. Arjun N." },
      { type: "age", value: "34 yrs" },
    ],
    summary:
      "Young patient admitted overnight with left renal colic. Pain settled after IM analgesia. Ultrasound shows a 6mm lower-ureteric calculus with mild hydronephrosis. Plan conservative management with alpha-blocker and urology follow-up.",
    soap: soap(
      ["Severe left flank pain on admission, now settled.", "No fever, no dysuria currently."],
      ["Soft abdomen, mild left renal angle tenderness.", "Urinalysis: microscopic haematuria."],
      ["Left lower-ureteric calculus 6mm with mild hydronephrosis.", "Likely to pass spontaneously."],
      [
        "Tamsulosin 0.4mg OD, strain urine.",
        "Adequate hydration and oral analgesia PRN.",
        "Urology OPD follow-up in 1 week; CT KUB if not passed.",
      ]
    ),
    transcript: [
      { speaker: "Doctor", t: "00:04", text: "The pain that brought you in — is it back at all?" },
      { speaker: "Patient", t: "00:10", text: "No doctor, after the injection it went. Just a dull ache now." },
      { speaker: "Doctor", t: "00:19", text: "Scan shows a small stone. We'll give a tablet to help it pass and you'll follow up with urology." },
    ],
    tasks: [
      { label: "Tamsulosin 0.4mg OD", done: false, kind: "med" },
      { label: "Strain urine, collect stone", done: false, kind: "order" },
      { label: "Urology OPD follow-up in 1 week", done: false, kind: "followup" },
    ],
  },
  {
    id: "c6",
    session: "Morning IPD Round",
    context: "IPD",
    time: "08:55 AM",
    duration: "5m 40s",
    confidence: 0.87,
    status: "unassigned",
    assignedPatientId: null,
    suggestedPatientId: "p6",
    title: "COPD exacerbation — nebulisation & steroids",
    tags: [
      { type: "bed", value: "Bed 3B-06" },
      { type: "name", value: "Mrs. Fatima S." },
      { type: "age", value: "59 yrs" },
    ],
    summary:
      "Known COPD admitted with an infective exacerbation. Breathlessness and wheeze improving on nebulisers and oral steroids. Sputum less purulent. Plan to continue steroid taper and step down nebulisation frequency.",
    soap: soap(
      ["Breathing easier, wheeze reducing.", "Sputum lighter in colour, less in volume."],
      ["RR 20, SpO₂ 93% RA. Scattered wheeze, reduced from yesterday.", "No accessory muscle use at rest."],
      ["Infective COPD exacerbation, improving.", "No type-2 respiratory failure."],
      [
        "Continue salbutamol + ipratropium nebs, reduce to 6-hourly.",
        "Prednisolone 40mg OD, plan 5-day course.",
        "Continue oral antibiotics, chest physio.",
      ]
    ),
    transcript: [
      { speaker: "Doctor", t: "00:05", text: "Is the breathing easier than yesterday?" },
      { speaker: "Patient", t: "00:11", text: "Yes, the wheezing is less after the steam." },
      { speaker: "Doctor", t: "00:20", text: "Good. We'll space out the nebs and continue the steroid for a few more days." },
    ],
    tasks: [
      { label: "Salbutamol + ipratropium nebs 6-hourly", done: false, kind: "med" },
      { label: "Prednisolone 40mg OD ×5 days", done: false, kind: "med" },
      { label: "Continue chest physiotherapy", done: false, kind: "referral" },
    ],
  },
  {
    id: "c7",
    session: "Morning IPD Round",
    context: "IPD",
    time: "09:04 AM",
    duration: "4m 18s",
    confidence: 0.85,
    status: "unassigned",
    assignedPatientId: null,
    suggestedPatientId: "p7",
    title: "AKI on sepsis — recovering renal function",
    tags: [
      { type: "bed", value: "Bed 3B-11" },
      { type: "name", value: "Mr. Vikram P." },
      { type: "age", value: "45 yrs" },
      { type: "mrn", value: "MRN-48261" },
    ],
    summary:
      "Acute kidney injury secondary to urosepsis, now recovering. Creatinine trending down with IV fluids and source control. Good urine output restored. Plan to continue antibiotics and recheck renal function daily.",
    soap: soap(
      ["Feeling stronger, appetite returning.", "No fever in last 24h."],
      ["Creatinine 1.6 (↓ from 2.8). Urine output 1.4L/24h.", "Haemodynamically stable, afebrile."],
      ["AKI secondary to urosepsis, recovering.", "Source controlled."],
      [
        "Continue IV antibiotics per culture, day 4 of 7.",
        "Maintain hydration, daily creatinine.",
        "Avoid nephrotoxics; review meds.",
      ]
    ),
    transcript: [
      { speaker: "Doctor", t: "00:04", text: "Your kidney numbers are improving well. How's the energy?" },
      { speaker: "Patient", t: "00:12", text: "Better doctor, I ate properly today." },
      { speaker: "Doctor", t: "00:20", text: "We'll keep the antibiotics going and check the kidney report again tomorrow." },
    ],
    tasks: [
      { label: "Continue IV antibiotics (day 4 of 7)", done: false, kind: "med" },
      { label: "Daily creatinine + U&E", done: false, kind: "lab" },
      { label: "Medication review — stop nephrotoxics", done: true, kind: "order" },
    ],
  },
  {
    id: "c8",
    session: "OPD Clinic",
    context: "OPD",
    time: "11:32 AM",
    duration: "8m 03s",
    confidence: 0.9,
    status: "assigned",
    assignedPatientId: "p8",
    suggestedPatientId: "p8",
    title: "Migraine — prophylaxis discussion",
    tags: [
      { type: "ward", value: "OPD · Rm 4" },
      { type: "name", value: "Ms. Meera K." },
      { type: "age", value: "28 yrs" },
    ],
    summary:
      "Recurrent migraine with increasing frequency (8 days/month). Triggers include sleep deprivation and screen time. Acute relief partial with NSAIDs. Discussed lifestyle measures and starting prophylaxis with propranolol, plus a headache diary.",
    soap: soap(
      ["Migraine 8 days/month, throbbing, photophobia. Partial relief with naproxen.", "Triggers: poor sleep, screens, skipped meals."],
      ["Neuro exam normal. BP 116/74. No red-flag features."],
      ["Episodic migraine, increasing frequency — candidate for prophylaxis."],
      [
        "Start propranolol 20mg BD, review in 6 weeks.",
        "Headache diary, sleep hygiene, regular meals.",
        "Naproxen 500mg PRN for acute attacks (limit 2 days/week).",
      ]
    ),
    transcript: [
      { speaker: "Doctor", t: "00:06", text: "How many days a month are you getting these headaches now?" },
      { speaker: "Patient", t: "00:13", text: "Almost eight or nine, it's affecting my work." },
      { speaker: "Doctor", t: "00:23", text: "Let's start a daily preventive tablet and keep a diary so we can see the pattern." },
    ],
    tasks: [
      { label: "Start propranolol 20mg BD", done: false, kind: "med" },
      { label: "Maintain headache diary", done: false, kind: "order" },
      { label: "Review in 6 weeks", done: false, kind: "followup" },
    ],
  },
  {
    id: "c9",
    session: "OPD Clinic",
    context: "OPD",
    time: "11:48 AM",
    duration: "2m 36s",
    confidence: 0.71,
    status: "unassigned",
    assignedPatientId: null,
    suggestedPatientId: null,
    title: "Brief query — hypertension medication refill",
    tags: [
      { type: "ward", value: "OPD · Rm 4" },
      { type: "name", value: "Mr. S. (partial)" },
      { type: "age", value: "~60 yrs" },
    ],
    summary:
      "Short consult — stable hypertensive requesting a repeat prescription. BP well controlled on amlodipine. No side effects reported. Refilled for 3 months with advice to continue home monitoring.",
    soap: soap(
      ["Stable on amlodipine 5mg OD. No side effects. Requesting refill."],
      ["BP 128/82 today. No ankle swelling."],
      ["Well-controlled essential hypertension."],
      ["Continue amlodipine 5mg OD ×3 months.", "Home BP monitoring; review if readings >140/90."]
    ),
    transcript: [
      { speaker: "Doctor", t: "00:03", text: "Any problems with the BP tablet — swelling in the feet?" },
      { speaker: "Patient", t: "00:09", text: "No doctor, all fine. Just need the prescription again." },
    ],
    tasks: [
      { label: "Continue amlodipine 5mg OD ×3 months", done: false, kind: "med" },
      { label: "Advise home BP monitoring", done: false, kind: "order" },
    ],
  },
];

export const sessions = [
  { id: "s1", name: "Morning IPD Round", context: "IPD", window: "08:14 – 09:08 AM", count: 7 },
  { id: "s2", name: "OPD Clinic", context: "OPD", window: "11:30 AM – 01:15 PM", count: 2 },
];

/* EMR-style structured clinical notes — mirrors the VoiceRx RxPad section model
   (Symptoms · Examinations · Diagnosis · Medication · Advices · Lab · Follow-up).
   Attached to each conversation below as `clinical`. */
const clinicalById = {
  c1: {
    symptoms: [{ name: "Post-operative wound pain", since: "2 days", severity: "Mild (3/10)" }],
    examinations: [
      { name: "Port sites clean & dry, no erythema" },
      { name: "Abdomen soft, non-tender" },
      { name: "Afebrile · HR 78 · BP 124/80 · SpO₂ 98% RA" },
    ],
    diagnosis: [{ name: "Post laparoscopic cholecystectomy — POD 2", since: "2 days" }],
    medication: [
      { name: "Enoxaparin", dose: "40 mg", freq: "SC OD", duration: "3 days" },
      { name: "Paracetamol", dose: "650 mg", freq: "TDS", duration: "3 days" },
    ],
    advice: ["Early ambulation", "Incentive spirometry", "Soft diet, step down IV fluids"],
    lab: [{ name: "CBC (pre-discharge)" }],
    followUp: { when: "Tomorrow AM", note: "Reassess wound & plan discharge" },
  },
  c2: {
    symptoms: [
      { name: "Breathlessness", since: "On admission", severity: "Improving" },
      { name: "Pedal oedema", since: "3 days", severity: "Grade 1" },
    ],
    examinations: [
      { name: "JVP mildly raised" },
      { name: "Bibasal crackles, reducing" },
      { name: "Weight 68.2 kg (↓1.8 kg)" },
    ],
    diagnosis: [{ name: "Decompensated congestive heart failure", since: "—" }],
    medication: [{ name: "Furosemide", dose: "40 mg", freq: "IV BD", duration: "Review 24h" }],
    advice: ["Fluid restriction 1.2 L/day", "Daily weights & strict I/O charting", "Low-salt diet"],
    lab: [{ name: "Serum electrolytes (U&E)" }, { name: "NT-proBNP" }],
    followUp: { when: "24 hours", note: "Reassess fluid status & diuretic response" },
  },
  c3: {
    symptoms: [
      { name: "Productive cough", since: "4 days", severity: "Easing" },
      { name: "Fever", since: "Settling", severity: "Low-grade" },
    ],
    examinations: [
      { name: "Right base crepitations, reducing" },
      { name: "SpO₂ 95% room air, off oxygen" },
    ],
    diagnosis: [{ name: "Right lower lobe community-acquired pneumonia", since: "3 days" }],
    medication: [{ name: "Co-amoxiclav", dose: "1.2 g", freq: "IV TDS → oral", duration: "5–7 days" }],
    advice: ["Chest physiotherapy", "Adequate hydration", "Switch IV→oral after 48h afebrile"],
    lab: [{ name: "Repeat chest X-ray (pre-discharge)" }, { name: "CBC · CRP" }],
    followUp: { when: "Pre-discharge", note: "Confirm radiological improvement" },
  },
  c4: {
    symptoms: [{ name: "Foot ulcer pain", since: "1 week", severity: "Reducing" }],
    examinations: [
      { name: "Left plantar ulcer 3×2 cm, granulating" },
      { name: "Pedal pulses present" },
      { name: "FBS 142 · PPBS 188 mg/dL" },
    ],
    diagnosis: [
      { name: "Infected diabetic foot ulcer", since: "1 week" },
      { name: "Type 2 diabetes mellitus", since: "Known" },
    ],
    medication: [
      { name: "Piperacillin-tazobactam", dose: "4.5 g", freq: "IV TDS", duration: "Per culture" },
      { name: "Insulin (basal-bolus)", dose: "Sliding scale", freq: "—", duration: "Titrate" },
    ],
    advice: ["Daily saline dressing", "Strict glycaemic control", "Offloading footwear"],
    lab: [{ name: "HbA1c" }, { name: "Wound culture & sensitivity" }],
    followUp: { when: "Podiatry + vascular review", note: "Run-off assessment" },
  },
  c5: {
    symptoms: [{ name: "Left flank pain (colicky)", since: "1 day", severity: "Settled" }],
    examinations: [{ name: "Mild left renal angle tenderness" }, { name: "Abdomen soft" }],
    diagnosis: [{ name: "Left lower-ureteric calculus 6 mm with mild hydronephrosis", since: "1 day" }],
    medication: [
      { name: "Tamsulosin", dose: "0.4 mg", freq: "OD", duration: "Until passed" },
      { name: "Diclofenac", dose: "50 mg", freq: "PRN", duration: "—" },
    ],
    advice: ["Increase oral fluids", "Strain urine, collect stone"],
    lab: [{ name: "CT KUB (if not passed)" }, { name: "Serum creatinine" }],
    followUp: { when: "1 week", note: "Urology OPD" },
  },
  c6: {
    symptoms: [
      { name: "Breathlessness", since: "3 days", severity: "Improving" },
      { name: "Wheeze", since: "3 days", severity: "Reducing" },
    ],
    examinations: [{ name: "Scattered wheeze, reduced" }, { name: "RR 20 · SpO₂ 93% RA" }],
    diagnosis: [{ name: "Infective exacerbation of COPD", since: "3 days" }],
    medication: [
      { name: "Salbutamol + Ipratropium neb", dose: "—", freq: "6-hourly", duration: "Review" },
      { name: "Prednisolone", dose: "40 mg", freq: "OD", duration: "5 days" },
    ],
    advice: ["Chest physiotherapy", "Inhaler technique review", "Smoking cessation"],
    lab: [{ name: "Sputum culture" }, { name: "ABG (if deteriorates)" }],
    followUp: { when: "Respiratory OPD", note: "Post-discharge review" },
  },
  c7: {
    symptoms: [{ name: "Fatigue", since: "Improving", severity: "Mild" }],
    examinations: [
      { name: "Haemodynamically stable, afebrile" },
      { name: "Urine output 1.4 L/24h" },
    ],
    diagnosis: [{ name: "AKI secondary to urosepsis — recovering", since: "4 days" }],
    medication: [{ name: "IV antibiotics (per culture)", dose: "—", freq: "—", duration: "Day 4 of 7" }],
    advice: ["Maintain hydration", "Avoid nephrotoxic drugs", "Medication review"],
    lab: [{ name: "Daily serum creatinine & U&E" }, { name: "Urine culture" }],
    followUp: { when: "Daily", note: "Trend renal function" },
  },
  c8: {
    symptoms: [
      { name: "Migraine headache", since: "Recurrent · 8/month", severity: "Moderate" },
      { name: "Photophobia", since: "With episodes", severity: "—" },
    ],
    examinations: [{ name: "Neurological exam normal" }, { name: "BP 116/74 · no red flags" }],
    diagnosis: [{ name: "Episodic migraine, increasing frequency", since: "Recurrent" }],
    medication: [
      { name: "Propranolol", dose: "20 mg", freq: "BD", duration: "Review 6 wks" },
      { name: "Naproxen", dose: "500 mg", freq: "PRN", duration: "Max 2 days/wk" },
    ],
    advice: ["Maintain headache diary", "Sleep hygiene & regular meals", "Limit screen time"],
    lab: [],
    followUp: { when: "6 weeks", note: "Assess prophylaxis response" },
  },
  c9: {
    symptoms: [{ name: "No new complaints", since: "—", severity: "—" }],
    examinations: [{ name: "BP 128/82" }, { name: "No pedal oedema" }],
    diagnosis: [{ name: "Essential hypertension — well controlled", since: "Known" }],
    medication: [{ name: "Amlodipine", dose: "5 mg", freq: "OD", duration: "3 months" }],
    advice: ["Home BP monitoring", "Low-salt diet"],
    lab: [],
    followUp: { when: "If BP >140/90", note: "Review home readings" },
  },
};

conversations.forEach((c) => {
  c.clinical = clinicalById[c.id];
});
