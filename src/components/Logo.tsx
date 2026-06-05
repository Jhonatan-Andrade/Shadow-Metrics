import styled, { useTheme } from "styled-components";
import { Activity} from "lucide-react";
export const Logo = () => {
    const theme = useTheme();
    return (
        <Main>
            <LogoImg>
                <Activity size={24} color={theme.gren} />     
            </LogoImg>
            <LogoText>
                <LogoTextH1>SHADOW</LogoTextH1>
                <LogoTextH2>METRICS</LogoTextH2>
            </LogoText>
        </Main>
    );
};
const Main = styled.div`
    display: flex;
    flex-direction: row;
    width: calc(100% - 1.4rem);
    align-items: center;
    gap: 0.5rem;
    align-items: center;
    font-size: 1rem;
    font-weight: 600;
    height: 4rem;
    padding: 0 0.8rem;
    border-bottom: 1px solid ${(props) => props.theme.sidebarBorder};

`
const LogoImg = styled.div`
    position: relative;
`
const LogoText = styled.div`
    display: flex;
    flex-direction: column;
    line-height: 1;
    gap: 0.25rem;
`
const LogoTextH1 = styled.div`
    font-size: 0.875rem;
    font-weight: 600;
    color: ${(props) => props.theme.sidebarForeground};
`
const LogoTextH2 = styled.div`
    font-size: 0.625rem;
    font-weight: 400;
    color: ${(props) => props.theme.sidebarForeground};
    letter-spacing: 0.1em;
    text-transform: uppercase;
`
