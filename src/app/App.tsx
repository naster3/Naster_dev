import { AnimatePresence } from 'framer-motion'
import { AppRouter } from '@/app/router'
import { MainLayout } from '@/widgets/layout'
import { useBootLoader } from './model'
import { BootLoader } from './ui'

function App() {
  const { isLoading, progress, transitionProgress } = useBootLoader()

  return (
    <>
      {!isLoading ? (
        <MainLayout>
          <AppRouter />
        </MainLayout>
      ) : null}

      <AnimatePresence>
        {isLoading ? (
          <BootLoader progress={progress} transitionProgress={transitionProgress} />
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default App
