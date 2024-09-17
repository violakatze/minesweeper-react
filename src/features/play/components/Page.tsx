import { ReactNode } from 'react'
import { Box, Button, Icon, Stack, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import { Bomb } from '@/components/icons'
import { createUUID } from '@/lib/uuid'
import { useMinesweeper } from '../hooks'
import { Cell } from '../types'

/**
 * メインページ
 */
export const Page = () => {
  const { rows, columns, cells, status, bombCount, remainings, onOpen, restart } = useMinesweeper()

  const renderCellValue = (cell: Cell): ReactNode => {
    if (cell.isOpen) {
      if (cell.isBomb) {
        return <Icon component={Bomb} />
      }
      return <Typography alignItems="center">{cell.neighborBombCount}</Typography>
    }
    return (
      <Button
        variant="contained"
        color="primary"
        onClick={() => onOpen(cell.index)}
        sx={{ height: '100%', width: '100%' }}
      >
        &nbsp;
      </Button>
    )
  }

  return (
    <Stack>
      <Stack sx={{ width: '100%', maxWidth: '100%' }}>
        {rows.map(r => (
          <Grid container key={createUUID()}>
            {columns.map(c => (
              <Grid size={12 / columns.length} key={createUUID()}>
                <Box sx={styles.border} key={createUUID()}>
                  {renderCellValue(cells[r * columns.length + c])}
                </Box>
              </Grid>
            ))}
          </Grid>
        ))}
      </Stack>
      <Stack spacing={2} alignItems="center">
        <Typography>残セル：{remainings}</Typography>
        <Typography>爆弾数：{bombCount}</Typography>
        {(status === 'failure' || status === 'success') && (
          <Stack>
            {status}
            <Box>
              <Button variant="contained" color="primary" onClick={restart}>
                もう一回
              </Button>
            </Box>
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

const styles = {
  border: {
    border: 'solid 1px rgba(224, 224, 224, 1)',
    display: 'flex',
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  }
}
