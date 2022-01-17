import { Router, Application } from "https://deno.land/x/oak@v10.1.0/mod.ts";

import webSocketRouter from "./websocket/router.ts";

const connections: ConnectionWrapped[] = [];

interface ConnectionWrapped {
    socket: WebSocket
    id: string
}

webSocketRouter.get(("/"), async (ctx) => {
    const connection = await ctx.upgrade();

    connections.push({
        id: crypto.randomUUID(),
        socket: connection
    })

    connection.addEventListener("message", (messageEvent) => {
        
    })

    console.log("Added new client to the world")
});

const app = new Application();

app.use(webSocketRouter.routes());
app.use(webSocketRouter.allowedMethods());

app.addEventListener("listen", () => {
  console.log("Application running on port 8000");
});

await app.listen({ port: 8443 });