import axios from 'axios';

const ZABBIX_URL = 'http://localhost:8080/api_jsonrpc.php';
const API_TOKEN = '08ac61e54cb8db2ea4c5f39b4912c3a76cedd7273af2f0e8dcaeeb174730034d';

const zabbixApi = axios.create({
    baseURL: ZABBIX_URL,
    headers: {
        'Content-Type': 'application/json-rpc'
    }
});

export interface ZabbixHost {
    hostid: string;
    name: string;
    interfaces: Array<{
        ip: string;
    }>;
}
export interface ZabbixItem {
    itemid: string;
    name: string;
    key_: string;
}
export interface ZabbixItemWithValue extends ZabbixItem {
    lastvalue: string;
    units?: string;
}
async function callZabbix(method: string, params = {}) {
    try {
        const response = await zabbixApi.post('', {
            jsonrpc: "2.0",
            method: method,
            params: params,
            auth: API_TOKEN,
            id: 1
        });

        if (response.data.error) {
            throw new Error(JSON.stringify(response.data.error));
        }

        return response.data.result;
    } catch (error) {
        console.error("Erro na chamada da API:", error);
    }
}


export  async function getHosts(): Promise<ZabbixHost[]> {
    const hosts = await callZabbix("host.get", {
        output: ["hostid", "name"],
        selectInterfaces: ["ip"]
    });
    return hosts;
}

export async function getItemsByHostId(hostid: string): Promise<ZabbixItem[]> {
    const items = await callZabbix("item.get", {
        output: ["itemid", "name", "key_"],
        hostids: hostid
    });
    
    return items;
}

export async function getCpuUsage(hostId: string): Promise<ZabbixItemWithValue[]> {
    const params = {
        output: ["itemid", "name", "lastvalue", "units"],
        hostids: hostId,
        search: {
            key_: "system.cpu.util" 
        },
        filter: {
            value_type: [0, 3] 
        }
    };

    const result = await callZabbix("item.get", params);
    
    const cpuItems: ZabbixItemWithValue[] = result;
    cpuItems.forEach((item: ZabbixItemWithValue) => {
        console.log(`Métrica: ${item.name}`);
        console.log(`Uso Atual: ${item.lastvalue}${item.units || '%'}`);
    });
    return cpuItems;
}