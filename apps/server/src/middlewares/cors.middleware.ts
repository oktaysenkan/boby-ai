import { cors } from "hono/cors";

const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN || "",
  allowMethods: ["GET", "POST", "OPTIONS"],
  credentials: true,
});

export default corsMiddleware;
