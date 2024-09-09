import { useNavigate } from 'react-router-dom'
import { Stack, Typography } from '@mui/material'

export const Logo = () => {
  const navigate = useNavigate()

  return (
    <Stack direction="row" sx={styles.container} onClick={() => navigate('/')}>
      <Typography noWrap variant="h6" component="h1" sx={styles.logotext}>
        minesweeper
      </Typography>
    </Stack>
  )
}

const styles = {
  container: {
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.1)',
      cursor: 'pointer'
    }
  },
  logotext: {
    color: '#000',
    fontSize: '1.6rem'
  }
}
