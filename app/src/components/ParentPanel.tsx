import { useState, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { fetchPokemon, fetchSpecies, formatAbilities, formatMoves } from '../api/pokeapi'
import { HELD_ITEMS, NATURES, IV_STATS } from '../lib/constants'
import type { ParentState } from '../lib/types'
import PokemonCombobox from './PokemonCombobox'

const DEFAULT_IVS = Object.fromEntries(IV_STATS.map(s => [s, '31'])) as ParentState['ivs']

const DEFAULT_PARENT: Omit<ParentState, 'name'> = {
  sprite: null,
  abilities: [],
  selectedAbility: '',
  heldItem: 'None',
  nature: 'Hardy',
  moves: [],
  selectedMoves: ['', '', '', ''],
  ivs: { ...DEFAULT_IVS },
  eggGroups: [],
  evoChainUrl: '',
}

interface Props {
  parentId: 1 | 2
  label: string
  accentClass: string
  value: ParentState
  onChange: (state: ParentState) => void
  pokemonNames: string[]
}

export default function ParentPanel({ parentId, label, accentClass, value, onChange, pokemonNames }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = useCallback(async (name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setLoading(true)
    setError(null)
    try {
      const [pkData, spData] = await Promise.all([
        fetchPokemon(trimmed),
        fetchSpecies(trimmed),
      ])
      const abilities = formatAbilities(pkData.abilities)
      const moves = formatMoves(pkData.moves)
      onChange({
        name: trimmed,
        sprite: pkData.sprites.front_default,
        abilities,
        selectedAbility: abilities[0] ?? '',
        heldItem: value.heldItem,
        nature: value.nature,
        moves,
        selectedMoves: [moves[0] ?? '', moves[1] ?? '', moves[2] ?? '', moves[3] ?? ''],
        ivs: { ...value.ivs },
        eggGroups: spData.egg_groups.map(g => g.name),
        evoChainUrl: spData.evolution_chain.url,
      })
    } catch {
      setError('Pokémon not found')
      onChange({
        ...value,
        name: trimmed,
        sprite: null,
        abilities: [],
        selectedAbility: '',
        moves: [],
        selectedMoves: ['', '', '', ''],
        eggGroups: [],
        evoChainUrl: '',
      })
    } finally {
      setLoading(false)
    }
  }, [value, onChange])

  const setField = (field: keyof ParentState, val: unknown) => {
    onChange({ ...value, [field]: val })
  }

  const setIV = (stat: typeof IV_STATS[number], val: string) => {
    onChange({ ...value, ivs: { ...value.ivs, [stat]: val } })
  }

  const setMove = (idx: number, val: string) => {
    const moves = [...value.selectedMoves] as ParentState['selectedMoves']
    moves[idx] = val
    onChange({ ...value, selectedMoves: moves })
  }

  const ivLabels: Record<typeof IV_STATS[number], string> = {
    atk: 'Atk', def: 'Def', spatk: 'Sp Atk', spdef: 'Sp Def', spe: 'Spe', hp: 'HP',
  }

  const pid = parentId

  return (
    <div className={`rounded-2xl p-4 shadow-lg ${accentClass} flex flex-col gap-3 w-[340px]`}>
      <div className="text-lg font-bold text-white/90" id={`panel-heading-${pid}`}>{label}</div>

      {/* Search combobox */}
      <PokemonCombobox
        id={`pk${pid}`}
        label="Pokémon Name"
        value={value.name}
        pokemonNames={pokemonNames}
        loading={loading}
        error={error}
        onCommit={handleSearch}
      />

      {/* Sprite */}
      <div className="flex justify-center items-center h-28 bg-black/20 rounded-xl border border-white/10">
        {loading ? (
          <Loader2 className="animate-spin text-white/60" size={36} aria-label="Loading Pokémon data" />
        ) : value.sprite ? (
          <img src={value.sprite} alt={`${value.name} sprite`} className="w-24 h-24 object-contain" style={{ imageRendering: 'pixelated' }} />
        ) : (
          <span className="text-white/30 text-sm" aria-hidden="true">No Pokémon selected</span>
        )}
      </div>

      {/* Ability */}
      <Row label="Ability" htmlFor={`abil${pid}`}>
        <select
          id={`abil${pid}`}
          className={selectClass}
          value={value.selectedAbility}
          onChange={e => setField('selectedAbility', e.target.value)}
        >
          {value.abilities.length === 0
            ? <option value="">—</option>
            : value.abilities.map(a => <option key={a} value={a}>{a}</option>)
          }
        </select>
      </Row>

      {/* Held Item */}
      <Row label="Held Item" htmlFor={`helditem${pid}`}>
        <select
          id={`helditem${pid}`}
          className={selectClass}
          value={value.heldItem}
          onChange={e => setField('heldItem', e.target.value)}
        >
          {HELD_ITEMS.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </Row>

      {/* Nature */}
      <Row label="Nature" htmlFor={`nature${pid}`}>
        <select
          id={`nature${pid}`}
          className={selectClass}
          value={value.nature}
          onChange={e => setField('nature', e.target.value)}
        >
          {NATURES.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </Row>

      <div className="border-t border-white/10 pt-2 grid grid-cols-2 gap-x-4 gap-y-2">
        {/* Moves */}
        <div className="col-span-2 text-xs text-white/50 uppercase tracking-wider mb-1" aria-hidden="true">Moves</div>
        {([0, 1, 2, 3] as const).map(idx => {
          const moveId = `move${idx + 1}-${pid}`
          return (
            <div key={idx} className="col-span-2 flex flex-col gap-0.5">
              <label htmlFor={moveId} className="sr-only">
                Move {idx + 1} for {label}
              </label>
              <select
                id={moveId}
                aria-label={`Move ${idx + 1}`}
                className={selectClass}
                value={value.selectedMoves[idx]}
                onChange={e => setMove(idx, e.target.value)}
              >
                {value.moves.length === 0
                  ? <option value="">—</option>
                  : value.moves.map(m => <option key={m} value={m}>{m}</option>)
                }
              </select>
            </div>
          )
        })}

        {/* IVs */}
        <div className="col-span-2 text-xs text-white/50 uppercase tracking-wider mt-2 mb-1" aria-hidden="true">IVs</div>
        {IV_STATS.map(stat => {
          const ivId = `iv-${stat}-${pid}`
          return (
            <div key={stat} className="flex items-center gap-2">
              <label htmlFor={ivId} className="text-white/70 text-xs w-12 shrink-0">
                {ivLabels[stat]}
              </label>
              <input
                id={ivId}
                className="w-14 rounded-md bg-white/10 border border-white/20 px-2 py-1 text-white text-xs text-center outline-none focus:border-white/50"
                maxLength={2}
                value={value.ivs[stat]}
                onChange={e => setIV(stat, e.target.value)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Row({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={htmlFor} className="text-white/70 text-xs w-20 shrink-0 cursor-pointer">
        {label}
      </label>
      {children}
    </div>
  )
}

const selectClass =
  'flex-1 w-full rounded-lg bg-[#2a2550] border border-white/20 px-2 py-1.5 text-white text-xs outline-none focus:border-white/50 cursor-pointer'

export { DEFAULT_PARENT, DEFAULT_IVS }
