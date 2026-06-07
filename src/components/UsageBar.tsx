import styled from 'styled-components';

export function UsageBar({ value, label }: { value: number; label?: string }) {
  const v = Math.max(0, Math.min(100, value));
  const tone = v >= 85 ? "destructive" : v >= 70 ? "warning" : "primary";

  return (
    <Wrapper>
      <LabelContainer>
        {label && <span>{label}</span>}
        <span style={{ fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }}>
          {v.toFixed(1)}%
        </span>
      </LabelContainer>
      <ProgressBarContainer>
        <ProgressFill width={v} tone={tone} />
      </ProgressBarContainer>
    </Wrapper>
  );
}
const ProgressBarContainer = styled.div`
  margin-top: 4px;
  height: 6px;
  width: 100%;
  overflow: hidden;
  border-radius: 9999px;
  background-color: ${props => props.theme.sidebarBg}; 
`;

const ProgressFill = styled.div<{ width: number; tone: string }>`
  height: 100%;
  width: ${props => props.width}%;
  transition: width 0.3s ease;
  background-color: ${props => 
    props.tone === 'destructive' ? (props) => props.theme.red : 
    props.tone === 'warning' ? (props) => props.theme.orange : (props) => props.theme.gren
  };
`;

const Wrapper = styled.div`
  width: 100%;
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: var(--muted-foreground);
`;