import { chooseOne, randIntInclusive } from './rng'
import {
  HELD_ITEMS,
  NATURES,
  POWER_ITEM_TO_STAT,
  STAT_KEYS,
  type HeldItem,
  type Nature,
  type StatKey,
} from './constants'

export type ParentBreedingConfig = {
  heldItem: HeldItem
  nature: Nature
  ivs: Record<StatKey, number>
}

export type ShinyOptions = {
  masuda: boolean
  shinyCharm: boolean
  cyiniLuck: boolean
}

export type BreedOutcome = {
  nature: Nature
  ivs: Record<StatKey, number>
  isShiny: boolean
}

export function clampIv(value: number): number {
  if (Number.isNaN(value)) return 0
  return Math.max(0, Math.min(31, Math.floor(value)))
}

export function defaultIVs(): Record<StatKey, number> {
  return {
    hp: 31,
    atk: 31,
    def: 31,
    spatk: 31,
    spdef: 31,
    spe: 31,
  }
}

export function rollNature(p1: ParentBreedingConfig, p2: ParentBreedingConfig): Nature {
  if (p1.heldItem === 'Everstone') return p1.nature
  if (p2.heldItem === 'Everstone') return p2.nature
  return chooseOne(NATURES)
}

function rollRandomIv(): number {
  return randIntInclusive(0, 31)
}

function hasDestinyKnot(item: HeldItem): boolean {
  return item === 'Destiny Knot'
}

function isPowerItem(item: HeldItem): item is Exclude<HeldItem, 'None' | 'Everstone' | 'Destiny Knot'> {
  return item in POWER_ITEM_TO_STAT
}

export function rollIVs(p1: ParentBreedingConfig, p2: ParentBreedingConfig): Record<StatKey, number> {
  const finalIVs: Record<StatKey, number> = {
    hp: 0,
    atk: 0,
    def: 0,
    spatk: 0,
    spdef: 0,
    spe: 0,
  }

  const p1HasKnot = hasDestinyKnot(p1.heldItem)
  const p2HasKnot = hasDestinyKnot(p2.heldItem)

  if (p1HasKnot || p2HasKnot) {
    // Legacy behavior from old project: with a single knot, inherit 5 IVs from that parent;
    // with two knots, inherit 5 IVs from random parents.
    const statNotInherited = chooseOne(STAT_KEYS)

    for (const stat of STAT_KEYS) {
      if (stat === statNotInherited) {
        finalIVs[stat] = rollRandomIv()
        continue
      }

      if (p1HasKnot && p2HasKnot) {
        const fromP1 = randIntInclusive(1, 2) === 1
        finalIVs[stat] = fromP1 ? clampIv(p1.ivs[stat]) : clampIv(p2.ivs[stat])
      } else {
        const knotParent = p1HasKnot ? p1 : p2
        finalIVs[stat] = clampIv(knotParent.ivs[stat])
      }
    }

    return finalIVs
  }

  const inherited = new Set<StatKey>()

  // Power items force inheriting a specific stat
  if (isPowerItem(p1.heldItem)) {
    inherited.add(POWER_ITEM_TO_STAT[p1.heldItem])
  }
  if (isPowerItem(p2.heldItem)) {
    inherited.add(POWER_ITEM_TO_STAT[p2.heldItem])
  }

  while (inherited.size < 3) {
    inherited.add(chooseOne(STAT_KEYS))
  }

  for (const stat of STAT_KEYS) {
    if (inherited.has(stat)) {
      const fromP1 = randIntInclusive(1, 2) === 1
      finalIVs[stat] = fromP1 ? clampIv(p1.ivs[stat]) : clampIv(p2.ivs[stat])
    } else {
      finalIVs[stat] = rollRandomIv()
    }
  }

  return finalIVs
}

export function rollIsShiny(opts: ShinyOptions): boolean {
  let shinyChanceDenom: number

  if (opts.masuda && opts.shinyCharm) {
    shinyChanceDenom = 512
  } else if (opts.masuda) {
    shinyChanceDenom = 683
  } else if (opts.shinyCharm) {
    shinyChanceDenom = 1365
  } else {
    shinyChanceDenom = 4096
  }

  if (opts.cyiniLuck) {
    shinyChanceDenom *= 100
  }

  // Equivalent to old code's check against a magic constant
  return randIntInclusive(0, shinyChanceDenom - 1) === 100
}

export function makeDefaultParentConfig(): ParentBreedingConfig {
  return {
    heldItem: HELD_ITEMS[0],
    nature: NATURES[0],
    ivs: defaultIVs(),
  }
}

export function breedOutcome(p1: ParentBreedingConfig, p2: ParentBreedingConfig, shiny: ShinyOptions): BreedOutcome {
  return {
    nature: rollNature(p1, p2),
    ivs: rollIVs(p1, p2),
    isShiny: rollIsShiny(shiny),
  }
}
