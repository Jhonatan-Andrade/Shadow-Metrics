import { TopBar } from "../components/TopBar.tsx";
import { Layout } from "./layout.tsx";

export default function Dashboard() {
  return (
    <Layout>
      <TopBar title="Visão Geral" subtitle="Pulse da infraestrutura em tempo real" />
    </Layout>
  );
}
