import type { IVStat } from './constants'

export type IVs = Record<IVStat, string>

export interface ParentState {
  name: string
  sprite: string | null
  abilities: string[]
  selectedAbility: string
  heldItem: string
  nature: string
  moves: string[]
  selectedMoves: [string, string, string, string]
  ivs: IVs
  eggGroups: string[]
  evoChainUrl: string
}

export interface BreedOptions {
  masuda: boolean
  shinyCharm: boolean
  cyini: boolean
  shinySim: boolean
  ivSim: boolean
}

export interface BreedResult {
  species: string
  sprite: string | null
  isShiny: boolean
  nature: string
  ability: string
  moves: [string, string, string, string]
  ivs: IVs
  eggsHatched: number
}
