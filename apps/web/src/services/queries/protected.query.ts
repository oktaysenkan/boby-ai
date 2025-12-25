import { queryOptions, useQuery } from "@tanstack/react-query";
import { rpcClient } from "@/lib/rpc-client";

export const protectedQuery = queryOptions({
	queryKey: ["protected"],
	queryFn: async () => {
		const response = await rpcClient.protected.$get();
		const data = await response.json();
		return data;
	},
});

export const useProtected = () => {
	return useQuery(protectedQuery);
};
