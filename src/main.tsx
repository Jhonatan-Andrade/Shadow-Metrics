import { GlobalStyle } from './styles/global.ts';
import { ThemeContextProvider } from './contexts/ThemeContext.tsx';
import { StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeContextProvider>
      <GlobalStyle/>
      <App/>
    </ThemeContextProvider>
  </StrictMode>,
)
