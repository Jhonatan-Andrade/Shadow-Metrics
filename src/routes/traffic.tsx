import styled from "styled-components";
import { StatCard } from "../components/StatCard.tsx";
import { TopBar } from "../components/TopBar.tsx";
import type { ZabbixAPI } from "../services/api.zabbix.ts";
import { Layout } from "./layout.tsx";
import { ArrowDownFromLine, ArrowDownIcon, ArrowUp01, ArrowUpAzIcon, ArrowUpFromLine } from "lucide-react";
import TrafficChart from "../components/TrafficChart.tsx";
import { useEffect, useState } from "react";
import type { DashboardSummary, Traffic } from "../services/types.ts";

export default function Traffic({ zabbixApi }: { zabbixApi: ZabbixAPI }) {
  const[summary, setSummary] = useState<DashboardSummary>();
  const[traffic , setTraffic] = useState<Traffic>({
    entryTraffic: 0,
    exitTraffic: 0,
    maxEntryTraffic: 0,
    maxExitTraffic: 0,
})
  
  
  useEffect(() => {
    zabbixApi.getOverview().then((data) => {
      setSummary(data);
    });
    zabbixApi.getTraffic().then((data) => {
      setTraffic(data);
    });
  }, [zabbixApi]);

  const now = Date.now();
  const times = Array.from({ length: 11 }, (_, i) => now - (10 - i) * 6 * 60 * 1000);
  
  
  return (
    <Layout>
      <Main>
        <TopBar title="Tráfego de rede" subtitle="Throughput agregado e por interface" />
        <Header>
          <StatCard label="Entrada agora" value={traffic.entryTraffic} icon={ArrowDownFromLine} unit="Mbps" tone="success"/>
          <StatCard label="Saída agora" value={traffic.exitTraffic} icon={ArrowUpFromLine} unit="Mbps" tone="info"/>
          <StatCard label="Pico Entrada" value={traffic.maxEntryTraffic} icon={ArrowDownFromLine} unit="Mbps"/>
          <StatCard label="Pico Saída" value={traffic.maxExitTraffic} icon={ArrowUpFromLine} unit="Mbps"/>
        </Header>
        <TrafficCard>
          <CardHeader>
            <CardText>
              <CardTitle>Tráfego de rede</CardTitle>
              <CardSubtitle>Últimas 4 horas — agregado dos uplinks</CardSubtitle>
            </CardText>
            <TrafficLegend>
              <LegendItem><StatusDot color="#22c55e" /> Entrada </LegendItem>
              <LegendItem><StatusDot color="#3b82f6" /> Saída </LegendItem>
            </TrafficLegend>
          </CardHeader>
          <TrafficChart 
            times={times} 
            entry={summary?.totalInMbps || new Array(11).fill(0)} 
            exit={summary?.totalOutMbps || new Array(11).fill(0)}
          />
        </TrafficCard>
      </Main>
    </Layout>
  );
}
const Main = styled.main`
  display: flex;
  flex-direction: column;
  width: 100%;
`
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
  width: calc(100% - 2rem);
`
const TrafficCard = styled.div`
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.sidebarBorder};
  padding: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  margin: 1rem;
`;
const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;
const CardText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const CardTitle = styled.h2`
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
`;
const CardSubtitle = styled.p`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
`;
const TrafficLegend = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
`;
const LegendItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;
const StatusDot = styled.span<{ color: string }>`
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 9999px;
  background-color: ${props => props.color};
`;
