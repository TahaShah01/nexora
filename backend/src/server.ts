import http from "http";
import { Server as SocketIOServer } from "socket.io";

import app from "./app";
import { env } from "./config/env";
import { connectDB } from "./config/db";
import { registerMessagingSocket } from "./sockets/messaging.socket";
import { setIO } from "./sockets/io-instance";

async function bootstrap() {
  await connectDB();

  const server = http.createServer(app);

  const io = new SocketIOServer(server, {
    cors: { origin: env.clientUrl, credentials: true },
  });
  registerMessagingSocket(io);
  setIO(io);

  server.listen(env.port, () => {
    console.log(`[server] Nexora API listening on http://localhost:${env.port}`);
  });
}

bootstrap();
