import { Hono } from "hono";
import * as services from "~/services";
import type { HonoEnv } from "~/types/hono";

const agentRouter = new Hono<HonoEnv>().get("/", async (c) => {
  const agents = await services.agent.getAgents();

  return c.json(agents);
});

export default agentRouter;
