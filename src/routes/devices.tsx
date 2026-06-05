import { TopBar } from "../components/TopBar.tsx";
import type { ZabbixAPI } from "../services/api.zabbix.ts";
import { Layout } from "./layout.tsx";
  
export default function Devices({ zabbixApi }: { zabbixApi: ZabbixAPI }) {
  return (
    <Layout>
      <TopBar title="Dispositivos" subtitle="12 hosts monitorados" />
    </Layout>
  );
}