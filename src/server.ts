import Fastify from 'fastify'
import cors from "@fastify/cors";

const app = Fastify({logger: false})
const apiPort = process.env.PORT ? Number(process.env.PORT) : 3333;

app.register(cors, {
    origin: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
});
app.get('/', (req, res) => {
    res.send({
        message: "🌱 Bem-vindo(a) à Shadow Metrics!",
        description: "Uma API dedicada a coletar e analisar dados coletada pelos nossos scripts de monitoramento.",
        version: "1.0.0",
    });
});

async function startServer() {
  try {
    app.listen({ port: apiPort, host: '0.0.0.0' }, (err, address) => {
      if (err) {
        console.error("Erro ao iniciar servidor:", err);
        process.exit(1);
      }
      console.log(`Server is Running : http://localhost:${apiPort}`);
    });
  } catch (err) {
    console.error("Erro ao iniciar servidor:", err);
    process.exit(1);
  }
}

startServer();