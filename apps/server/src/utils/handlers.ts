import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";

export const error: ErrorHandler = async (error, c) => {
  if (error instanceof HTTPException) {
    return c.json({ message: error.message }, error.status);
  }

  return c.json({ message: "Internal Server Error" }, 500);
};
