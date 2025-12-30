import { cors } from "hono/cors";

const corsMiddleware = cors({
  origin: process.env.CORS_ORIGIN || "",
  allowMethods: ["GET", "POST", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

export default corsMiddleware;
