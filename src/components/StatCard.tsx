import type { LucideIcon } from "lucide-react";
import styled, { useTheme } from "styled-components";

interface Props {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  tone?: "default" | "success" | "warning" | "destructive" | "info";
  hint?: string;
}

export function StatCard({ label, value, unit, icon: Icon, tone = "default", hint }: Props) {
  const theme = useTheme();
  const toneMap: Record<NonNullable<Props["tone"]>, string> = {
    default: theme.textsecondary,
    success: theme.gren,
    warning: theme.orange,
    destructive: theme.red,
    info: theme.blue,
  };
  return (
    <Main>
      <Header>
        <Label>{label}</Label>
        <Icon size={24} color={toneMap[tone]}/>
      </Header>
      <DataValue>
        <TextValue>{value}</TextValue>
        {unit && <Unit >{unit}</Unit>}
      </DataValue>
      {hint && <Hint>{hint}</Hint>}
    </Main>
  )
}
const Main = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    border-radius: 0.375rem;
    border: 1px solid ${(props) => props.theme.sidebarBorder};
    box-shadow: var(--shadow-card);
`
const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`
const Label = styled.div`
    width: 100% ;
    font-size: 0.6875rem;
    font-weight: 500;
    color: ${(props) => props.theme.textsecondary};
    text-transform: uppercase;

`
const DataValue = styled.div`
    display: flex;
    align-items: baseline;
    gap: 0.25rem;
    margin-top: 0.75rem;
`
const TextValue = styled.span`
    font-size: 1.5rem;
    font-weight: 600;
    color: ${(props) => props.theme.textprimary};
    font-family: monospace;
`
const Unit = styled.span`
    font-size: 0.75rem;
    color: ${(props) => props.theme.textsecondary};
`
const Hint = styled.span`
    margin-top: 0.5rem;
    font-size: 0.6875rem;
    color: ${(props) => props.theme.textsecondary};
` 

// export function StatCard({ label, value, unit, icon: Icon, tone = "default", hint }: Props) {
//   return (
//     <div className="relative overflow-hidden rounded-lg border border-border bg-card p-4 shadow-[var(--shadow-card)]">
//       <div className="flex items-start justify-between">
//         <div className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground">{label}</div>
//         <Icon className={`h-4 w-4 ${toneMap[tone]}`} />
//       </div>
//       <div className="mt-3 flex items-baseline gap-1">
//         <span className={`font-mono text-2xl font-semibold tabular-nums ${toneMap[tone]}`}>{value}</span>
//         {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
//       </div>
//     </div>
//   );
// }