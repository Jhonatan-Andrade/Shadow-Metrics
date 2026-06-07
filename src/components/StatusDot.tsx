import styled, { useTheme } from "styled-components"
interface PulseBoxProps {
    size: number;
}
export function StatusDot({ status , size }:{status: string, size: number}) {
    const theme = useTheme();

    const colorMap: Record<string, string> = {
        online: theme.gren,
        warning: theme.orange,
        offline: theme.red,
        info: theme.blue,
        average: theme.orange,
        high: theme.red,
        disaster: theme.red,
    };

    const color = colorMap[status] || theme.gren;

    return (
        <PulseBox size={size}>
            <Circle size={size} style={{backgroundColor: color}} />
            <Pulse size={size} style={{backgroundColor: color}} />
        </PulseBox>
    )
}
const PulseBox = styled.div<PulseBoxProps>`
    display: flex;
    position: relative;
    height: ${(props) => props.size}rem;
    width: ${(props) => props.size}rem;
    justify-content: center;
    align-items: center;
`
const Circle = styled.div<PulseBoxProps>`
    height: ${(props) => props.size/2}rem;
    width: ${(props) => props.size/2}rem;
    border-radius: 9999px;
    background-color: ${(props) => props.theme.gren};
`
const Pulse = styled.span<PulseBoxProps>`
    position: absolute;
    height: ${(props) => props.size/2}rem;
    width: ${(props) => props.size/2}rem;
    border-radius: 9999px;
    background-color: ${(props) => props.theme.gren};
    animation: pulse 2s infinite;

    @keyframes pulse {
        10% {
            transform: scale(1);
            opacity: 1;
        }
        100% {            
            transform: scale(3);
            opacity: 0;
        }
    }
`
