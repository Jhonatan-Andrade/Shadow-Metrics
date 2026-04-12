
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

export default function Dashboard() {
  const { toggleTheme } = useTheme();

  return (
    <Main>
      <h1>Dashboard</h1>
      <p>Bem-vindo ao monitoramento de sistema!</p>
     
    </Main>
  );
}
const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc(100% - 16rem);
  height: 100vh;
  gap: 20px;
`;
