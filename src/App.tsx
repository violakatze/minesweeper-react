import { AppProvider } from '@/providers/AppProvider'
import { AppRoutes } from '@/routes/AppRoutes'

export const App = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  )
}
