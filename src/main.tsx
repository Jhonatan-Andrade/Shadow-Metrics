import { StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeContextProvider } from './contexts/ThemeContext.tsx';
import App from './App.tsx'
import { GlobalStyle } from './styles/global.ts';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeContextProvider>
      <GlobalStyle/>
      <App/>
    </ThemeContextProvider>
  </StrictMode>,
)
