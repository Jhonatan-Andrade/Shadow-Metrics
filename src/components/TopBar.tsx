

import styled from "styled-components";
import ThemeButton from "./ThemeButton";

export function TopBar({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <Header>
            <BoxText>
                <Title>{title}</Title>
                <Subtitle>{subtitle}</Subtitle>
            </BoxText>
            <ThemeButton />
        </Header>
    );
}
const Header = styled.header`
    display: flex;
    width: 100%;
    height: 3rem;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid ${(props) => props.theme.sidebarBorder};
    background-color: ${(props) => props.theme.sidebarBg}80;
    padding: 0.5rem 2.5rem;
`
const BoxText = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: start;
    padding: 2rem 0;
    gap: 0.25rem;
`

const Title = styled.h1`
    font-size: 1.1rem;
    font-weight: 600;
    color: ${(props) => props.theme.textprimary};
    margin: 0;
`;

const Subtitle = styled.p`
    font-size: 0.72rem;
    font-weight: 400;
    color: ${(props) => props.theme.textsecondary};
    margin: 0;
`;
