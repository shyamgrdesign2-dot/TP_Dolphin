import {
  User,
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
