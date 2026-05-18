import axios from 'axios';

const ZABBIX_URL = import.meta.env.VITE_ZABBIX_URL;
const API_TOKEN = import.meta.env.VITE_ZABBIX_API_TOKEN;

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
        available: string;
        error: string;
    }>;
}

export interface ZabbixItemWithValue {
    itemid: string;
    name: string;
    key_: string;
    lastvalue: string;
    units?: string;
}

export interface HistoryPoint {
    clock: number;
    value: string;
}
export interface MetricResponse {
    units: string;
    points: HistoryPoint[];
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
        console.error(`Erro na chamada da API (${method}):`, error);
        throw error;
    }
}

export async function getHosts(): Promise<ZabbixHost[]> {
    return await callZabbix("host.get", {
        output: ["hostid", "name"],
        selectInterfaces: ["ip", "available", "error"]
    });
}

export async function getHostStatus(hostId: string): Promise<any> {
    return await callZabbix("host.get", {
        hostids: hostId,
        output: ["status"]
    });
}

export async function getCpuHistory(hostId: string): Promise<MetricResponse> {
    try {
        const allCounters = await callZabbix("item.get", {
            output: ["itemid", "name", "lastvalue", "units", "key_"],
            hostids: hostId,
            search: { 
                key_: "perf_counter" 
            }
        });

        const cpuItems = allCounters.filter((item: any) => 
            item.key_.includes("Processor Time") || item.key_.includes("User Time")
        );

        if (!cpuItems || cpuItems.length === 0) {
            console.warn("Nenhum item de CPU correspondente foi encontrado.");
            return { units: '%', points: [] };
        }

        const totalItem = cpuItems.find((item: any) => item.key_.includes("Processor Time")) || cpuItems[0];
        
        const isFloat = totalItem.units === '%' || (totalItem.lastvalue && totalItem.lastvalue.includes('.'));
        const historyType = isFloat ? 0 : 3;

        const params = {
            output: "extend",
            itemids: totalItem.itemid,
            history: historyType, 
            sortfield: "clock",
            sortorder: "ASC",
            time_from: Math.floor(Date.now() / 1000) - 3600,
            time_till: Math.floor(Date.now() / 1000)
        };

        const result = await callZabbix("history.get", params);
        
        const points = result.map((i: any) => ({
            clock: parseInt(i.clock),
            value: i.value
        }));

        return { units: totalItem.units || '%', points };

    } catch (error) {
        console.error('Erro ao buscar CPU:', error);
        return { units: '%', points: [] };
    }
}

export async function getMemoryHistory(hostId: string): Promise<MetricResponse> {
    try {
        const memItems = await callZabbix("item.get", {
            output: ["itemid", "name", "lastvalue", "units", "key_"],
            hostids: hostId,
            filter: { 
                key_: [
                    "vm.memory.size[pavailable]", 
                    "vm.memory.size[available]",  
                    "vm.memory.util"         
                ]
            }
        });

        if (!memItems || memItems.length === 0) {
            console.warn("Nenhum item de memória correspondente foi encontrado.");
            return { units: '%', points: [] };
        }

        const item = memItems[0];
        
        const isPercent = item.units === '%' || item.key_.includes('pavailable') || item.key_.includes('util');
        const historyType = isPercent ? 0 : 3; 

        const timeTill = Math.floor(Date.now() / 1000);
        const timeFrom = timeTill - 3600; 

        const params = {
            output: "extend",
            itemids: item.itemid,
            history: historyType, 
            sortfield: "clock",
            sortorder: "ASC",
            time_from: timeFrom,
            time_till: timeTill
        };

        const result = await callZabbix("history.get", params);
        const points = result.map((i: any) => ({
            clock: parseInt(i.clock),
            value: i.value
        }));

        return { units: item.units || '%', points };
        
    } catch (error) {
        console.error('Erro ao buscar item de memória:', error);
        return { units: '%', points: [] };
    }
}