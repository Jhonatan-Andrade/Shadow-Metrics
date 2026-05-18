
import styled from 'styled-components';
import { useEffect, useState} from 'react';
import { getCpuHistory, getHosts, getMemoryHistory, type ZabbixHost } from '../services/zabbixService';
import MetricLineChart from '../components/MetricLineChart';

export default function Dashboard() {
  const [hosts, setHosts ] = useState<ZabbixHost[]>([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    async function fetchHosts() {
      try {
        const data = await getHosts();
        setHosts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hosts:', error);
      }
    }
    fetchHosts();
    const intervalId = window.setInterval(fetchHosts, 10000);// Atualiza a cada 10 segundo
    return () => {
      window.clearInterval(intervalId);
    };
  }, []);
 return (
    <Main>
      <BoxText>
        <Text>Bem-vindo ao monitoramento de sistema!</Text>
      </BoxText>
      <ListHostLineChart>  
        {loading ? (
          <p>Carregando dados...</p>
        ) : (
          hosts.map(host => (
          <ItemHostLineChart  key={host.hostid}>
            <MetricLineChart 
              hosts={hosts[0]} 
              color="#00ffcc" 
              title="Uso da CPU" 
              fetchMethod={getCpuHistory} 
            />
            <MetricLineChart 
              hosts={hosts[0]} 
              color="#ff9900" 
              title="Uso de Memória" 
              fetchMethod={getMemoryHistory} 
            />
          </ItemHostLineChart>))
        )}
      </ListHostLineChart>
    </Main>
  );
}
// desaparecer com o scrool

const Main = styled.main`
  display: flex;
  flex-direction: column;
  width:100%;
  height:100vh;
  padding:0 2rem;
  gap: 1rem;
  color: #ffffff;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
`;
const ListHostLineChart = styled.ul`
  display: grid;
  grid-template-columns: auto auto ;
  gap: 0.5rem;
`
const ItemHostLineChart = styled.li`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  list-style:none;
  gap: 1rem;
`
const BoxText = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  padding-top:2rem;
`

const Text = styled.h2`
  color: ${({ theme }) => theme.text};
  font-size: 12pt;
`

