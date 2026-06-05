import { createRootRoute, createRoute, createRouter, RouterProvider } from '@tanstack/react-router'

import Devices from './routes/devices.tsx';
import Traffic from './routes/traffic.tsx';
import Alerts from './routes/alerts.tsx';
import Dashboard from './routes/dashboard.tsx';
import { ZabbixAPI } from './services/api.zabbix.ts';

const rootRoute = createRootRoute()
const zabbixApi = new ZabbixAPI();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <Dashboard zabbixApi={zabbixApi} /> ,
})
const devicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/devices',
  component: () => <Devices zabbixApi={zabbixApi} /> ,
})
const trafficRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/traffic',
  component: () => <Traffic zabbixApi={zabbixApi} /> ,
})
const alertsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/alerts',
  component: () => <Alerts zabbixApi={zabbixApi} /> ,
})
const routeTree = rootRoute.addChildren([indexRoute, devicesRoute, trafficRoute, alertsRoute ])
const router = createRouter({ routeTree })

export default function App() {
  return <RouterProvider router={router} />
}