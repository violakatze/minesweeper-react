import { useNavigate } from 'react-router-dom'
import { Box, Button } from '@mui/material'

/**
 * トップページ
 */
export const Page = () => {
  const navigate = useNavigate()

  return (
    <>
      <Box>
        <Button variant="contained" color="primary" size="small" onClick={() => navigate('/play')}>
          開始
        </Button>
      </Box>
    </>
  )
}
