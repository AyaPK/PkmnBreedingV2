export type NamedAPIResource = {
  name: string
  url: string
}

export type PokemonAbility = {
  ability: NamedAPIResource
  is_hidden: boolean
  slot: number
}

export type PokemonSprites = {
  front_default: string | null
  front_shiny: string | null
}

export type PokemonMove = {
  move: NamedAPIResource
}

export type Pokemon = {
  id: number
  name: string
  abilities: PokemonAbility[]
  sprites: PokemonSprites
  moves: PokemonMove[]
  species: NamedAPIResource
}

export type PokemonSpecies = {
  egg_groups: NamedAPIResource[]
  evolution_chain: {
    url: string
  }
}

export type PokemonListResponse = {
  results: Array<{
    name: string
    url: string
  }>
}

export type EvolutionChain = {
  chain: {
    species: NamedAPIResource
  }
}

export function normalizePokemonName(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, '-')
}

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal })
  if (!res.ok) {
    throw new Error(`Request failed (${res.status}) for ${url}`)
  }
  return (await res.json()) as T
}

const API_BASE = 'https://pokeapi.co/api/v2'

const POKEMON_NAME_LIST_CACHE_KEY = 'pokeapi:pokemon-name-list:v1'
let pokemonNameListCache: string[] | null = null
let pokemonNameListPromise: Promise<string[]> | null = null

export async function getPokemon(nameOrId: string, signal?: AbortSignal): Promise<Pokemon> {
  const key = normalizePokemonName(nameOrId)
  return fetchJson<Pokemon>(`${API_BASE}/pokemon/${encodeURIComponent(key)}`, signal)
}

export async function getPokemonSpecies(
  nameOrId: string,
  signal?: AbortSignal,
): Promise<PokemonSpecies> {
  const key = normalizePokemonName(nameOrId)
  return fetchJson<PokemonSpecies>(`${API_BASE}/pokemon-species/${encodeURIComponent(key)}`, signal)
}

export async function getPokemonSpeciesByUrl(url: string, signal?: AbortSignal): Promise<PokemonSpecies> {
  return fetchJson<PokemonSpecies>(url, signal)
}

export async function getEvolutionChainByUrl(url: string, signal?: AbortSignal): Promise<EvolutionChain> {
  return fetchJson<EvolutionChain>(url, signal)
}

export async function getPokemonNameList(signal?: AbortSignal): Promise<string[]> {
  if (pokemonNameListCache) return pokemonNameListCache

  const cachedRaw = localStorage.getItem(POKEMON_NAME_LIST_CACHE_KEY)
  if (cachedRaw) {
    try {
      const parsed = JSON.parse(cachedRaw) as unknown
      if (Array.isArray(parsed) && parsed.every((x) => typeof x === 'string')) {
        pokemonNameListCache = parsed
        return parsed
      }
    } catch {
      // ignore
    }
  }

  if (!pokemonNameListPromise) {
    pokemonNameListPromise = (async () => {
      const data = await fetchJson<PokemonListResponse>(`${API_BASE}/pokemon?limit=100000&offset=0`, signal)
      const names = data.results.map((r) => r.name)
      pokemonNameListCache = names
      try {
        localStorage.setItem(POKEMON_NAME_LIST_CACHE_KEY, JSON.stringify(names))
      } catch {
        // ignore
      }
      return names
    })().finally(() => {
      pokemonNameListPromise = null
    })
  }

  return pokemonNameListPromise
}
