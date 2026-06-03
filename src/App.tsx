import { createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router'

import Devices from './routes/devices.tsx';
import Traffic from './routes/traffic.tsx';
import Alerts from './routes/alerts.tsx';
import Dashboard from './routes/dashboard.tsx';

const rootRoute = createRootRoute()

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Dashboard/> ,
})
const devicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/devices',
  component: () => <Devices/> ,
})
const trafficRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/traffic',
  component: () => <Traffic/> ,
})
const alertsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/alerts',
  component: () => <Alerts/> ,
})
const routeTree = rootRoute.addChildren([indexRoute, devicesRoute, trafficRoute, alertsRoute ])
const router = createRouter({ routeTree })

export default function App() {
  return <RouterProvider router={router} />
}