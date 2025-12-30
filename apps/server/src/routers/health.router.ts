import { Hono } from "hono";
import type { HonoEnv } from "~/types/hono";

const healthRouter = new Hono<HonoEnv>().get("/", (c) => {
  return c.json({ message: "OK" });
});

export default healthRouter;
