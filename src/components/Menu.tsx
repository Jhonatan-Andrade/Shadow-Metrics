import { useState } from 'react';
import styled from 'styled-components';
import type { ZabbixHost } from '../services/zabbixService';
import type { ActiveView } from '../App';

interface MenuProps {
  hosts: ZabbixHost[];
  activeView: ActiveView;
  activeHostId?: string;
  onNavigate: (view: ActiveView, hostId?: string) => void;
}

export default function Menu({ hosts, activeView, activeHostId, onNavigate }: MenuProps) {
  const [hostsOpen, setHostsOpen] = useState(true);

  return (
    <Main>
      <Title>Shadow Metrics</Title>
      <Nav>
        <NavButton
          active={activeView === 'dashboard'}
          onClick={() => onNavigate('dashboard')}
        >
          Dashboard
        </NavButton>
        <NavButton
          active={activeView === 'network'}
          onClick={() => onNavigate('network')}
        >
          Rede
        </NavButton>
        <SectionHeader onClick={() => setHostsOpen((current) => !current)}>
          Hosts
          <Chevron>{hostsOpen ? '▾' : '▸'}</Chevron>
        </SectionHeader>

        {hostsOpen && (
          <HostList>
            {hosts.map((host) => (
              <HostItem
                key={host.hostid}
                active={activeView === 'host' && activeHostId === host.hostid}
                onClick={() => onNavigate('host', host.hostid)}
              >
                {host.name}
              </HostItem>
            ))}
          </HostList>
        )}


      </Nav>
    </Main>
  );
}

const Main = styled.nav`
  width: 16rem;
  min-height: 100vh -3rem;
  background-color: ${({ theme }) => theme.menuBg};
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  gap: 1.5rem;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.75rem;
  color: ${({ theme }) => theme.text};
`;

const Nav = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NavButton = styled.button<{ active?: boolean }>`
  width: 100%;
  border: none;
  background-color: ${({ active, theme }) => (active ? theme.menuBg : 'transparent')};
  color: ${({ theme }) => theme.text};
  padding: 0.75rem;
  text-align: left;
  border-radius: 0.4rem;
  border-left: 5px solid transparent;
  ${({ active, theme }) => active && `border-color: ${theme.accent};`}
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 1rem;
  &:hover {
    background-color: ${({ theme }) => theme.cardBg};
  }
`;

const SectionHeader = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.text};
  text-align: left;
  padding: 0.9rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.85rem;
  cursor: pointer;
  font-size: 1rem;
`;

const Chevron = styled.span`
  opacity: 0.7;
`;

const HostList = styled.ul`
  width: 100%;
  list-style: none;
  margin: 0;
  padding: 0.25rem 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 0.35rem;
`;

const HostItem = styled.button<{ active?: boolean }>`
  width: 95%;
  border: none;
  background-color: ${({ active, theme }) => (active ? theme.cardBg : 'transparent')};
  color: ${({ theme }) => theme.text};
  padding: 0.75rem 1rem;
  text-align: left;
  border-radius: 0.4rem;
  border-left: 5px solid transparent;
  ${({ active, theme }) => active && `border-color: ${theme.accent};`}
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.cardBg};
  }
`;
