export const HELD_ITEMS = [
  'None',
  'Everstone',
  'Destiny Knot',
  'Power Weight',
  'Power Bracer',
  'Power Belt',
  'Power Lens',
  'Power Band',
  'Power Anklet',
] as const

export const NATURES = [
  'Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty',
  'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax',
  'Timid', 'Hasty', 'Serious', 'Jolly', 'Naive',
  'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash',
  'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky',
] as const

export const IV_STATS = ['atk', 'def', 'spatk', 'spdef', 'hp', 'spe'] as const

export const POWER_ITEM_MAP: Record<string, typeof IV_STATS[number]> = {
  'Power Weight': 'hp',
  'Power Bracer': 'atk',
  'Power Belt': 'def',
  'Power Lens': 'spatk',
  'Power Band': 'spdef',
  'Power Anklet': 'spe',
}

export type IVStat = typeof IV_STATS[number]
export type Nature = typeof NATURES[number]
export type HeldItem = typeof HELD_ITEMS[number]
