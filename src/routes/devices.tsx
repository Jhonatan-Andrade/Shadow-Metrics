import { useEffect, useMemo, useState } from "react";
import { TopBar } from "../components/TopBar.tsx";
import type { ZabbixAPI } from "../services/api.zabbix.ts";
import { Layout } from "./layout.tsx";
import styled from "styled-components";
import { StatusDot } from "../components/StatusDot.tsx";
import { Server } from "lucide-react";
import { UsageBar } from "../components/UsageBar.tsx";
import type { Device, DeviceStatus } from "../services/types.ts";

export default function Devices({ zabbixApi }: { zabbixApi: ZabbixAPI }) {
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    zabbixApi.getDevices().then((data) => {
      setDevices(data);
    });
  }, [zabbixApi]);

  const [filter, setFilter] = useState<"all" | DeviceStatus>("all");
  const [q, setQ] = useState("");

  const tabs = useMemo(() => [
    { id: "all" as const, label: "Todos", count: devices.length },
    { id: "online" as const, label: "Online", count: devices.filter((d) => d.status === "online").length },
    { id: "warning" as const, label: "Aviso", count: devices.filter((d) => d.status === "warning").length },
    { id: "offline" as const, label: "Offline", count: devices.filter((d) => d.status === "offline").length },
  ], [devices]);

  const list = useMemo(() => {
    return devices.filter((d) => {
      if (filter !== "all" && d.status !== filter) return false;
      if (q && !`${d.name} ${d.ip} ${d.group}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [devices, filter, q]);

  return (
    <Layout>
      <Main>
        <TopBar title="Dispositivos" subtitle={`${list.length} hosts encontrados`} />
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
          <SearchInput
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filtrar por nome, IP ou grupo..."
          />
        </Header>     
        <List>
          {list.length > 0 && (
            <ListItem>
              <DeviceHero>HOST</DeviceHero>
              <DeviceInfo>GRUPO</DeviceInfo>
              <DeviceInfo>CPU</DeviceInfo>
              <DeviceInfo>RAM</DeviceInfo>
              <DeviceInfo>DISCO</DeviceInfo>
            </ListItem>
          )}
          {list.map((d) => (
            <ListItem key={d.hostid}>
              <DeviceHero>
                <StatusDot status={d.status} size={1} />
                <StyledServerIcon size={14} />
                <DeviceNameAndIp>
                  <DeviceName title={d.name}>{d.name}</DeviceName>
                  <DeviceIP>{d.ip}</DeviceIP>
                </DeviceNameAndIp>
              </DeviceHero>
              <DeviceInfo span={2}>{d.group}</DeviceInfo>
              <DeviceInfo span={2}>
                <UsageBar value={d.cpu} />
              </DeviceInfo>
              <DeviceInfo span={2}>
                <UsageBar value={d.memory} />
              </DeviceInfo>
              <DeviceInfo span={2}>
                <UsageBar value={d.disk}/>
              </DeviceInfo>
            </ListItem>
          ))}
          {list.length === 0 && (
            <EmptyListItem>Nenhum host corresponde aos filtros.</EmptyListItem>
          )}
        </List>
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
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 1rem;
`;

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

const SearchInput = styled.input`
  width: 100%;
  max-width: 18rem;
  border: 1px solid ${(props) => props.theme.sidebarBorder};
  background-color: ${(props) => props.theme.sidebarBorder};
  padding: 0.4rem 0.75rem;
  border-radius: 0.375rem;
  color: ${(props) => props.theme.textprimary};
  font-size: 0.75rem;
  outline: none;

  &::placeholder {
    color: ${(props) => props.theme.textsecondary};
  }

  &:focus {
    border-color: ${(props) => props.theme.blue};
  }
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  padding: 0;
  justify-content: space-between;
  margin: 1rem ;
  list-style: none;
  border-radius: 0.375rem;
  border: 1px solid ${(props) => props.theme.sidebarBorder};
`;

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
  grid-column: span 12;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;

  @media (min-width: 768px) {
    grid-column: span 3;
  }
`;

const StyledServerIcon = styled(Server)`
  color: ${(props) => props.theme.textsecondary};
  flex-shrink: 0;
`;

const DeviceNameAndIp = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const DeviceName = styled.div`
  font-family: monospace;
  color: ${(props) => props.theme.textprimary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DeviceIP = styled.div`
  font-size: 0.625rem; /* 10px */
  color: ${(props) => props.theme.textsecondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const DeviceInfo = styled.div<{ span?: number }>`
  grid-column: span 6;
  color: ${(props) => props.theme.textsecondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media (min-width: 768px) {
    grid-column: span ${(props) => props.span || 2};
  }
`;

const EmptyListItem = styled.li`
  padding: 3rem 1rem;
  text-align: center;
  font-size: 0.75rem;
  color: ${(props) => props.theme.textsecondary};
`;
