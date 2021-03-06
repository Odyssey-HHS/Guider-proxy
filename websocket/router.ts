import { Router } from "https://deno.land/x/oak@v10.1.0/mod.ts";
import {
  Connection,
  onCloseFunction,
  onMessageFunction,
} from "./Connection.ts";
import { WebsocketUpgradeError } from "../errors.ts";
import { Dashboard } from "../guiderConnection/Dashboard.ts";

const router = new Router();

const connections: Connection[] = [];
const dashboard = new Dashboard();

const hostname = Deno.args[0];

if (!hostname) {
  throw new Error("No hostname provided! Please run as `deno run -A mod.ts 172.16.99.1`");
}

await dashboard.connect({ hostname, port: 8000 });

const onMessage: onMessageFunction = async (event, connection) => {
  console.log(`Incoming message: ${event.data} from ${connection.getUuid()}`);

  const object = JSON.parse(event.data);

  let lastResponse;

  if (typeof object.openDoor === "boolean") {
    lastResponse = await dashboard.setDoor(object.openDoor);
  }

  if (typeof object.motionAlert === "boolean") {
    lastResponse = await dashboard.setMotionAlert(object.motionAlert);
  }

  if (typeof object.fireAlert === "boolean") {
    lastResponse = await dashboard.setFireAlert(object.fireAlert);
  }

  if (typeof object.panicAlert === "boolean") {
    lastResponse = await dashboard.setPanicAlert(object.panicAlert);
  }

  if (typeof object.fnt === "boolean") {
    lastResponse = await dashboard.setForceNightTime(object.fnt);
  }

  if (typeof object.lampColor === "number") {
    lastResponse = await dashboard.setLampColor(object.lampColor);
  }

  // Send an empty request
  if (!lastResponse) {
    lastResponse = await dashboard.updateGuider({});
  }

  console.log(lastResponse);

  connection.getSocket().send(lastResponse);
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
