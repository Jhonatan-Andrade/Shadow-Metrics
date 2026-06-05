import styled from "styled-components";

export const Main = styled.main`
  display: flex;
  width: calc(100% - 19.5rem);
  flex-direction: column;
  gap: 1rem;
`


export const DashboardGrid = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1rem;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;
export const Section1 = styled.section`
  display: grid;
  grid-template-columns: auto auto auto auto auto auto;
  padding: 1rem;
  gap: 1rem;

`
export const TrafficContent = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 1rem;
`;


export const TrafficCard = styled.div`
  width: 100%;
  border-radius: 0.5rem;
  border: 1px solid ${(props) => props.theme.sidebarBorder};
  background-color: ${(props) => props.theme.sidebarBorder};
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  padding: 1rem;
  margin-left: 1rem;
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;
export const CardText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
export const CardTitle = styled.h2`
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
`;

export const CardSubtitle = styled.p`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
`;

export const TrafficLegend = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
`;

export const LegendItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.375rem;
`;

export const StatusDot = styled.span<{ color: string }>`
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 9999px;
  background-color: ${props => props.color};
`;
