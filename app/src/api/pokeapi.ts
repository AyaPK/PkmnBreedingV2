const BASE = 'https://pokeapi.co/api/v2'

export interface PokemonData {
  name: string
  sprites: {
    front_default: string | null
    front_shiny: string | null
  }
  abilities: Array<{
    ability: { name: string }
    is_hidden: boolean
  }>
  moves: Array<{
    move: { name: string }
    version_group_details: Array<{ level_learned_at: number }>
  }>
}

export interface SpeciesData {
  egg_groups: Array<{ name: string }>
  evolution_chain: { url: string }
}

export interface EvolutionChainData {
  chain: {
    species: { name: string }
  }
}

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`PokeAPI error: ${res.status}`)
  return res.json() as Promise<T>
}

export interface NameListData {
  results: Array<{ name: string }>
}

export async function fetchPokemonNameList(): Promise<string[]> {
  const data = await apiFetch<NameListData>(`${BASE}/pokemon?limit=2000`)
  return data.results.map(r => r.name)
}

export async function fetchPokemon(name: string): Promise<PokemonData> {
  return apiFetch<PokemonData>(`${BASE}/pokemon/${name.toLowerCase().trim()}`)
}

const REGIONAL_SUFFIXES = ['-alola', '-galar', '-hisui', '-paldea']

export async function fetchSpecies(name: string): Promise<SpeciesData> {
  const normalized = name.toLowerCase().trim()
  try {
    return await apiFetch<SpeciesData>(`${BASE}/pokemon-species/${normalized}`)
  } catch {
    const suffix = REGIONAL_SUFFIXES.find(s => normalized.endsWith(s))
    if (suffix) {
      const baseName = normalized.slice(0, -suffix.length)
      return apiFetch<SpeciesData>(`${BASE}/pokemon-species/${baseName}`)
    }
    throw new Error(`Species not found: ${normalized}`)
  }
}

export async function fetchEvolutionChain(url: string): Promise<EvolutionChainData> {
  return apiFetch<EvolutionChainData>(url)
}

export function formatAbilities(
  abilities: PokemonData['abilities']
): string[] {
  return abilities.map(a =>
    a.is_hidden ? `${a.ability.name} (h)` : a.ability.name
  )
}

export function formatMoves(moves: PokemonData['moves']): string[] {
  return moves.map(m => m.move.name)
}

export function getBabyMoves(moves: PokemonData['moves']): string[] {
  return moves
    .filter(m => m.version_group_details[0]?.level_learned_at === 1)
    .map(m => m.move.name)
    .slice(0, 4)
}
