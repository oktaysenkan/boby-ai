import "hono";
import type { auth } from "@boby-ai/auth";

declare module "hono" {
  interface ContextVariableMap {
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session;
  }
}
