import { TopBar } from "../components/TopBar.tsx";
import { Layout } from "./layout.tsx";

export default function Traffic() {
  return (
    <Layout>
      <TopBar title="Tráfego de rede" subtitle="Throughput agregado e por interface" />
    </Layout>
  );
}