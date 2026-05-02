import { useState } from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { ArrowLeftRight } from 'lucide-react'
import ParentPanel, { DEFAULT_PARENT } from './components/ParentPanel'
import BreedControls from './components/BreedControls'
import OffspringPanel from './components/OffspringPanel'
import { isBreedable } from './lib/breedingLogic'
import { getIVs } from './lib/ivCalc'
import { natureCalc } from './lib/natureCalc'
import { abilityCalc } from './lib/abilityCalc'
import { shinySimulate, rollShiny } from './lib/shinyCalc'
import {
  fetchEvolutionChain,
  fetchPokemon,
  fetchPokemonNameList,
  formatAbilities,
  getBabyMoves,
} from './api/pokeapi'
import type { ParentState, BreedOptions, BreedResult } from './lib/types'

const queryClient = new QueryClient()

const makeDefault = (name = ''): ParentState => ({
  ...DEFAULT_PARENT,
  name,
  ivs: { atk: '31', def: '31', spatk: '31', spdef: '31', hp: '31', spe: '31' },
})

function BreedingApp() {
  const [p1, setP1] = useState<ParentState>(makeDefault())
  const [p2, setP2] = useState<ParentState>(makeDefault())
  const [options, setOptions] = useState<BreedOptions>({
    masuda: false,
    shinyCharm: false,
    cyini: false,
    shinySim: false,
    ivSim: false,
  })
  const [result, setResult] = useState<BreedResult | null>(null)
  const [incompatible, setIncompatible] = useState(false)
  const [isBreeding, setIsBreeding] = useState(false)

  const { data: pokemonNames = [] } = useQuery({
    queryKey: ['pokemon-names'],
    queryFn: fetchPokemonNameList,
    staleTime: Infinity,
  })

  const canBreed = Boolean(p1.evoChainUrl || p1.name) && Boolean(p2.evoChainUrl || p2.name)

  const handleSwap = () => {
    setP1(p2)
    setP2(p1)
    setResult(null)
    setIncompatible(false)
  }

  const handleBreed = async () => {
    if (isBreeding) return
    setIsBreeding(true)
    setResult(null)
    setIncompatible(false)

    try {
      const breedable = isBreedable(p1.eggGroups, p2.eggGroups, p1.name, p2.name)
      if (!breedable) {
        setIncompatible(true)
        setIsBreeding(false)
        return
      }

      // Determine baby species from the female (p2) evo chain, or male (p1) if p2 is Ditto
      const chainUrl = p2.name.toLowerCase() === 'ditto' ? p1.evoChainUrl : p2.evoChainUrl
      const chainData = await fetchEvolutionChain(chainUrl)
      const babyName = chainData.chain.species.name

      // Fetch baby data for sprite + abilities + moves
      const babyData = await fetchPokemon(babyName)
      const babyAbilities = formatAbilities(babyData.abilities)

      // Source parent for ability is female (p2), unless p2 is Ditto → use p1
      const abilitySourceParent = p2.name.toLowerCase() === 'ditto' ? p1 : p2
      const resultAbility = abilityCalc(babyAbilities, abilitySourceParent.selectedAbility)

      // Nature
      const resultNature = natureCalc(p1.nature, p2.nature, p1.heldItem, p2.heldItem)

      // IVs
      const { ivs: resultIVs, eggsHatched: ivEggs } = await getIVs(p1, p2, options.ivSim)

      // Shiny
      let isShiny = false
      let shinyEggs = 0
      if (options.shinySim) {
        const shinyRes = await shinySimulate({
          masuda: options.masuda,
          shinyCharm: options.shinyCharm,
          cyini: options.cyini,
        })
        isShiny = shinyRes.isShiny
        shinyEggs = shinyRes.eggsHatched
      } else {
        isShiny = rollShiny({
          masuda: options.masuda,
          shinyCharm: options.shinyCharm,
          cyini: options.cyini,
        })
      }

      // Moves
      const babyMovesRaw = getBabyMoves(babyData.moves)
      const babyMoves: [string, string, string, string] = [
        babyMovesRaw[0] ?? '',
        babyMovesRaw[1] ?? '',
        babyMovesRaw[2] ?? '',
        babyMovesRaw[3] ?? '',
      ]

      const sprite = isShiny
        ? (babyData.sprites.front_shiny ?? babyData.sprites.front_default)
        : babyData.sprites.front_default

      const eggsHatched = ivEggs === -1 ? -1 : ivEggs + shinyEggs

      setResult({
        species: babyName,
        sprite,
        isShiny,
        nature: resultNature,
        ability: resultAbility,
        moves: babyMoves,
        ivs: resultIVs,
        eggsHatched,
      })
    } catch (err) {
      console.error('Breed error:', err)
    } finally {
      setIsBreeding(false)
    }
  }

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundImage: 'url(/images/bg-dark.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#e8c84a] focus:text-[#0d1b2a] focus:rounded-lg focus:font-bold"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="w-full flex flex-col items-center pt-4 pb-4 px-4" id="app-title">
        <img
          src="/images/header.png"
          alt="Pokémon Breeding Simulator"
          className="max-h-48 w-auto"
        />
        <p className="text-white/40 text-sm mt-2">Powered by PokéAPI</p>
      </header>

      <main id="main-content" aria-labelledby="app-title">

      {/* Parent panels */}
      <div className="flex flex-nowrap justify-center items-start gap-3 px-4 pb-4">
        <ParentPanel
          parentId={1}
          label="♂ Parent 1 (Male)"
          accentClass="bg-gradient-to-br from-[#2ab8c8]/50 to-[#0d2a3a]/100 border border-[#2ab8c8]/50"
          value={p1}
          onChange={setP1}
          pokemonNames={pokemonNames}
        />

        {/* Swap button */}
        <div className="flex items-center justify-center self-center">
          <button
            onClick={handleSwap}
            className="p-3 rounded-full text-white active:scale-95 transition-all hover:scale-110"
            style={{ background: 'rgba(224,48,16,0.15)', border: '1px solid rgba(224,48,16,0.4)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(224,48,16,0.3)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(224,48,16,0.15)')}
            aria-label="Swap parents"
            title="Swap parents"
          >
            <ArrowLeftRight size={20} aria-hidden="true" />
          </button>
        </div>

        <ParentPanel
          parentId={2}
          label="♀ Parent 2 (Female / Ditto)"
          accentClass="bg-gradient-to-br from-[#e8c84a]/40 to-[#0d2a3a]/100 border border-[#e8c84a]/50"
          value={p2}
          onChange={setP2}
          pokemonNames={pokemonNames}
        />
      </div>

      {/* Breed controls */}
      <BreedControls
        options={options}
        onChange={setOptions}
        onBreed={handleBreed}
        isBreeding={isBreeding}
        canBreed={canBreed}
      />

      {/* Output */}
      <div className="px-4 pb-12">
        <OffspringPanel result={result} incompatible={incompatible} />
      </div>

      </main>

      {/* Footer */}
      <footer className="text-center text-white/30 text-xs pb-6 space-y-1">
        <div>Created by AyaPK</div>
        <div>
          <a href="https://pokeapi.co/" className="underline hover:text-white/60">Powered by PokéAPI</a>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BreedingApp />
    </QueryClientProvider>
  )
}
