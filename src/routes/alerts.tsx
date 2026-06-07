
import { TopBar } from "../components/TopBar.tsx";
import type { ZabbixAPI } from "../services/api.zabbix.ts";
import { Layout } from "./layout.tsx";
import styled, { useTheme } from "styled-components";
import { useEffect, useMemo, useState } from "react";
import type { Alert, AlertSeverity } from "../services/types.ts";
import { StatusDot } from "../components/StatusDot.tsx";

export default function Alerts({ zabbixApi }: { zabbixApi: ZabbixAPI }) {
  const[alerts, setAlerts] = useState<Alert[]>([]);  
  const [filter, setFilter] = useState<"all" | AlertSeverity>("all");

  const [color, setColor] = useState<string>("");
  const theme = useTheme();

  const colorMap: Record<string, string> = {
      online: theme.gren,
      warning: theme.orange,
      offline: theme.red,
      info: theme.blue,
      average: theme.orange,
      high: theme.red,
      disaster: theme.red,
  };

  const textMap: Record<string, string> = {
    warning: "Aviso",
    info: "Informações",
    average: "Média",
    high: "Alto",
    disaster: "Catástrofe",
  };

  const tabs = useMemo(() => [
    { id: "all" as const, label: "Todos", count: alerts.length },
    { id: "info" as const, label: "Informações", count: alerts.filter((d) => d.severity === "info").length },
    { id: "warning" as const, label: "Aviso", count: alerts.filter((d) => d.severity === "warning").length },
    { id: "average" as const, label: "Média", count: alerts.filter((d) => d.severity === "average").length },
    { id: "high" as const, label: "Alto", count: alerts.filter((d) => d.severity === "high").length },
    { id: "disaster" as const, label: "Catástrofe", count: alerts.filter((d) => d.severity === "disaster").length }
  ], [alerts]);

  const list = useMemo(() => {
    return alerts.filter((d) => {
      if (filter !== "all" && d.severity !== filter) return false;
      return true;
    });
  }, [alerts, filter]);
  useEffect(() => {
    zabbixApi.getAlerts().then((data) => {
      setAlerts(data);
      console.log(data);
    });
  }, [zabbixApi]);
  return (
  <Layout>
    <Main>
      <TopBar title="Alertas e incidentes" subtitle="Triggers ativos do Zabbix" />
      <Header>
        <FilterTabs>
            {tabs.map((t) => (
              <TabButton
                key={t.id}
                onClick={() => setFilter(t.id)}
                active={filter === t.id}
              >
                {t.label} <TabCount>{t.count}</TabCount>
              </TabButton>
            ))}
          </FilterTabs>
      </Header>
        <List>
        {list.map((d) => (
          <ListItem key={d.eventid}>
            <DeviceHero>
              <StatusDot status={d.severity} size={1} />
              <DeviceName >
                <DeviceName title={d.hostname}>{d.hostname}</DeviceName>
                <DeviceTime>{d.startedAt}</DeviceTime>
              </DeviceName>
            </DeviceHero>
            <DeviceDescription span={7}>{d.description}</DeviceDescription>
            <DiviceStatus color={colorMap[d.severity] || theme.gren}>{textMap[d.severity] || "Info"}</DiviceStatus>
          </ListItem>
        ))}
        {list.length === 0 && (
          <EmptyListItem>Nenhum host corresponde aos filtros.</EmptyListItem>
        )}
      </List>
    </Main>
  </Layout>);
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
const FilterTabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  border-radius: 0.375rem;
  border: 1px solid ${(props) => props.theme.sidebarBorder};
  padding: 0.25rem;
`;
const TabButton = styled.button<{ active: boolean }>`
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s, color 0.2s;
  border: none;
  cursor: pointer;
  background-color: ${(props) => (props.active ? props.theme.sidebarAccent : "transparent")};
  color: ${(props) => (props.active ? props.theme.textprimary : props.theme.textsecondary)};

  &:hover {
    color: ${(props) => props.theme.textprimary};
  }
`;
const TabCount = styled.span`
  margin-left: 0.25rem;
  font-family: monospace;
  font-size: 10px;
  opacity: 0.7;
`;
const List = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 0;
  justify-content: space-between;
  margin: 1rem ;
  list-style: none;
`
const ListItem = styled.li`
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  font-size: 0.75rem;
  transition: background-color 0.2 s;
  cursor: pointer;
  color: ${(props) => props.theme.textprimary};


  &:hover {
    background-color: ${(props) => props.theme.sidebarAccent}40;
  }
`;
const DeviceHero = styled.div`
  grid-column: span 2;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
`;
const DeviceName = styled.div`
  font-family: monospace;
  color: ${(props) => props.theme.textprimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const DeviceTime = styled.div`
  font-size: 0.625rem; /* 10px */
  color: ${(props)=> props.theme.textsecondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const DeviceDescription = styled.div<{ span?: number }>`
  grid-column: span 8;
  color: ${(props) => props.theme.textsecondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const DiviceStatus = styled.div<{color: string}>`
  width: 6rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.color};
  color: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
`



const EmptyListItem = styled.li`
  padding: 3rem 1rem;
  text-align: center;
  font-size: 0.75rem;
  color: ${(props) => props.theme.textsecondary};
`;