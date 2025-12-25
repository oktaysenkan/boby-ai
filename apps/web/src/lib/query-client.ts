import {
	defaultShouldDehydrateQuery,
	QueryClient,
} from "@tanstack/react-query";
import { isServer } from "@/lib/env";

let browserQueryClient: QueryClient | undefined;

function createQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000 * 5,
			},
			dehydrate: {
				shouldDehydrateQuery: (query) =>
					defaultShouldDehydrateQuery(query) ||
					query.state.status === "pending",
			},
		},
	});
}

export function getQueryClient() {
	if (isServer()) return createQueryClient();

	if (!browserQueryClient) browserQueryClient = createQueryClient();

	return browserQueryClient;
}
