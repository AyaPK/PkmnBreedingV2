import type { KeyboardEvent } from 'react'
import { useEffect, useMemo, useRef, useState } from 'react'
import RefreshIcon from '@mui/icons-material/Refresh'
import {
  Alert,
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { getPokemon, getPokemonNameList, normalizePokemonName, type Pokemon } from '../../api/pokeapi'

export type ParentInputCardProps = {
  title: string
  input: string
  ability: string | null
  onChangeInput: (value: string) => void
  onChangeAbility: (value: string | null) => void
  onLoaded?: (pokemon: Pokemon | null) => void
  prefillKey?: number
  prefillPokemon?: Pokemon | null
}

function formatAbilityName(name: string): string {
  return name.replace(/-/g, ' ')
}

export default function ParentInputCard({
  title,
  input,
  ability,
  onChangeInput,
  onChangeAbility,
  onLoaded,
  prefillKey,
  prefillPokemon,
}: ParentInputCardProps) {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nameOptions, setNameOptions] = useState<string[]>([])
  const [loadingOptions, setLoadingOptions] = useState(false)

  const abortRef = useRef<AbortController | null>(null)

  const normalized = useMemo(() => normalizePokemonName(input), [input])

  const abilityOptions = useMemo(() => {
    if (!pokemon) return []
    return pokemon.abilities
      .slice()
      .sort((a, b) => a.slot - b.slot)
      .map((a) => ({
        value: a.is_hidden ? `${a.ability.name} (h)` : a.ability.name,
        label: a.is_hidden ? `${formatAbilityName(a.ability.name)} (Hidden)` : formatAbilityName(a.ability.name),
      }))
  }, [pokemon])

  const load = async (nameOverride?: string) => {
    const key = nameOverride ? normalizePokemonName(nameOverride) : normalized
    if (!key) {
      setPokemon(null)
      setError(null)
      onLoaded?.(null)
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)

    try {
      const p = await getPokemon(key, controller.signal)
      setPokemon(p)
      onLoaded?.(p)

      const fetchedAbilityValues = p.abilities
        .slice()
        .sort((a, b) => a.slot - b.slot)
        .map((a) => (a.is_hidden ? `${a.ability.name} (h)` : a.ability.name))

      const firstAbility = fetchedAbilityValues[0] ?? null
      if (!ability || !fetchedAbilityValues.includes(ability)) {
        onChangeAbility(firstAbility)
      }
    } catch (e) {
      if (controller.signal.aborted) return
      setPokemon(null)
      setError(e instanceof Error ? e.message : 'Failed to load Pokémon')
      onChangeAbility(null)
      onLoaded?.(null)
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    setPokemon(null)
    setError(null)
    onChangeAbility(null)
    onLoaded?.(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [normalized])

  useEffect(() => {
    if (prefillKey === undefined) return
    setPokemon(prefillPokemon ?? null)
    setError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillKey])

  useEffect(() => {
    let mounted = true
    setLoadingOptions(true)
    getPokemonNameList()
      .then((names) => {
        if (!mounted) return
        setNameOptions(names)
      })
      .catch(() => {
        if (!mounted) return
        setNameOptions([])
      })
      .finally(() => {
        if (!mounted) return
        setLoadingOptions(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  return (
    <Card variant="outlined">
      <CardHeader
        title={title}
        action={
          <IconButton aria-label="Load" onClick={() => void load()} disabled={!normalized || loading}>
            {loading ? <CircularProgress size={20} /> : <RefreshIcon />}
          </IconButton>
        }
      />
      <CardContent>
        <Stack spacing={2}>
          <Autocomplete
            freeSolo
            options={nameOptions}
            filterOptions={(options, state) => {
              const q = normalizePokemonName(state.inputValue)
              if (!q) return []
              return options.filter((o) => o.startsWith(q)).slice(0, 50)
            }}
            inputValue={input}
            onInputChange={(_, value) => onChangeInput(value)}
            onChange={(_, value) => {
              const next = typeof value === 'string' ? value : value ?? ''
              onChangeInput(next)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Pokémon"
                placeholder="e.g. pikachu"
                onKeyDown={(e: KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    void load()
                  }
                }}
                helperText="Type to search, pick a suggestion, or press Enter"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loadingOptions ? <CircularProgress color="inherit" size={16} /> : null}
                      <InputAdornment position="end">
                        <Typography variant="caption" color="text.secondary">
                          {normalized}
                        </Typography>
                      </InputAdornment>
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          {error ? <Alert severity="error">{error}</Alert> : null}

          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 96,
                height: 96,
                borderRadius: 2,
                border: 1,
                borderColor: 'divider',
                display: 'grid',
                placeItems: 'center',
                overflow: 'hidden',
                bgcolor: 'background.paper',
              }}
            >
              {pokemon?.sprites.front_default ? (
                <img
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  style={{ width: 96, height: 96, imageRendering: 'pixelated' }}
                />
              ) : (
                <Typography variant="caption" color="text.secondary">
                  No sprite
                </Typography>
              )}
            </Box>

            <Stack spacing={1} sx={{ flex: 1 }}>
              <Typography variant="subtitle2" color="text.secondary">
                {pokemon ? `Loaded: ${pokemon.name}` : 'Not loaded'}
              </Typography>

              <FormControl fullWidth size="small" disabled={!pokemon}>
                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                  Ability
                </Typography>
                <Select
                  value={ability ?? ''}
                  onChange={(e) => onChangeAbility(e.target.value ? String(e.target.value) : null)}
                  displayEmpty
                >
                  <MenuItem value="">
                    <em>Select an ability</em>
                  </MenuItem>
                  {abilityOptions.map((o) => (
                    <MenuItem key={o.value} value={o.value}>
                      {o.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}
