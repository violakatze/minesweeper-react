import { Routes, Route, Navigate } from 'react-router-dom'
import { PageLayout } from '@/components'
import { Page } from './components'

/**
 * メイン画面router
 */
export const PlayRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<Page />} />
        <Route path="*" element={<Navigate to="/play" />} />
      </Route>
    </Routes>
  )
}
