import { Hono } from "hono";

const healthRouter = new Hono().get("/", (c) => {
  return c.json({ message: "OK" });
});

export default healthRouter;
