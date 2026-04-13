
import  Dashboard  from './pages/Dashbord';
import styled from 'styled-components';
import Menu from './components/Menu';
import ThemeButton from './components/ThemeButton';
export default  function App() {
  return (
    <Main>
      <Menu/>
      <ThemeButton />
      <Dashboard />
      
    </Main>
  );
}
const Main = styled.main`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 100vh;
  gap: 4px;
`;