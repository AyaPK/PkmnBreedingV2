import { Chip, Grid, Paper, Stack, Typography } from '@mui/material'
import type { StatKey } from '../../domain/breeding/constants'
import type { BreedOutcome } from '../../domain/breeding/breeding'

export type OutcomeCardProps = {
  babyName: string
  spriteUrl: string | null
  outcome: BreedOutcome
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

const STAT_ORDER: StatKey[] = ['hp', 'atk', 'def', 'spatk', 'spdef', 'spe']

export default function OutcomeCard({ babyName, spriteUrl, outcome }: OutcomeCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Paper
            variant="outlined"
            sx={{
              width: 96,
              height: 96,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              overflow: 'hidden',
              bgcolor: 'background.paper',
            }}
          >
            {spriteUrl ? (
              <img src={spriteUrl} alt={babyName} style={{ width: 96, height: 96, imageRendering: 'pixelated' }} />
            ) : (
              <Typography variant="caption" color="text.secondary">
                No sprite
              </Typography>
            )}
          </Paper>

          <Stack spacing={0.5} sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
              {babyName}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip label={outcome.nature} size="small" variant="outlined" />
              {outcome.isShiny ? <Chip label="Shiny" color="warning" size="small" /> : null}
            </Stack>
          </Stack>
        </Stack>

        <Typography variant="subtitle2" color="text.secondary">
          IVs
        </Typography>

        <Grid container spacing={1}>
          {STAT_ORDER.map((stat) => (
            <Grid key={stat} size={{ xs: 6, sm: 4, md: 2 }}>
              <Paper variant="outlined" sx={{ p: 1, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  {prettyStat(stat)}
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {outcome.ivs[stat]}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Paper>
  )
}
