import { NATURES } from './constants'

export function natureCalc(
  p1Nature: string,
  p2Nature: string,
  p1Item: string,
  p2Item: string
): string {
  if (p1Item === 'Everstone') return p1Nature
  if (p2Item === 'Everstone') return p2Nature
  return NATURES[Math.floor(Math.random() * NATURES.length)]
}
