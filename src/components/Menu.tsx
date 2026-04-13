import styled from "styled-components";

export default function Menu() {

    return (
        <Main>
            <Title>Shadow Metrics</Title>
            <Nav>  
            </Nav>
        </Main>

    );
}

const Main = styled.nav`
    width: 20rem;
    height: 100vh;
    background-color: ${({ theme }) => theme.cardBg};
    display: flex;
    flex-direction: column;
    align-items: center;
    
`;
const Nav = styled.nav`
    width: 100%;
    height: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const Title = styled.h1`
    padding: 2rem 0;
    color: ${({ theme }) => theme.text};
    font-size: 1.5rem;
    margin: 0;
`;