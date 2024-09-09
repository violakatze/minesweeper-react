import { AppBar, Box, Container, Toolbar } from '@mui/material'
import { Logo } from './Logo'

export const Header = () => {
  return (
    <AppBar position="sticky" sx={styles.appbar}>
      <Container maxWidth="xl" disableGutters>
        <Toolbar disableGutters sx={styles.toolbar}>
          <Box sx={styles.logoBox}>
            <Logo />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

const styles = {
  appbar: {
    background: '#dddddd'
  },
  toolbar: {
    '@media (min-width: 600px)': {
      minHeight: 60
    }
  },
  logoBox: {
    ml: 1,
    display: 'flex',
    flexGrow: 1,
    justifyContent: {
      xs: 'center',
      md: 'normal'
    },
    transform: 'translate3d(0,0,10px)'
  }
}
