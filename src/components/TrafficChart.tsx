
import { LineChart, axisClasses, chartsTooltipClasses ,legendClasses} from '@mui/x-charts'
import { useTheme } from "styled-components";


export default function TrafficChart({ times , entry, exit}: { times: number[] , entry: number[], exit: number[]}) {
    const theme = useTheme();

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit'});
    };   
    const data = {
        xAxis: [{ 
            data: times,
            valueFormatter: formatTime,
            tickLabelStyle: { fill: theme.textprimary },
            labelStyle: { fill: theme.textprimary },
        }],
        yAxis: [{ 
            tickLabelStyle: { fill: theme.textprimary },
            labelStyle: { fill: theme.textprimary },
        }], 
        series: [
            {
            data:entry,
            color: '#22c55e',
            label: 'Entrada',
            area: true,
            highlightScope: { highlight: 'series', fade: 'global' },
            },
            {
            data: exit ,
            color: '#3b82f6',
            label: 'Saída',
            area: true,
            highlightScope: { highlight: 'series', fade: 'global' },
            },
        ],
    } as const;
  return (
    <div style={{ width: '100%', height: 300 }}>
      <LineChart
        {...data}
        experimentalFeatures={{ enablePositionBasedPointerInteraction: true }}
        sx={{
          [`& .${axisClasses.root} .${axisClasses.line}`]: {
            stroke: 'transparent',
          },
          [`& .${axisClasses.root} .${axisClasses.tick}`]: {
            stroke: 'transparent',
          },
          [`& .${axisClasses.root} .${axisClasses.tickLabel}`]: {
            fill: 'transparent',
          },
          [`& .${legendClasses.root} text`]: {
            fill: 'white',
          },
        }}
        slotProps={{
            legend: {
                sx: { display: 'none' },
            },
            tooltip: {
              sx: {
                [`& .${chartsTooltipClasses.paper}`]: {
                  backgroundColor: theme.sidebarAccent,
                  border: `1px solid ${theme.sidebarBorder}`, 
                  color: '#ffffff',
                },
                [`& .${chartsTooltipClasses.labelCell}, & .${chartsTooltipClasses.valueCell}`]: {
                  color: '#ffffff',
                },
                ['& .MuiTypography-root']: {
                  color: '#ffffff',
                },
              },
            },
          }
        }
      />
    </div>
  );
}
