
import styled from 'styled-components';
import { useEffect, useState} from 'react';
import { getHosts, type ZabbixHost } from '../services/zabbixService';
import CpuLineChart from '../components/CpuLineChart';


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
      <ListCpuLineChart>  
        {loading ? (
          <p>Carregando dados...</p>
        ) : (
          hosts.map(host => (<CpuLineChart hosts={host}  color="#0c00f1" />))
        )}
      </ListCpuLineChart>
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
const ListCpuLineChart = styled.div`
  display: grid;
  grid-template-columns: auto auto ;
  gap: 0.5rem;
`
const BoxText = styled.h2`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
`

const Text = styled.h2`
  color: ${({ theme }) => theme.text};
  font-size: 12pt;
`

