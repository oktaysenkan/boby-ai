import { Hono } from "hono";
import * as services from "@/services";

const agentRouter = new Hono().get("/", async (c) => {
  const agents = await services.agent.getAgents();

  return c.json(agents);
});

export default agentRouter;
