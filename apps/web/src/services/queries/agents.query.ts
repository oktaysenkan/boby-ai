import { queryOptions, useQuery } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";
import { rpcClient } from "@/lib/rpc-client";

const request = rpcClient.agents.$get;

export type AgentsResponse = InferResponseType<typeof request>;
export type Agent = AgentsResponse[number];

export const agentsQuery = queryOptions({
	queryKey: ["agents"],
	queryFn: async () => {
		const response = await rpcClient.agents.$get();

		if (!response.ok) throw new Error(response.statusText);

		const data = await response.json();

		return data;
	},
});

export const useAgents = () => {
	return useQuery(agentsQuery);
};
