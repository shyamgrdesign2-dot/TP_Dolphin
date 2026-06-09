import {
  User,
  UserCheck,
  BedDouble,
  Building2,
  Hash,
  Phone,
  Cake,
  Fingerprint,
} from "lucide-react";

const TAG_CONFIG = {
  name: { icon: User, label: "Name" },
  bed: { icon: BedDouble, label: "Bed" },
  ward: { icon: Building2, label: "Ward" },
  mrn: { icon: Hash, label: "MRN" },
  mobile: { icon: Phone, label: "Mobile" },
  age: { icon: Cake, label: "Age" },
  uhid: { icon: Fingerprint, label: "UHID" },
};

export function IdentifierTag({ type, value, size = "md" }) {
  const cfg = TAG_CONFIG[type] || { icon: Hash, label: type };
  const Icon = cfg.icon;
  const sm = size === "sm";
  return (
    <span
      className={`glass-soft inline-flex items-center gap-1.5 rounded-full border border-white/60 font-medium text-slate-600 shadow-[0_1px_2px_rgba(23,23,37,0.04)] ${
        sm ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-[12px]"
      }`}
    >
      <Icon size={sm ? 11 : 13} className="text-slate-400" strokeWidth={2.2} />
      {value}
    </span>
  );
}

/* Primary identity chip — leads the tag row.
   tone: "assigned" (confirmed, green) · "match" (AI-matched, neutral) ·
   "nomatch" (no confident match, amber/warning). */
export function IdentityChip({ name, tone = "match", size = "md" }) {
  const sm = size === "sm";
  const cfg = {
    assigned: {
      cls: "border-success-500/30 bg-success-50 text-success-700",
      Icon: UserCheck,
      iconCls: "text-success-600",
    },
    match: {
      cls: "border-blue-200 bg-blue-50 text-blue-700",
      Icon: User,
      iconCls: "text-blue-500",
    },
    nomatch: {
      cls: "border-warning-500/40 bg-warning-50 text-warning-700",
      Icon: User,
      iconCls: "text-warning-600",
    },
  }[tone];
  const Icon = cfg.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold ${cfg.cls} ${
        sm ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-[12px]"
      }`}
    >
      <Icon size={sm ? 12 : 13} strokeWidth={2.3} className={cfg.iconCls} />
      {name}
    </span>
  );
}

export function TagRow({ tags, size = "md", max }) {
  const shown = max ? tags.slice(0, max) : tags;
  const extra = max ? tags.length - max : 0;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {shown.map((t, i) => (
        <IdentifierTag key={i} type={t.type} value={t.value} size={size} />
      ))}
      {extra > 0 && (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500">
          +{extra}
        </span>
      )}
    </div>
  );
}
