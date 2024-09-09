import { Navigate, Routes, Route } from 'react-router-dom'
import { PageLayout } from '@/components'
import { Page } from './components'

/**
 * トップ画面router
 */
export const TopRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PageLayout />}>
        <Route index element={<Page />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  )
}
