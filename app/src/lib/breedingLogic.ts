export function isBreedable(
  group1: string[],
  group2: string[],
  pk1Name: string,
  pk2Name: string
): boolean {
  if (group1.includes('no-eggs') || group2.includes('no-eggs')) return false
  if (group1.includes('ditto') && group2.includes('ditto')) return false
  if (pk1Name.toLowerCase() === 'ditto' || pk2Name.toLowerCase() === 'ditto') return true
  return group1.some(g => group2.includes(g))
}
