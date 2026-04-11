
import { app } from "./app";
const apiPort = process.env.PORT ? Number(process.env.PORT) : 3333;

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