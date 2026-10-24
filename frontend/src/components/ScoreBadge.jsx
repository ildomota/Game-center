// Metacritic's own tiers: 75+ favorable, 50–74 mixed, below 50 unfavorable.
const TIERS = [
  { min: 75, cls: 'text-[#6ee07b] bg-[#6ee07b]/10 ring-[#6ee07b]/30' },
  { min: 50, cls: 'text-[#fdca52] bg-[#fdca52]/10 ring-[#fdca52]/30' },
  { min: 0, cls: 'text-[#ff6b5b] bg-[#ff6b5b]/10 ring-[#ff6b5b]/30' },
]

export default function ScoreBadge({ score }) {
  if (!score) return null
  const tier = TIERS.find((t) => score >= t.min)

  return (
    <span
      title="Metacritic score"
      className={`inline-flex items-center justify-center min-w-[30px] h-[22px] px-1.5 rounded-md ring-1 ring-inset text-[12px] font-semibold tabular-nums leading-none shrink-0 ${tier.cls}`}
    >
      {score}
    </span>
  )
}
