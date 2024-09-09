import { Outlet } from 'react-router-dom'
import { Container } from '@mui/material'
import { Header } from './Header'

export const PageLayout = () => {
  return (
    <>
      <Header />
      <Container fixed maxWidth="xl" sx={styles.container}>
        <Outlet />
      </Container>
    </>
  )
}

const styles = {
  container: {
    position: 'relative',
    p: 0,
    mt: 3,
    '@media (min-width: 600px)': {
      p: 0
    }
  }
}
