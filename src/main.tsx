import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/global.css'
import App from './App.tsx'
import { LanguageProvider } from './context/LanguageContext.tsx'
import { SimulationProvider } from './context/SimulationContext.tsx'
import { ErrorBoundary } from './components/UI/ErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <SimulationProvider>
          <App />
        </SimulationProvider>
      </LanguageProvider>
    </ErrorBoundary>
  </StrictMode>,
)
