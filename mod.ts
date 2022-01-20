import { Application } from "https://deno.land/x/oak@v10.1.0/mod.ts";
import { errorHandler } from "./middleware.ts";

const app = new Application();

import webSocketRouter from "./websocket/router.ts";

app.use(errorHandler);

app.use(webSocketRouter.routes());
app.use(webSocketRouter.allowedMethods());

app.addEventListener("listen", () => {
  console.log("Application running on port 8443");
});

await app.listen({ port: 8443 });
