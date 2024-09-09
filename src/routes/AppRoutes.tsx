import { Routes, Route } from 'react-router-dom'
import { PlayRoutes } from '@/features/play'
import { TopRoutes } from '@/features/top'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="play/*" element={<PlayRoutes />} />
      <Route path="*" element={<TopRoutes />} />
    </Routes>
  )
}
