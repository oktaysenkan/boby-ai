import { createRPCClient } from "@boby-ai/server/rpc";
import { isClient, isServer } from "@/lib/env";

const BASE_URL = isServer()
	? process.env.NEXT_PUBLIC_SERVER_URL!
	: `${window.location.origin}/api`;

export const rpcClient = createRPCClient(BASE_URL, {
	headers: async () => {
		if (isClient()) {
			return {};
		}

		const serverHeaders = await import("next/headers").then(
			async ({ headers }) => await headers(),
		);

		return Object.fromEntries(serverHeaders.entries());
	},
});
