import styled from "styled-components";
import type { ZabbixHost } from "../services/zabbixService";

export default function HostCoponent({
    host,
    onClickHost,
  }: {
    host: ZabbixHost;
    onClickHost: (host_id: string) => void;
  }){
    const iface = host.interfaces?.[0];
    const isAvailable = iface?.available === "1";
    const errorMessage = iface?.error;
  
    return isAvailable ? (
      <Host onClick={() => onClickHost(host.hostid)}>{host.name}</Host>
    ) : (
      <Host
        onClick={() => alert(errorMessage ?? "Host indisponível")}
        style={{ color: "#f00" }}
      >
        {host.name}
      </Host>
    );
  };
  const Host = styled.button`
    display: flex;
    flex-direction: column;
    text-align:left;
    width: 100%;
    height: 2rem;
    border:none;
    background-color: transparent;
    color: ${({ theme }) => theme.text};
    padding: 0.5rem 0;
    font-size:12pt;
`;
