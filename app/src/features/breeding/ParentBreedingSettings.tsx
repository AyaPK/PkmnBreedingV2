import { Grid, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import { HELD_ITEMS, NATURES, STAT_KEYS, type HeldItem, type Nature, type StatKey } from '../../domain/breeding/constants'
import { clampIv, type ParentBreedingConfig } from '../../domain/breeding/breeding'

export type ParentBreedingSettingsProps = {
  value: ParentBreedingConfig
  onChange: (next: ParentBreedingConfig) => void
}

function prettyStat(stat: StatKey): string {
  switch (stat) {
    case 'hp':
      return 'HP'
    case 'atk':
      return 'Atk'
    case 'def':
      return 'Def'
    case 'spatk':
      return 'Sp Atk'
    case 'spdef':
      return 'Sp Def'
    case 'spe':
      return 'Spe'
  }
}

export default function ParentBreedingSettings({ value, onChange }: ParentBreedingSettingsProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Breeding settings
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Held item"
              select
              fullWidth
              value={value.heldItem}
              onChange={(e) => onChange({ ...value, heldItem: e.target.value as HeldItem })}
            >
              {HELD_ITEMS.map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Nature"
              select
              fullWidth
              value={value.nature}
              onChange={(e) => onChange({ ...value, nature: e.target.value as Nature })}
            >
              {NATURES.map((x) => (
                <MenuItem key={x} value={x}>
                  {x}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Typography variant="subtitle2" color="text.secondary">
          IVs
        </Typography>

        <Grid container spacing={1}>
          {STAT_KEYS.map((stat) => (
            <Grid key={stat} size={{ xs: 6, sm: 4, md: 2 }}>
              <TextField
                label={prettyStat(stat)}
                type="number"
                size="small"
                fullWidth
                inputProps={{ min: 0, max: 31 }}
                value={value.ivs[stat]}
                onChange={(e) => {
                  const raw = Number(e.target.value)
                  onChange({
                    ...value,
                    ivs: {
                      ...value.ivs,
                      [stat]: clampIv(raw),
                    },
                  })
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Paper>
  )
}
