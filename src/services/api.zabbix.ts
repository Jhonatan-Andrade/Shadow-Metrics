import type { Alert, AlertSeverity, DashboardSummary, ZabbixHost } from "./types";

export class ZabbixAPI {
    private apiUrl: string;
    private authToken: string;

    constructor() {
        this.apiUrl = import.meta.env.VITE_ZABBIX_URL || "";
        this.authToken = import.meta.env.VITE_ZABBIX_API_TOKEN || "";
    }

    private async call(method: string, params: object = {}) {
        const response = await fetch(this.apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                jsonrpc: "2.0",
                method,
                params,
                auth: this.authToken,
                id: 1,  
            }),
        });
        const data = await response.json();
        return data;
    }
    private async getHosts(): Promise<ZabbixHost[]> {
        const data = await this.call("host.get", {
            output: ["hostid", "name"],
            selectInterfaces: ["ip", "available", "error"]
        });
        return data.result || [];
    }
    async checkZabbixServer(): Promise<boolean> {
        try {
            const response =  await this.getHosts();
            if(response.length === 0){
                return false;
            }else{
                return true;
            }
        }   catch (error) {
            console.error("Zabbix Server está offline:", error);
            return false;
        }
    }
    async getOverview(): Promise<DashboardSummary> {
        const hosts = await this.getHosts();
        
        const online = hosts.filter(h => 
            h.interfaces.some(i => i.available === "1")
        ).length;

        const offline = hosts.filter(h => 
            h.interfaces.some(i => i.available === "2") && 
            !h.interfaces.some(i => i.available === "1")
        ).length;

        const metricsData = await this.call("item.get", {
            output: ["key_", "lastvalue", "units"],
            search: {
                key_: [
                    "icmppingsec",
                    "system.cpu.util",
                    "vm.memory.util",
                    "net.if.in*",
                    "net.if.out*"
                ]
            },
            searchWildcardsEnabled: true,
            searchByAny: true
        });

        const items = metricsData.result || [];

        // Cálculo da latência média (convertendo de segundos para ms)
        const latencyItems = items.filter((i: any) => i.key_ === "icmppingsec");
        const avgLatencyMs = latencyItems.length > 0
            ? (latencyItems.reduce((acc: number, cur: any) => acc + parseFloat(cur.lastvalue || 0), 0) / latencyItems.length) * 1000
            : 0;

        // Cálculo de CPU média
        const cpuItems = items.filter((i: any) => i.key_ === "system.cpu.util");
        const avgCpu = cpuItems.length > 0
            ? cpuItems.reduce((acc: number, cur: any) => acc + parseFloat(cur.lastvalue || 0), 0) / cpuItems.length
            : 0;

        // Cálculo de Memória média
        const memItems = items.filter((i: any) => i.key_ === "vm.memory.util");
        const avgMemory = memItems.length > 0
            ? memItems.reduce((acc: number, cur: any) => acc + parseFloat(cur.lastvalue || 0), 0) / memItems.length
            : 0;

        // --- Lógica de Histórico de Tráfego ---
        const inItemIds = items.filter((i: any) => i.key_.includes("net.if.in")).map((i: any) => i.itemid);
        const outItemIds = items.filter((i: any) => i.key_.includes("net.if.out")).map((i: any) => i.itemid);

        const timeTill = Math.floor(Date.now() / 1000);
        const timeFrom = timeTill - 3600; // Última 1 hora

        const historyData = await this.call("history.get", {
            itemids: [...inItemIds, ...outItemIds],
            time_from: timeFrom,
            time_till: timeTill,
            history: 3, 
        });

        const history = historyData.result || [];
        
        // Criar 11 buckets para alinhar com o gráfico do dashboard (aprox. 5.5 min cada)
        const numPoints = 11;
        const interval = 3600 / numPoints;
        const trafficInTrend = new Array(numPoints).fill(0);
        const trafficOutTrend = new Array(numPoints).fill(0);

        history.forEach((point: any) => {
            const clock = parseInt(point.clock);
            const value = parseFloat(point.value) / 1000000; // Converter bps para Mbps
            const bucketIndex = Math.min(
                Math.floor((clock - timeFrom) / interval),
                numPoints - 1
            );

            if (bucketIndex >= 0) {
                if (inItemIds.includes(point.itemid)) {
                    trafficInTrend[bucketIndex] += value;
                } else {
                    trafficOutTrend[bucketIndex] += value;
                }
            }
        });

        // Busca de alertas ativos
        const alertsData = await this.call("trigger.get", {
            only_true: true,
            filter: { value: 1 },
            min_severity: 2,
        });
        
        const activeAlerts = alertsData.result?.length || 0;

        return {
            totalHosts: hosts.length,
            online,
            offline,
            avgLatencyMs: Math.round(avgLatencyMs * 10) / 10,
            avgCpu: Math.round(avgCpu * 10) / 10,
            avgMemory: Math.round(avgMemory * 10) / 10,
            totalInMbps: trafficInTrend.map(v => Math.round(v * 100) / 100),
            totalOutMbps: trafficOutTrend.map(v => Math.round(v * 100) / 100),
            activeAlerts
        };
    }
    async getDevices(){}
    async getTraffic(){}
    async getAlerts(): Promise<Alert[]> {
        const alertsData = await this.call("trigger.get", {
            output: ["triggerid", "description", "priority", "lastchange"],
            selectHosts: ["name"],
            only_true: true, 
            monitored: true,
            skipDependent: true,
            expandDescription: true,
            sortfield: "priority",
            sortorder: "DESC",
            limit: 10
        });

        const severityMap: Record<string, AlertSeverity> = {
            "1": "info",
            "2": "warning",
            "3": "average",
            "4": "high",
            "5": "disaster"
        };

        const now = Math.floor(Date.now() / 1000);

        return (alertsData.result || []).map((trigger: any) => {
            const lastchange = parseInt(trigger.lastchange);
            return {
                eventid: trigger.triggerid,
                hostname: trigger.hosts?.[0]?.name || "Desconhecido",
                description: trigger.description,
                severity: severityMap[trigger.priority] || "info",
                acknowledged: false,
                startedAt: new Date(lastchange * 1000).toISOString(),
                durationMin: Math.max(0, Math.floor((now - lastchange) / 60)),
            };
        });
    }
}