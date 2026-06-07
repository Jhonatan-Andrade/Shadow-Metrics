export type DeviceStatus = "online" | "warning" | "offline";

export interface ZabbixHost {
  hostid: string;
  name: string;
  interfaces: Array<{
      ip: string;
      available: string;
      error: string;
  }>;
  groups?: Array<{ name: string }>;
}

export interface Device {
  hostid: string;
  name: string;
  ip: string;
  status: DeviceStatus;
  cpu: number;
  memory: number;
  disk: number;
  group: string;
}

export interface TrafficPoint {
  t: string;
  inMbps: number;
  outMbps: number;
}

export interface Traffic {
  entryTraffic: number;
  exitTraffic: number;
  maxEntryTraffic: number;
  maxExitTraffic: number;
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