export default function SelectPill({ label, value, onChange, options }) {
  const selected = options.find((o) => o.value === value) || options[0]

  return (
    <div className="relative flex items-center gap-4 h-9 pl-4 pr-5 rounded-full bg-[#1c2338] hover:bg-[#222a42] transition-colors cursor-pointer">
      <span className="text-[14px] font-medium text-white/85">{label}:</span>
      <span className="flex items-center gap-5 text-[14px] font-semibold text-white">
        {selected.label}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
      {/* Invisible native select on top so the pill sizes to the displayed value but stays fully accessible. */}
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
