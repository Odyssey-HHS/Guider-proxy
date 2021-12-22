import { Router } from "https://deno.land/x/oak@v10.1.0/mod.ts";
import {
  Connection,
  onCloseFunction,
  onMessageFunction,
} from "./Connection.ts";
import { WebsocketUpgradeError } from "../errors.ts";

const router = new Router();

const connections: Connection[] = [];

const onMessage: onMessageFunction = (event, connection) => {
  console.log(`Incoming message: ${event.data} from ${connection.getUuid()}`);
  connection.getSocket().send("Hello World!");
};

const onClose: onCloseFunction = (_event, connection) => {
  console.log(`Closed websocket connection: ${connection.getUuid()}`);

  // Find the closed connection in the storage array.
  const connectionIndex = connections.findIndex((item) =>
    item.getUuid() === connection.getUuid()
  );
  // Remove this connection
  connections.splice(connectionIndex, 1);
};

router.get("/ws", async (ctx) => {
  if (!ctx.isUpgradable) {
    throw new WebsocketUpgradeError();
  }

  // Upgrade the connection to a websocket
  const socket = await ctx.upgrade();

  socket.addEventListener("open", () => {
    console.log("New Websocket connection.");

    connections.push(new Connection(socket, onMessage, onClose));
  });
});

export default router;
