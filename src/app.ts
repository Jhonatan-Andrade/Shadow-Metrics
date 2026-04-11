import fastify from "fastify";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import { Routers } from "./routers";

export const app = fastify({ logger: false });

app.register(fastifyCookie, {
  secret: "uma-chave-muito-secreta-e-longa", 
  parseOptions: {}
})
app.register(cors, {
    origin: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
});
app.register(Routers);
app.get('/', (req, res) => {
  res.send({
    message: "🌱 Bem-vindo(a) à Shadow Metrics!",
    description: "Uma API dedicada a coletar e analisar dados coletada pelos nossos scripts de monitoramento.",
    version: "1.0.0",
  });
})
