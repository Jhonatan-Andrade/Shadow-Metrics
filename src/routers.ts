//rotas da aplicação
import { FastifyInstance } from "fastify";

import {getCpuUsage, getHosts, getItemsByHostId} from "./zabbix";

export async function Routers(app: FastifyInstance) {
    app.get('/hosts', async (req, res) => {
        const hosts = await getHosts();
        res.status(200).send(hosts);
    });
    app.get('/items', async (req, res) => {
        const hosts = await getHosts();
        let allItems: any[] = [];
        for (const host of hosts) {
            const items = await getItemsByHostId(host.hostid);
            allItems.push(...items);
        }
        res.status(200).send(allItems);
    });
    app.get('/cpu-usage', async (req, res) => {
        const hosts = await getHosts();
        let cpuUsages: any[] = [];
        for (const host of hosts) {
            const cpuUsage = await getCpuUsage(host.hostid);
            cpuUsages.push(...cpuUsage);
        }
        res.status(200).send(cpuUsages);
    });
}