import { TopBar } from "../components/TopBar.tsx";
import { Layout } from "./layout.tsx";

export default function Alerts() {
  return (
  <Layout>
    <TopBar title="Alertas e incidentes" subtitle="Triggers ativos do Zabbix" />
  </Layout>);
}