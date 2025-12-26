export function randIntInclusive(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function chooseOne<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}
