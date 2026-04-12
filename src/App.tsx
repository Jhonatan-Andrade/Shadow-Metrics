
import  Dashboard  from './pages/Dashbord';
import styled from 'styled-components';
import Menu from './components/Menu';
import ThemeButton from './components/ThemeButton';
export default  function App() {
  return (
    <Main>
      <Menu/>
      <Dashboard />
      <ThemeButton />
    </Main>
  );
}
const Main = styled.main`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  height: 100vh;
  gap: 20px;
`;