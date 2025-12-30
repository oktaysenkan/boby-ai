import "dotenv/config";
import { auth } from "@boby-ai/auth";
import { Hono } from "hono";
import * as middlewares from "@/middlewares";
import * as routers from "@/routers";
import { handlers } from "@/utils";

const app = new Hono();

app.use(middlewares.logger);
app.use("/*", middlewares.cors);
app.use("*", middlewares.auth);
app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

const router = app
  .route("health", routers.health)
  .route("chats", routers.chat)
  .route("agents", routers.agent);

export type AppType = typeof router;

app.onError(handlers.error);

export default app;
