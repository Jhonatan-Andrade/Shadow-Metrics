import { createGlobalStyle} from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    body: string;
    textprimary: string;
    textsecondary: string;
    gren: string,
    red: string,
    orange: string,
    blue:string,
    gradientBg:string,

    sidebarBg: string;
    sidebarHover: string;
    sidebarBorder: string;
    sidebarForeground: string;
    sidebarAccent: string;
    sidebarAccentText: string;
  }
}

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.textprimary};
    font-family: sans-serif;
    transition: all 0.25s linear;
    box-sizing: border-box;
    overflow-x: hidden;
  }
`;