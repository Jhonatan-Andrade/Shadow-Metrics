import { TopBar } from "../components/TopBar.tsx";
import { Layout } from "./layout.tsx";
  
export default function Devices() {
  return (
    <Layout>
      <TopBar title="Dispositivos" subtitle="12 hosts monitorados" />
    </Layout>
  );
}