import type { Alert, AlertSeverity, DashboardSummary, Device, Traffic, ZabbixHost } from "./types";

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
            selectInterfaces: ["ip", "available", "error"],
            selectGroups: ["name"]
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

        // 
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
async getDevices(): Promise<Device[]> {
    const hosts = await this.getHosts();

    if (hosts.length === 0) return [];

    const hostIds = hosts.map(h => h.hostid);

    // Buscar métricas de todos os hosts
    const metricsData = await this.call("item.get", {
        output: ["itemid", "key_", "lastvalue", "units", "hostid"],
        search: {
            key_: [
                "icmppingsec",
                "system.cpu.util",
                "vm.memory.util",
                "vfs.fs.size",
                "net.if.in*",
                "net.if.out*"
            ]
        },
        searchWildcardsEnabled: true,
        searchByAny: true
    });

    const items: any[] = metricsData.result || [];

    // Agrupar itens por hostid
    const itemsByHost = new Map<string, any[]>();
    for (const item of items) {
        if (!itemsByHost.has(item.hostid)) {
            itemsByHost.set(item.hostid, []);
        }
        itemsByHost.get(item.hostid)!.push(item);
    }

    // Buscar histórico de CPU, memória e disco (última 1h) para todos os hosts
    const relevantItems = items.filter(i =>
        i.key_ === "system.cpu.util" ||
        i.key_ === "vm.memory.util" ||
        i.key_.startsWith("vfs.fs.size")
    );

    const now  = Math.floor(Date.now() / 1000);
    const from = now - 3600;

    let history: any[] = [];

    if (relevantItems.length > 0) {
        const historyData = await this.call("history.get", {
            output:    "extend",
            itemids:   relevantItems.map(i => i.itemid),
            time_from: from,
            time_till: now,
            history:   0, // float
            sortfield: "clock",
            sortorder: "ASC",
            limit:     5000
        });
        history = historyData.result || [];
    }

    // Agrupar histórico por itemid
    const historyByItem = new Map<string, number[]>();
    for (const h of history) {
        if (!historyByItem.has(h.itemid)) {
            historyByItem.set(h.itemid, []);
        }
        historyByItem.get(h.itemid)!.push(parseFloat(h.value || "0"));
    }

    const avgHistory = (itemid: string): number => {
        const values = historyByItem.get(itemid) || [];
        if (values.length === 0) return 0;
        return values.reduce((a, b) => a + b, 0) / values.length;
    };

    // Montar devices
    const devices: Device[] = hosts.map(host => {
        const hostItems = itemsByHost.get(host.hostid) || [];

        // Status — interface disponível
        const isOnline = host.interfaces?.some((i: any) => i.available === "1") ?? false;

        // IP
        const ip = host.interfaces?.[0]?.ip || "—";

        // Grupo
        const group = host.groups?.[0]?.name || "—";

        // CPU — pegar item e usar histórico se disponível, senão lastvalue
        const cpuItem = hostItems.find(i => i.key_ === "system.cpu.util");
        const cpu = cpuItem
            ? Math.round(avgHistory(cpuItem.itemid) || parseFloat(cpuItem.lastvalue || "0"))
            : 0;

        // Memória
        const memItem = hostItems.find(i => i.key_ === "vm.memory.util");
        const memory = memItem
            ? Math.round(avgHistory(memItem.itemid) || parseFloat(memItem.lastvalue || "0"))
            : 0;

        // Disco — vfs.fs.size[/,pused] ou vfs.fs.size[C:,pused]
        const diskItem = hostItems.find(i =>
            i.key_.startsWith("vfs.fs.size") && i.key_.includes("pused")
        );
        const disk = diskItem
            ? Math.round(avgHistory(diskItem.itemid) || parseFloat(diskItem.lastvalue || "0"))
            : 0;

        // Latência
        const latencyItem = hostItems.find(i => i.key_ === "icmppingsec");
        const latencyMs = latencyItem
            ? Math.round(parseFloat(latencyItem.lastvalue || "0") * 1000 * 10) / 10
            : 0;

        // Tráfego atual
        const inItem = hostItems.find(i =>
            i.key_.includes("net.if.in") && i.units === "bps" &&
            !i.key_.includes(",errors") && !i.key_.includes(",dropped")
        );
        const outItem = hostItems.find(i =>
            i.key_.includes("net.if.out") && i.units === "bps" &&
            !i.key_.includes(",errors") && !i.key_.includes(",dropped")
        );

        const toMbps = (bps: string) =>
            parseFloat((parseFloat(bps || "0") / 1_000_000).toFixed(4));

        return {
            hostid:    host.hostid,
            name:      host.name,
            ip,
            status:    isOnline ? "online" : "offline",
            cpu,
            memory,
            disk,
            group,
            latencyMs,
            inMbps:  toMbps(inItem?.lastvalue  || "0"),
            outMbps: toMbps(outItem?.lastvalue || "0"),
        } as Device;
    });

    return devices;
}
    async getTraffic():Promise<Traffic> {
        const data = await this.getOverview();
        const totalInMbps = data.totalInMbps;
        const totalOutMbps = data.totalOutMbps;
        const entryTraffic = totalInMbps[totalInMbps.length - 1];
        const exitTraffic = totalOutMbps[totalOutMbps.length - 1];
        const maxEntryTraffic = Math.max(...totalInMbps);
        const maxExitTraffic = Math.max(...totalOutMbps);

        return {
            entryTraffic,
            exitTraffic,
            maxEntryTraffic,
            maxExitTraffic
        }
        
    }
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