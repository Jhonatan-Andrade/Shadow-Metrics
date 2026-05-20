import { LineChart } from "@mui/x-charts";
import { type HistoryPoint, type ZabbixHost, type MetricResponse } from "../services/zabbixService";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useTheme } from "styled-components";

interface MetricLineChartProps {
  hosts: ZabbixHost;
  color: string;
  title: string;
  fetchMethod: (hostId: string) => Promise<MetricResponse>;
}

export default function MetricLineChart({ hosts, color, title, fetchMethod }: MetricLineChartProps) {
  const [metricData, setMetricData] = useState<HistoryPoint[]>([]);
  const [units, setUnits] = useState<string>(""); 
  const [loading, setLoading] = useState(true);
  const [hasFetchedOnce, setHasFetchedOnce] = useState(false);

  const times = metricData.map(point => new Date(point.clock * 1000));
  const values = metricData.map(point => parseFloat(point.value));

  const theme = useTheme();

  //manter os dados antigo enquanto carrega os novos para evitar tela em branco
 


  function formatTime(date: Date) {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  
const formatValue = (value: number | null) => {
  if (value === null) return "";
  if (units === "%") {
    return `${value}%`; 
  }

  return `${value.toFixed(1)}${units}`; 
};
  async function fetchMetrics() {
    try {
      if (hosts?.hostid) {
        if (metricData.length === 0) {
          setLoading(true);
        }
        const response = await fetchMethod(hosts.hostid);
        setMetricData(response.points);
        setUnits(response.units);
      }
    } catch (error) {
      console.error(`Error fetching ${title} data:`, error);
    } finally {
      setLoading(false);
      setHasFetchedOnce(true);
    }
  }



  useEffect(() => {
    fetchMetrics();
    const intervalId = window.setInterval(fetchMetrics, 5000);
    return () => {
      window.clearInterval(intervalId);
    };
  }, [hosts?.hostid, fetchMethod]);

  if (loading && !hasFetchedOnce) {
    return <Main style={{ justifyContent: 'center', alignItems: 'center', height: 200 }}><p style={{ color: theme.text }}>Carregando...</p></Main>;
  }

  return (
    <Main>
      <HostName>{title}</HostName>
      {metricData.length > 0 ? (
        <LineChart
          xAxis={[{
            data: times,
            scaleType: 'time',
            valueFormatter: formatTime,
            tickLabelStyle: { fill: theme.text },
            labelStyle: { fill: theme.text }
          }]}
          yAxis={[{
            valueFormatter: formatValue, 
            tickLabelStyle: { fill: theme.text },
            labelStyle: { fill: theme.text }
          }]}
          series={[{ 
            data: values, 
            color, 
            valueFormatter: formatValue 
          }]}
          width={400}
          height={200}
          skipAnimation
        />
      ) : (
        <NoDataText style={{ color: theme.text }}>Nenhum dado encontrado</NoDataText>
      )}
    </Main>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.cardBg};
  width: 100%;
  padding: 1rem 1.5rem;
  gap: 20px;
  color: #ffffff;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
`;

const HostName = styled.h2`
  font-size: 12pt;
  padding-left: 2.5rem;
  color: ${({ theme }) => theme.text};
`;

const NoDataText = styled.p`
  font-size: 10pt;
  padding-left: 2.5rem;
  padding-bottom: 1rem;
  opacity: 0.7;
`;