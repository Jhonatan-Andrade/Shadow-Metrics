import { LineChart } from "@mui/x-charts";
import { getCpuHistory, type CpuHistoryPoint, type ZabbixHost } from "../services/zabbixService";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTheme } from "styled-components";

export default function CpuLineChart({ hosts, color }: { hosts: ZabbixHost, color: string }) {
    const [cpuData, setCpuData] = useState<CpuHistoryPoint[]>([]);
    const [loading, setLoading] = useState(true);

    const times = cpuData.map(point => point.clock * 1000);
    const values = cpuData.map(point => parseFloat(point.value));

    const theme = useTheme();
    
    
    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    async function fetchCpuData() {
      try {
        if (hosts) {
          const data = await getCpuHistory(hosts.hostid);
          setCpuData(data);
          setLoading(false);
        }

      } catch (error) {
        console.error('Error fetching CPU data:', error);
      } finally {
        setLoading(false);
      }
    };
 
    useEffect(() => {
      async function initialize() { 
        await fetchCpuData();
      }
      initialize();
      const intervalId = window.setInterval(fetchCpuData, 5000);
      return () => {
        window.clearInterval(intervalId);
      };
    }, []);
    
  return(
    <Main>
        <HostName>{hosts.name} ( Uso da CPU )</HostName>
        <LineChart
            xAxis={[{ 
                data: times, 
                scaleType: 'time', 
                valueFormatter: formatTime,
                tickLabelStyle: { fill: theme.text },//
                labelStyle: { fill: theme.text }
            }]}
            yAxis={[{
                tickLabelStyle: { fill: theme.text },
                labelStyle: { fill: theme.text }
            }]}
            series={[{ data: values, color }]}
            width={400}
            height={200}
            skipAnimation
        />
    </Main>
  )
}
const Main = styled.main`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.cardBg};
  width: 400px;
  padding: 0.5rem 2.5rem  0 0 ;
  gap: 20px;
  color: #ffffff;
  border-radius: 0.5rem;
`;
const HostName = styled.h2`
  font-size: 12pt;
  padding-left: 2.5rem;
  color: ${({ theme }) => theme.text};
`;