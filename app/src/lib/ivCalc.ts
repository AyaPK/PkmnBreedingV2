import { IV_STATS, POWER_ITEM_MAP } from './constants'
import type { IVStat } from './constants'
import type { IVs, ParentState } from './types'

export function ivcalc(p1: ParentState, p2: ParentState): IVs {
  const stats = [...IV_STATS] as IVStat[]
  const mitem = p1.heldItem
  const fitem = p2.heldItem
  const finalIVs: Partial<IVs> = {}

  if (mitem === 'Destiny Knot' || fitem === 'Destiny Knot') {
    const ivNotToInherit = stats[Math.floor(Math.random() * stats.length)]

    if (mitem === 'Destiny Knot' && fitem === 'Destiny Knot') {
      stats.forEach(stat => {
        if (stat === ivNotToInherit) {
          finalIVs[stat] = String(Math.floor(Math.random() * 31) + 1)
        } else {
          const parent = Math.random() < 0.5 ? p1 : p2
          finalIVs[stat] = parent.ivs[stat]
        }
      })
    } else {
      const knotParent = mitem === 'Destiny Knot' ? p1 : p2
      stats.forEach(stat => {
        if (stat === ivNotToInherit) {
          finalIVs[stat] = String(Math.floor(Math.random() * 31) + 1)
        } else {
          finalIVs[stat] = knotParent.ivs[stat]
        }
      })
    }
  } else {
    const ivToInherit: { stat: IVStat; parent: ParentState }[] = []

    if (POWER_ITEM_MAP[mitem]) {
      ivToInherit.push({ stat: POWER_ITEM_MAP[mitem], parent: p1 })
    }
    if (POWER_ITEM_MAP[fitem]) {
      ivToInherit.push({ stat: POWER_ITEM_MAP[fitem], parent: p2 })
    }

    const inheritedStats = new Set(ivToInherit.map(x => x.stat))
    let count = ivToInherit.length

    while (count < 3) {
      const candidate = stats[Math.floor(Math.random() * stats.length)]
      if (!inheritedStats.has(candidate)) {
        const parent = Math.random() < 0.5 ? p1 : p2
        ivToInherit.push({ stat: candidate, parent })
        inheritedStats.add(candidate)
        count++
      }
    }

    stats.forEach(stat => {
      const entry = ivToInherit.find(x => x.stat === stat)
      if (entry) {
        finalIVs[stat] = entry.parent.ivs[stat]
      } else {
        finalIVs[stat] = String(Math.floor(Math.random() * 31) + 1)
      }
    })
  }

  return finalIVs as IVs
}

export interface IVResult {
  ivs: IVs
  eggsHatched: number
}

export async function getIVs(
  p1: ParentState,
  p2: ParentState,
  sim: boolean
): Promise<IVResult> {
  const stats = [...IV_STATS] as IVStat[]

  if (!sim) {
    return { ivs: ivcalc(p1, p2), eggsHatched: 0 }
  }

  const sixivCount = stats.filter(
    stat => p1.ivs[stat] === '31' || p2.ivs[stat] === '31'
  ).length

  if (sixivCount < 3) {
    return { ivs: ivcalc(p1, p2), eggsHatched: -1 }
  }

  let eggsHatched = 0
  let found = false
  let ivs: IVs = ivcalc(p1, p2)

  while (!found) {
    ivs = ivcalc(p1, p2)
    if (stats.every(stat => ivs[stat] === '31')) {
      found = true
    } else {
      eggsHatched++
      if (eggsHatched % 500 === 0) {
        await new Promise(r => setTimeout(r, 0))
      }
    }
  }

  return { ivs, eggsHatched }
}
