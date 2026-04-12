import styled from "styled-components";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeButton() {
        const { theme , toggleTheme } = useTheme();
    return (
        <Button onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
        </Button>
    );
} 
const Button = styled.button`
  width: 3rem;
  height: 3rem;
  font-size: 1.5rem;
  background-color: transparent;
  color: ${({ theme }) => theme.text};
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  position: fixed;
  top:0;
  right: 0;
  z-index: 1000;
`;  