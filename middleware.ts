import { Middleware } from "https://deno.land/x/oak@v10.1.0/mod.ts";

export const errorHandler: Middleware = async (_ctx, next) => {
  await next().catch((error) => {
    console.log(error);
  });
};
