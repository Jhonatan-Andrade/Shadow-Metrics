import { GlobalStyle } from './styles/global.ts';
import { ThemeContextProvider } from './contexts/ThemeContext.tsx';
import { StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import ErrorPage from "./error-page.tsx";
import Devices from './routes/devices.tsx';
import Traffic from './routes/traffic.tsx';
import Alerts from './routes/alerts.tsx';
import Dashboard from './routes/dashboard.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard/>,
    errorElement: <ErrorPage />,
  },{
    path: "/devices",
    element: <Devices />,
  },{
    path: "/traffic",
    element: <Traffic />,
  },{
    path: "/alerts",
    element: <Alerts />,
  }
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeContextProvider>
      <GlobalStyle/>
      <RouterProvider router={router} />
    </ThemeContextProvider>
  </StrictMode>,
)
