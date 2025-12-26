import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import { Chip, Divider, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import { useEffect, useMemo, useRef, useState } from 'react'
import ParentInputCard from './ParentInputCard'
import { getPokemonSpeciesByUrl, normalizePokemonName, type Pokemon } from '../../api/pokeapi'

type BreedStatus =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; canBreed: boolean; reason: string }

function canBreedFromEggGroups(groups1: string[], groups2: string[]): { canBreed: boolean; reason: string } {
  const set1 = new Set(groups1)
  const set2 = new Set(groups2)

  if (set1.has('no-eggs') || set2.has('no-eggs')) {
    return { canBreed: false, reason: 'One parent is in the no-eggs group' }
  }
  if (set1.has('ditto') && set2.has('ditto')) {
    return { canBreed: false, reason: 'Ditto cannot breed with Ditto' }
  }
  if (set1.has('ditto') || set2.has('ditto')) {
    return { canBreed: true, reason: 'Ditto can breed with most Pokémon' }
  }

  const sharesGroup = groups1.some((g) => set2.has(g))
  if (!sharesGroup) {
    return { canBreed: false, reason: 'No shared egg group' }
  }

  return { canBreed: true, reason: 'Shared egg group' }
}

export default function BreedingPage() {
  const [p1Input, setP1Input] = useState('')
  const [p2Input, setP2Input] = useState('')
  const [p1Ability, setP1Ability] = useState<string | null>(null)
  const [p2Ability, setP2Ability] = useState<string | null>(null)

  const [p1Pokemon, setP1Pokemon] = useState<Pokemon | null>(null)
  const [p2Pokemon, setP2Pokemon] = useState<Pokemon | null>(null)
  const [prefillKey, setPrefillKey] = useState(0)
  const [breedStatus, setBreedStatus] = useState<BreedStatus>({ kind: 'idle' })

  const abortRef = useRef<AbortController | null>(null)

  const p1Key = useMemo(() => (p1Pokemon ? normalizePokemonName(p1Pokemon.name) : null), [p1Pokemon])
  const p2Key = useMemo(() => (p2Pokemon ? normalizePokemonName(p2Pokemon.name) : null), [p2Pokemon])

  const p1SpeciesUrl = useMemo(() => p1Pokemon?.species.url ?? null, [p1Pokemon])
  const p2SpeciesUrl = useMemo(() => p2Pokemon?.species.url ?? null, [p2Pokemon])

  useEffect(() => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    if (!p1Key || !p2Key || !p1SpeciesUrl || !p2SpeciesUrl) {
      setBreedStatus({ kind: 'idle' })
      return
    }

    setBreedStatus({ kind: 'loading' })

    Promise.all([
      getPokemonSpeciesByUrl(p1SpeciesUrl, controller.signal),
      getPokemonSpeciesByUrl(p2SpeciesUrl, controller.signal),
    ])
      .then(([s1, s2]) => {
        if (controller.signal.aborted) return
        const g1 = s1.egg_groups.map((g) => g.name)
        const g2 = s2.egg_groups.map((g) => g.name)
        const { canBreed, reason } = canBreedFromEggGroups(g1, g2)
        setBreedStatus({ kind: 'ready', canBreed, reason })
      })
      .catch((e) => {
        if (controller.signal.aborted) return
        setBreedStatus({ kind: 'error', message: e instanceof Error ? e.message : 'Failed to load egg groups' })
      })
  }, [p1Key, p2Key, p1SpeciesUrl, p2SpeciesUrl])

  const swapParents = () => {
    const nextP1Input = p2Input
    const nextP2Input = p1Input
    const nextP1Ability = p2Ability
    const nextP2Ability = p1Ability
    const nextP1Pokemon = p2Pokemon
    const nextP2Pokemon = p1Pokemon

    setP1Input(nextP1Input)
    setP2Input(nextP2Input)
    setP1Ability(nextP1Ability)
    setP2Ability(nextP2Ability)
    setP1Pokemon(nextP1Pokemon)
    setP2Pokemon(nextP2Pokemon)
    setPrefillKey((k) => k + 1)
  }

  const statusChip = (() => {
    if (breedStatus.kind === 'idle') {
      return <Chip label="Can breed?" variant="outlined" />
    }
    if (breedStatus.kind === 'loading') {
      return <Chip label="Checking compatibility…" variant="outlined" />
    }
    if (breedStatus.kind === 'error') {
      return <Chip label="Compatibility error" color="warning" variant="outlined" />
    }
    return breedStatus.canBreed ? (
      <Chip label="Can breed" color="success" variant="outlined" />
    ) : (
      <Chip label="Cannot breed" color="error" variant="outlined" />
    )
  })()

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="h6" sx={{ flex: 1 }}>
          Parents
        </Typography>

        <Tooltip title="Swap parents">
          <span>
            <IconButton aria-label="Swap parents" onClick={swapParents}>
              <SwapHorizIcon />
            </IconButton>
          </span>
        </Tooltip>

        {breedStatus.kind === 'ready' ? (
          <Tooltip title={breedStatus.reason}>{statusChip}</Tooltip>
        ) : breedStatus.kind === 'error' ? (
          <Tooltip title={breedStatus.message}>{statusChip}</Tooltip>
        ) : (
          statusChip
        )}
      </Stack>

      <Divider />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ParentInputCard
            title="Parent 1"
            input={p1Input}
            ability={p1Ability}
            onChangeInput={setP1Input}
            onChangeAbility={setP1Ability}
            onLoaded={setP1Pokemon}
            prefillKey={prefillKey}
            prefillPokemon={p1Pokemon}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <ParentInputCard
            title="Parent 2"
            input={p2Input}
            ability={p2Ability}
            onChangeInput={setP2Input}
            onChangeAbility={setP2Ability}
            onLoaded={setP2Pokemon}
            prefillKey={prefillKey}
            prefillPokemon={p2Pokemon}
          />
        </Grid>
      </Grid>
    </Stack>
  )
}
