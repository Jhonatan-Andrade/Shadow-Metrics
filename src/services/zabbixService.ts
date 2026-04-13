import axios from 'axios';

const ZABBIX_URL = 'http://localhost:8080/api_jsonrpc.php';
const API_TOKEN = '08ac61e54cb8db2ea4c5f39b4912c3a76cedd7273af2f0e8dcaeeb174730034d';

const zabbixApi = axios.create({
    baseURL: ZABBIX_URL,
    headers: {
        'Content-Type': 'application/json-rpc'
    }
});

interface ZabbixHost {
    hostid: string;
    name: string;
    interfaces: Array<{
        ip: string;
    }>;
}
interface ZabbixItem {
    itemid: string;
    name: string;
    key_: string;
}
interface ZabbixItemWithValue extends ZabbixItem {
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


async function getHosts(): Promise<ZabbixHost[]> {
    const hosts = await callZabbix("host.get", {
        output: ["hostid", "name"],
        selectInterfaces: ["ip"]
    });
    return hosts;
}

async function getItemsByHostId(hostid: string): Promise<ZabbixItem[]> {
    const items = await callZabbix("item.get", {
        output: ["itemid", "name", "key_"],
        hostids: hostid
    });
    
    return items;
}
async function getCpuUsage(hostId: string): Promise<ZabbixItemWithValue[]> {
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
    return cpuItems;
}

async function getMemoryUsage(hostId: string): Promise<ZabbixItemWithValue[]> {
    const params = {
        output: ["lastvalue", "units"],
        hostids: hostId,
        search: {
            key_: "vm.memory.util" 
        }
    };
    const result = await callZabbix("item.get", params);
    const memoryItems: ZabbixItemWithValue[] = result;
    return memoryItems;
}

interface CpuHistoryPoint {
    clock: number;
    value: string;
}

async function getCpuHistory(hostId: string): Promise<CpuHistoryPoint[]> {

    const timeTill = Math.floor(Date.now() / 1000);
    const timeFrom = timeTill - 3600; // Última hora

    const cpuItems = await getCpuUsage(hostId);
    if (cpuItems.length === 0) return [];
    const itemId = cpuItems[0].itemid;

    const params: any = {
        output: "extend",
        itemids: itemId,
        history: 0, 
        sortfield: "clock",
        sortorder: "ASC"
    };
    if (timeFrom) params.time_from = timeFrom;
    if (timeTill) params.time_till = timeTill;

    const result = await callZabbix("history.get", params);
    return result.map((item: any) => ({
        clock: parseInt(item.clock),
        value: item.value
    }));
}

export { getHosts, getItemsByHostId, getCpuUsage, getMemoryUsage, getCpuHistory };
export type { ZabbixHost, ZabbixItem, ZabbixItemWithValue, CpuHistoryPoint };