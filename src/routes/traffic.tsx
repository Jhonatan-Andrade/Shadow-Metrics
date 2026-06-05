import { TopBar } from "../components/TopBar.tsx";
import type { ZabbixAPI } from "../services/api.zabbix.ts";
import { Layout } from "./layout.tsx";

export default function Traffic({ zabbixApi }: { zabbixApi: ZabbixAPI }) {
  return (
    <Layout>
      <TopBar title="Tráfego de rede" subtitle="Throughput agregado e por interface" />
    </Layout>
  );
}