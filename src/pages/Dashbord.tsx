
import styled from 'styled-components';
import { useEffect} from 'react';

export default function Dashboard() {
 
  useEffect(() => {
    async function fetchHosts() {
      console.log("Fetching hosts...");
    }
    fetchHosts();
    const intervalId = window.setInterval(fetchHosts, 10000);
    return () => {
      window.clearInterval(intervalId);
    };
  }, []);
 return (
    <Main>
      <BoxText>
        <Text>Bem-vindo ao monitoramento de sistema!</Text>
      </BoxText>
    </Main>
  );
}
// desaparecer com o scrool

const Main = styled.main`
  display: flex;
  flex-direction: column;
  width:100%;
  height:100%;
  gap: 1rem;
  color: #ffffff;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  };
`
const BoxText = styled.div`
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction:column;
  padding:2rem 3rem ;

`
const Text = styled.h2`
  color: ${({ theme }) => theme.text};
  font-size: 16pt;
`

