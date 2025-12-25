import { hc } from "hono/client";
import type { AppType } from ".";

export const createRPCClient = (...params: Parameters<typeof hc>) =>
	hc<AppType>(...params);
