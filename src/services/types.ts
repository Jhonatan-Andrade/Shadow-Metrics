export type DeviceStatus = "online" | "warning" | "offline";

export interface ZabbixHost {
  hostid: string;
  name: string;
  interfaces: Array<{
      ip: string;
      available: string;
      error: string;
  }>;
}

export interface Device {
  hostid: string;
  name: string;
  ip: string;
  status: DeviceStatus;
  cpu: number;
  memory: number;
  disk: number;
  latencyMs: number;
  uptimeHours: number;
  lastSeen: string;
}

export interface TrafficPoint {
  t: string;
  inMbps: number;
  outMbps: number;
}

export interface InterfaceTraffic {
  hostid: string;
  hostname: string;
  iface: string;
  inMbps: number;
  outMbps: number;
  errors: number;
}

export type AlertSeverity = "info" | "warning" | "average" | "high" | "disaster";

export interface Alert {
  eventid: string;
  hostname: string;
  description: string;
  severity: AlertSeverity;
  acknowledged: boolean;
  startedAt: string;
  durationMin: number;
}

export interface DashboardSummary {
  totalHosts: number;
  online: number;
  offline: number;
  avgLatencyMs: number;
  avgCpu: number;
  avgMemory: number;
  totalInMbps: number[];
  totalOutMbps: number[];
  activeAlerts: number;
}