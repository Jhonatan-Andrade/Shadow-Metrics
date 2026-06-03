import styled, { useTheme } from "styled-components";
import { Link, useRouterState } from "@tanstack/react-router";
import { AlertTriangle, LayoutDashboard, Network, Server } from "lucide-react";
import { Logo } from "./Logo";
import { useEffect, useState } from "react";
import { checkZabbixServer } from "../services/zabbixService";
const items = [
    { to: "/", label: "Visão Geral", icon: LayoutDashboard },
    { to: "/devices", label: "Dispositivos", icon: Server },
    { to: "/traffic", label: "Tráfego", icon: Network },
    { to: "/alerts", label: "Alertas", icon: AlertTriangle },
];

export const SiteBar = () => {
    const path = useRouterState({ select: (s) => s.location.pathname });
    const theme = useTheme();
    const [zabbixOnline, setZabbixOnline] = useState(false);
    useEffect(() => {
        const zabbixIsOnline = async () => {
            try {
                const isOnline = await checkZabbixServer();
                setZabbixOnline(isOnline);
            } catch (error) {
                console.error("Erro ao verificar o status do Zabbix Server:", error);
                setZabbixOnline(false);
            }
        };
        zabbixIsOnline();
        const intervalId = window.setInterval(zabbixIsOnline, 10000);
        return () => {
        window.clearInterval(intervalId);
        };
    }, [])
    return (
        <Main>
            <Logo/>
            <Nav>
                {items.map((it) => {
                const active = path === it.to;
                const Icon = it.icon
                return (
                    <NavItem key={it.to} to={it.to} style={{ 
                            backgroundColor: active ? theme.sidebarAccent : "transparent", 
                            color: active ? "" : "inherit",
                            borderLeft: active ? `2px solid ${theme.activity}` : "2px solid transparent"
                        }}> 
                        <Icon size={16} style={{ color: active ? theme.activity : "inherit" }} />
                        <Label>{it.label}</Label>
                    </NavItem>
                )})}
            </Nav>
            <Footer>
                <ZabbixOn>
                    <ZabbixText>Zabbix Server</ZabbixText>
                    <ZabbixLabel>
                        <PulseBox>
                            <Circle style={{ backgroundColor: zabbixOnline ? theme.activity : theme.inactive }} />
                            <Pulse style={{ backgroundColor: zabbixOnline ? theme.activity : theme.inactive }} />
                        </PulseBox>
                        <span style={{ color: zabbixOnline ? theme.activity : theme.inactive }}>
                            {zabbixOnline ? "Online" : "Offline"}
                        </span>
                    </ZabbixLabel>
                </ZabbixOn>
            </Footer>
        </Main>
  );
};
const Main = styled.div`
    display: flex;
    flex-direction: column;
    width: 14rem;
    height: 100vh;
    padding: 0 0.2rem;
    background-color: ${(props) => props.theme.sidebarBg};
    color: ${(props) => props.theme.textsecondary};
    border-right: 1px solid ${(props) => props.theme.sidebarBorder};
`
const Nav = styled.nav`
    display: flex;
    flex-direction: column;
    padding: 0rem 0.5rem;
    ul {
        list-style: none;
    }
`
const NavItem = styled(Link)`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 0.5rem;
    border-radius: 0.375rem;
    background-color: transparent;
    text-decoration: none;
    color: ${(props) => props.theme.sidebarForeground};
    &:hover {
        background-color: ${props => props.theme.sidebarAccent};
    }
`   
const Label = styled.span`
    font-size: 0.875rem;
    font-weight: 500;
`
const Footer = styled.div`
    margin-top: auto;
    width: calc(100% - 0.8rem);
    padding: 1rem 0.5rem;
`
const ZabbixOn = styled.div`
    display: inline-block;
    width: calc(100% - 1rem);
    padding: 0.5rem 0.5rem;
    border-radius: 0.375rem;
    border: 1px solid ${(props) => props.theme.sidebarBorder};
    background-color: ${(props) => props.theme.sidebarBg};
    color: ${(props) => props.theme.sidebarAccentText};
`
const ZabbixText = styled.h1`
    font-size: 0.875rem;
    font-weight: 600;
    color: ${(props) => props.theme.textsecondary};
`
const ZabbixLabel = styled.div`
    font-size: 0.875rem;
    font-weight: 600;
    color: ${(props) => props.theme.sidebarAccentText};
    gap: 0.5rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`
const PulseBox = styled.div`
    display: flex;
    position: relative;
    height: 1rem;
    width: 1rem;
    justify-content: center;
    align-items: center;
`
const Circle = styled.div`
    height: 0.5rem;
    width: 0.5rem;
    border-radius: 9999px;
    background-color: ${(props) => props.theme.activity};
`
const Pulse = styled.span`
    position: absolute;
    height: 0.5rem;
    width: 0.5rem;
    border-radius: 9999px;
    background-color: ${(props) => props.theme.activity};
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
