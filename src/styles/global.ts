import { createGlobalStyle} from 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    body: string;
    text: string;
    cardBg: string;
    accent: string;
    border: string;
  }
}

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: sans-serif;
    transition: all 0.25s linear;
  }
`;