export interface ShinyOptions {
  masuda: boolean
  shinyCharm: boolean
  cyini: boolean
}

export function shinyDenominator(opts: ShinyOptions): number {
  let denom: number
  if (opts.masuda && opts.shinyCharm) {
    denom = 512
  } else if (opts.masuda) {
    denom = 683
  } else if (opts.shinyCharm) {
    denom = 1365
  } else {
    denom = 4096
  }
  if (opts.cyini) denom = denom * 100
  return denom
}

export function rollShiny(opts: ShinyOptions): boolean {
  const denom = shinyDenominator(opts)
  return Math.floor(Math.random() * denom) === 100
}

export interface ShinySimResult {
  isShiny: boolean
  eggsHatched: number
}

export async function shinySimulate(opts: ShinyOptions): Promise<ShinySimResult> {
  let eggsHatched = 0
  while (!rollShiny(opts)) {
    eggsHatched++
    if (eggsHatched % 1000 === 0) {
      await new Promise(r => setTimeout(r, 0))
    }
  }
  return { isShiny: true, eggsHatched }
}
