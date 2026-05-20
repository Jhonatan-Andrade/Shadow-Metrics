
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Menu from './components/Menu';
import ThemeButton from './components/ThemeButton';
import Dashboard from './pages/Dashbord';
import { getHosts, type ZabbixHost } from './services/zabbixService';
import Network from './pages/Network';
import Host from './pages/Host';


export type ActiveView = 'dashboard' | 'network' | 'host';


export default function App() {
  const [hosts, setHosts] = useState<ZabbixHost[]>([]);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [activeHostId, setActiveHostId] = useState<string | undefined>(undefined);

  const selectedHost = hosts.find((host) => host.hostid === activeHostId) || hosts[0];


 

  const handleNavigate = (view: ActiveView, hostId?: string) => {
    setActiveView(view);
    setActiveHostId(view === 'host' ? hostId : undefined);
  };
  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const hostsData = await getHosts();
        setHosts(hostsData);
        console.log(hostsData);
        
      } catch (error) {
        console.error('Error fetching hosts:', error);
      }
    };
    fetchHosts();
  }, [hosts.length]);

  return (
    <Main>
      <Menu
        hosts={hosts}
        activeView={activeView}
        activeHostId={activeHostId}
        onNavigate={handleNavigate}
      />

      <Content>
        {activeView === 'dashboard' && <Dashboard />}
        {activeView === 'network' && <Network />}
        {activeView === 'host' && <Host host={selectedHost} />}
      </Content>
      <ThemeButton />
    </Main>
  );
}

const Main = styled.main`
  display: flex;
  width: 100%;
  min-height: 100vh;
  gap: 4px;
`;

const Content = styled.section`
  flex: 1;
  min-height: 100vh;
  overflow: auto;
  background-color: ${({ theme }) => theme.body || '#05070a'};
`;

const PageContainer = styled.div`
  padding: 2rem;
  color: ${({ theme }) => theme.text};
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 2rem;
`;

const PageDescription = styled.p`
  margin: 0;
  opacity: 0.8;
`;

const PageSection = styled.section`
  padding: 1.5rem;
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.cardBg};
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 1.1rem;
`;

const SectionText = styled.p`
  margin: 0;
  opacity: 0.85;
`;
