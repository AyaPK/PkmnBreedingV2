export function abilityCalc(
  offspringAbilities: string[],
  parentAbility: string
): string {
  const isHidden = parentAbility.includes('(h)')

  if (isHidden) {
    const seed = Math.floor(Math.random() * 100)
    if (seed < 60) {
      return parentAbility
    } else {
      const nonHidden = offspringAbilities.filter(a => !a.includes('(h)'))
      if (nonHidden.length === 0) return parentAbility
      return nonHidden[Math.floor(Math.random() * nonHidden.length)]
    }
  } else {
    const nonHidden = offspringAbilities.filter(a => !a.includes('(h)'))
    if (nonHidden.length === 0) return offspringAbilities[0] ?? ''
    return nonHidden[Math.floor(Math.random() * nonHidden.length)]
  }
}
