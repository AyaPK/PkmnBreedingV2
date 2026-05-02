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
      <div className="flex gap-8 rounded-2xl bg-white/5 border border-white/10 px-8 py-4 shadow">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Extra Options</span>
          <CheckRow label="Masuda Method" checked={options.masuda} onChange={set('masuda')} />
          <CheckRow label="Shiny Charm" checked={options.shinyCharm} onChange={set('shinyCharm')} />
          <CheckRow label="C'yini Luck 🍀" checked={options.cyini} onChange={set('cyini')} />
        </div>
        <div className="w-px bg-white/10" />
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1">Simulations</span>
          <CheckRow label="Simulate Shiny Hunt" checked={options.shinySim} onChange={set('shinySim')} />
          <CheckRow label="Simulate Perfect IVs" checked={options.ivSim} onChange={set('ivSim')} />
        </div>
      </div>

      <button
        onClick={onBreed}
        disabled={!canBreed || isBreeding}
        className="flex items-center gap-2 px-10 py-3 rounded-full text-lg font-bold shadow-lg
          bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900
          hover:from-yellow-300 hover:to-orange-300 active:scale-95
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
        className="w-4 h-4 accent-yellow-400"
      />
      {label}
    </label>
  )
}
