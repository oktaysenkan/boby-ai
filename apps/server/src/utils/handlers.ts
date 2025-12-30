import type { ErrorHandler, NotFoundHandler } from "hono";
import { HTTPException } from "hono/http-exception";

export const error: ErrorHandler = async (error, c) => {
  if (error instanceof HTTPException) {
    return c.json({ message: error.message }, error.status);
  }

  return c.json({ message: "Internal Server Error" }, 500);
};

export const notFound: NotFoundHandler = async (c) => {
  return c.json({ message: "Method not allowed" }, 405);
};
