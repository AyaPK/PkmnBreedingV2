import { Egg } from 'lucide-react'
import type { BreedOptions } from '../lib/types'

interface Props {
  options: BreedOptions
  onChange: (opts: BreedOptions) => void
  onBreed: () => void
  isBreeding: boolean
  canBreed: boolean
}

export default function BreedControls({ options, onChange, onBreed, isBreeding, canBreed }: Props) {
  const set = (key: keyof BreedOptions) => (e: React.ChangeEvent<HTMLInputElement>) =>
    onChange({ ...options, [key]: e.target.checked })

  return (
    <div className="flex flex-col items-center gap-4 py-4">
      <div className="flex gap-8 rounded-2xl border px-8 py-4 shadow" style={{ background: 'rgba(13,42,58,1)', borderColor: 'rgba(42,184,200,0.5)' }}>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#2ab8c8' }}>Extra Options</span>
          <CheckRow label="Masuda Method" checked={options.masuda} onChange={set('masuda')} />
          <CheckRow label="Shiny Charm" checked={options.shinyCharm} onChange={set('shinyCharm')} />
          <CheckRow label="C'yini Luck 🍀" checked={options.cyini} onChange={set('cyini')} />
        </div>
        <div className="w-px bg-white/10" />
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#2ab8c8' }}>Simulations</span>
          <CheckRow label="Simulate Shiny Hunt" checked={options.shinySim} onChange={set('shinySim')} />
          <CheckRow label="Simulate Perfect IVs" checked={options.ivSim} onChange={set('ivSim')} />
        </div>
      </div>

      <button
        onClick={onBreed}
        disabled={!canBreed || isBreeding}
        className="flex items-center gap-2 px-10 py-3 rounded-full text-lg font-bold shadow-lg
          bg-gradient-to-r from-[#e03010] via-[#e8c84a] to-[#2ab8c8] text-white
          hover:from-[#f04020] hover:via-[#f0d45a] hover:to-[#3ac8d8] active:scale-95
          disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
      >
        <Egg size={22} />
        {isBreeding ? 'Breeding…' : 'Breed!'}
      </button>
    </div>
  )
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm text-white/80 hover:text-white transition-colors">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-[#2ab8c8]"
      />
      {label}
    </label>
  )
}
