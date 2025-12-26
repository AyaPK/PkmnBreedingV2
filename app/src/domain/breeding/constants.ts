export type StatKey = 'hp' | 'atk' | 'def' | 'spatk' | 'spdef' | 'spe'

export const STAT_KEYS: StatKey[] = ['hp', 'atk', 'def', 'spatk', 'spdef', 'spe']

export type HeldItem =
  | 'None'
  | 'Everstone'
  | 'Destiny Knot'
  | 'Power Weight'
  | 'Power Bracer'
  | 'Power Belt'
  | 'Power Lens'
  | 'Power Band'
  | 'Power Anklet'

export const HELD_ITEMS: HeldItem[] = [
  'None',
  'Everstone',
  'Destiny Knot',
  'Power Weight',
  'Power Bracer',
  'Power Belt',
  'Power Lens',
  'Power Band',
  'Power Anklet',
]

export const POWER_ITEM_TO_STAT: Record<Exclude<HeldItem, 'None' | 'Everstone' | 'Destiny Knot'>, StatKey> = {
  'Power Weight': 'hp',
  'Power Bracer': 'atk',
  'Power Belt': 'def',
  'Power Lens': 'spatk',
  'Power Band': 'spdef',
  'Power Anklet': 'spe',
}

export type Nature =
  | 'Hardy'
  | 'Lonely'
  | 'Brave'
  | 'Adamant'
  | 'Naughty'
  | 'Bold'
  | 'Docile'
  | 'Relaxed'
  | 'Impish'
  | 'Lax'
  | 'Timid'
  | 'Hasty'
  | 'Serious'
  | 'Jolly'
  | 'Naive'
  | 'Modest'
  | 'Mild'
  | 'Quiet'
  | 'Bashful'
  | 'Rash'
  | 'Calm'
  | 'Gentle'
  | 'Sassy'
  | 'Careful'
  | 'Quirky'

export const NATURES: Nature[] = [
  'Hardy',
  'Lonely',
  'Brave',
  'Adamant',
  'Naughty',
  'Bold',
  'Docile',
  'Relaxed',
  'Impish',
  'Lax',
  'Timid',
  'Hasty',
  'Serious',
  'Jolly',
  'Naive',
  'Modest',
  'Mild',
  'Quiet',
  'Bashful',
  'Rash',
  'Calm',
  'Gentle',
  'Sassy',
  'Careful',
  'Quirky',
]
