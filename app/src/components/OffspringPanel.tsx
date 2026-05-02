import { Sparkles } from 'lucide-react'
import { IV_STATS } from '../lib/constants'
import type { BreedResult } from '../lib/types'

interface Props {
  result: BreedResult | null
  incompatible: boolean
}

const ivLabels: Record<typeof IV_STATS[number], string> = {
  atk: 'Atk', def: 'Def', spatk: 'Sp Atk', spdef: 'Sp Def', spe: 'Spe', hp: 'HP',
}

export default function OffspringPanel({ result, incompatible }: Props) {
  if (!result && !incompatible) return null

  return (
    <div className="rounded-2xl p-5 shadow-lg w-full max-w-2xl mx-auto" style={{ background: 'linear-gradient(135deg, rgba(42,184,200,0.12) 0%, rgba(13,42,58,0.8) 100%)', border: '1px solid rgba(42,184,200,0.25)' }}>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-bold" style={{ color: '#e8c84a' }}>
          {incompatible ? 'Incompatible Pair' : (
            <span className="flex items-center gap-2">
              {result?.isShiny && <Sparkles size={18} style={{ color: '#e8c84a' }} className="animate-pulse" />}
              {result?.species
                ? result.species.charAt(0).toUpperCase() + result.species.slice(1)
                : 'Offspring'}
              {result?.isShiny && <span className="text-sm font-normal ml-1" style={{ color: '#e8c84a' }}>✨ Shiny!</span>}
            </span>
          )}
        </h2>
        {result && result.eggsHatched > 0 && (
          <span className="ml-auto text-sm rounded-full px-3 py-0.5" style={{ color: '#2ab8c8', background: 'rgba(42,184,200,0.15)' }}>
            🥚 {result.eggsHatched.toLocaleString()} eggs hatched
          </span>
        )}
        {result && result.eggsHatched === -1 && (
          <span className="ml-auto text-sm text-red-300 bg-red-900/30 rounded-full px-3 py-0.5">
            ⚠️ Cannot reach 6IV with this pair
          </span>
        )}
      </div>

      {incompatible ? (
        <div className="flex flex-col items-center gap-3 py-6 text-white/50">
          <img src="/sadface.png" alt="incompatible" className="w-24 h-24 opacity-60" style={{ imageRendering: 'pixelated' }} />
          <span>These Pokémon cannot breed together.</span>
        </div>
      ) : result ? (
        <div className="flex gap-6">
          {/* Sprite */}
          <div className="flex-shrink-0">
            <div className="w-40 h-40 bg-black/20 rounded-xl border border-white/10 flex items-center justify-center">
              {result.sprite ? (
                <img
                  src={result.sprite}
                  alt={result.species}
                  className="w-36 h-36 object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
              ) : (
                <span className="text-white/20 text-xs">No sprite</span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <InfoRow label="Nature" value={result.nature} />
            <InfoRow label="Ability" value={result.ability} />
            {result.moves.map((m, i) => (
              <InfoRow key={i} label={`Move ${i + 1}`} value={m || '—'} />
            ))}
            <div className="col-span-2 border-t border-white/10 mt-1 pt-2" />
            <div className="col-span-2 text-xs uppercase tracking-wider mb-1" style={{ color: '#2ab8c8' }}>IVs</div>
            {IV_STATS.map(stat => (
              <div key={stat} className="flex items-center gap-2">
                <span className="text-white/50 text-xs w-14">{ivLabels[stat]}</span>
                <span className="font-mono font-bold text-sm" style={{ color: result.ivs[stat] === '31' ? '#e8c84a' : 'rgba(255,255,255,0.8)' }}>
                  {result.ivs[stat]}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-white/50 text-xs w-16 shrink-0">{label}</span>
      <span className="text-white/90 text-sm capitalize truncate">{value}</span>
    </div>
  )
}
