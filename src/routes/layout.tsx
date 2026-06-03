import styled from "styled-components";
import { SiteBar } from "../components/SiteBar";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Main>
        <SiteBar />
        {children}
    </Main>
  );
};
const Main = styled.div`
    display: flex;
    flex-direction: row;
`;