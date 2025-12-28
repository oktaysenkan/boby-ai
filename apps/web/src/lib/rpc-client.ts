import { createRPCClient } from "@boby-ai/server/rpc";
import { isClient } from "@/lib/env";

export const rpcClient = createRPCClient(process.env.NEXT_PUBLIC_SERVER_URL!, {
	init: {
		credentials: "include",
	},
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
