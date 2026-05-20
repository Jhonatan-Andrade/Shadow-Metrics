
import styled from 'styled-components';
import { getCpuHistory, getMemoryHistory, type ZabbixHost } from '../services/zabbixService';
import MetricLineChart from '../components/MetricLineChart';

export default function Host({ host }: { host: ZabbixHost }) {

 return (
    <Main>
      <BoxText>
        <Text>Bem-vindo ao monitoramento de sistema!</Text>
        <SubText>Host: {host.name}</SubText>
      </BoxText>
      <ListHostLineChart>  
          <ItemHostLineChart  key={host.hostid}>
            <MetricLineChart 
              hosts={host} 
              color="#00ffcc" 
              title="Uso da CPU" 
              fetchMethod={getCpuHistory} 
            />
            <MetricLineChart 
              hosts={host} 
              color="#ff9900" 
              title="Uso de Memória" 
              fetchMethod={getMemoryHistory} 
            />
          </ItemHostLineChart>
      </ListHostLineChart>
    </Main>
  );
}
// desaparecer com o scrool

const Main = styled.main`
  display: flex;
  flex-direction: column;
  width:100%;
 
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
  flex-direction:column;
  padding:2rem ;

`

const Text = styled.h2`
  color: ${({ theme }) => theme.text};
  font-size: 16pt;
`

const SubText = styled.h3`
  color: ${({ theme }) => theme.text};
  font-size: 12pt;
`;