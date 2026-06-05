import { TopBar } from "../components/TopBar.tsx";
import type { ZabbixAPI } from "../services/api.zabbix.ts";
import { Layout } from "./layout.tsx";

export default function Alerts({ zabbixApi }: { zabbixApi: ZabbixAPI }) {
  return (
  <Layout>
    <TopBar title="Alertas e incidentes" subtitle="Triggers ativos do Zabbix" />
  </Layout>);
}