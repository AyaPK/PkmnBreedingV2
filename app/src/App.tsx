import CatchingPokemonIcon from '@mui/icons-material/CatchingPokemon'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import BreedingPage from './features/breeding/BreedingPage'
import './App.css'

function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <Box
        sx={{
          height: { xs: 96, sm: 120 },
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 1,
        }}
      >
        <Box
          component="img"
          src="/images/header.png"
          alt="Pokémon Breeding Simulator"
          sx={{
            height: '120%',
            width: 'auto',
            maxWidth: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </Box>

      <AppBar position="sticky" color="transparent" elevation={0}>
        <Toolbar>
          <CatchingPokemonIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flex: 1 }}>
            Pokémon Breeding Simulator
          </Typography>
          <Button
            color="inherit"
            component="a"
            href="https://pokeapi.co/"
            target="_blank"
            rel="noreferrer"
          >
            Powered by PokeAPI
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }} maxWidth="lg">
        <BreedingPage />
      </Container>
    </Box>
  )
}

export default App
