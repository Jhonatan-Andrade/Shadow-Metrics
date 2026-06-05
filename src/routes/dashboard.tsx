import styled from "styled-components";
import { TopBar } from "../components/TopBar.tsx";
import { Layout } from "./layout.tsx";
import { StatCard } from "../components/StatCard.tsx";
import { ZabbixAPI } from "../services/api.zabbix.ts";
import { Server, Wifi, Activity, Gauge, Cpu, AlertTriangle, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import TrafficChart from "../components/TrafficChart.tsx";
import type { DashboardSummary } from "../services/types.ts";

// Componentes auxiliares (podem ser movidos para arquivos próprios depois)
const SeverityBadge = ({ severity }: { severity: number }) => {
  const labels = ["Informação", "Aviso", "Médio", "Alto", "Desastre"];
  const colors = ["#3b82f6", "#eab308", "#f97316", "#ef4444", "#7f1d1d"];
  return <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: colors[severity-1] || colors[0], color: 'white', fontWeight: 600 }}>{labels[severity-1] || "Info"}</span>;
};

export default function Dashboard({ zabbixApi }: { zabbixApi: ZabbixAPI }) {
  const[summary, setSummary] = useState<DashboardSummary>();
  const[alerts, setAlerts] = useState<any>();

  useEffect(() => {
    zabbixApi.getOverview().then((data) => {
      setSummary(data);
    });
    zabbixApi.getAlerts().then((data) => {
      setAlerts(data);
      console.log(data);
      
    });
  }, [zabbixApi]);

  const now = Date.now();
  const times = Array.from({ length: 11 }, (_, i) => now - (10 - i) * 6 * 60 * 1000);

  const [alert] = useState([
    { eventid: "1", hostname: "Core-Switch-01", severity: 4, description: "Interface GigabitEthernet1/0/1 down", durationMin: 12 },
    { eventid: "2", hostname: "SRV-DB-PROD", severity: 5, description: "High CPU utilization (> 90%)", durationMin: 5 },
    { eventid: "3", hostname: "FW-Borda-02", severity: 3, description: "BGP Session lost with ISP-A", durationMin: 45 },
  ]);

  if (!summary) {
    return (
      <Layout>
        <Main>
          <TopBar title="Visão Geral" subtitle="Carregando dados..." />
        </Main>
      </Layout>
    );
  }

  return (
    <Layout>
      <Main>
        <TopBar title="Visão Geral" subtitle="Pulse da infraestrutura em tempo real" />
        <Section1>
          <StatCard label="Hosts" value={summary?.totalHosts || 0} icon={Server} />
          <StatCard label="Online" value={summary?.online || 0} icon={Wifi} tone="success" />
          <StatCard label="Offline" value={summary?.offline || 0} icon={Activity} tone="destructive" />
          <StatCard label="Latência média" value={summary?.avgLatencyMs || 0} unit="ms" icon={Gauge} tone={(summary?.avgLatencyMs || 0) > 50 ? "warning" : "info"} />
          <StatCard label="CPU média" value={summary?.avgCpu || 0} unit="%" icon={Cpu} />
          <StatCard label="Alertas" value={summary?.activeAlerts || 0} icon={AlertTriangle} tone={(summary?.activeAlerts || 0) > 0 ? "destructive" : "success"} />
        </Section1>

        <DashboardGrid>
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

          <DashboardCard>
            <CardHeader>
              <CardTitle>Alertas recentes</CardTitle>
              <SeeAllLink to="/alerts">
                ver todos <ArrowRight size={12} />
              </SeeAllLink>
            </CardHeader>
            <AlertList>
              {alerts.map((alert: any) => (
                <AlertItem key={alert.eventid}>
                  <AlertItemHeader>
                    <Hostname>{alert.hostname}</Hostname>
                    <SeverityBadge severity={alert.severity} />
                  </AlertItemHeader>
                  <AlertDescription>{alert.description}</AlertDescription>
                  <AlertMeta>há {alert.durationMin} min</AlertMeta>
                </AlertItem>
              ))}
            </AlertList>
          </DashboardCard>
        </DashboardGrid>
      </Main>
    </Layout>
  );
}
const Main = styled.main`
  display: flex;
  width: 100% ;
  flex-direction: column;
`
const Section1 = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 1rem;
  gap: 1rem;
  width: calc(100% - 2rem);
`
const DashboardGrid = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  width: calc(100% - 2rem);
  margin-top: 1rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const DashboardCard = styled.div`
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.sidebarBorder};
  background-color: ${(props) => props.theme.sidebarBorder};
  padding: 1rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
`;

const TrafficCard = styled(DashboardCard)`
  width: 100%;
  @media (min-width: 1024px) {
    grid-column: span 2;
  }
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

const AlertList = styled.ul`
  display: flex;
  width: 16rem;
  flex-direction: column;
  height: 16rem;
  gap: 0.5rem;
  padding: 0;
  list-style: none;
  margin-top: 0.75rem;
  overflow-y: hidden;
  overflow-x: hidden;
`;

const AlertItem = styled.li`
  border-radius: 0.375rem;
  border: 1px solid ${({ theme }) => theme.sidebarBorder};
  background-color: ${({ theme }) => theme.sidebarBorder};
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  padding: 0.625rem;
`;

const AlertItemHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

const Hostname = styled.span`
  font-family: monospace;
  font-size: 0.75rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AlertDescription = styled.p`
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme.textsecondary};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0;
`;

const AlertMeta = styled.div`
  margin-top: 0.25rem;
  font-size: 10px;
  color: ${({ theme }) => theme.textsecondary};
`;

const SeeAllLink = styled(Link)`
  font-size: 11px;
  color: ${({ theme }) => theme.blue};
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;