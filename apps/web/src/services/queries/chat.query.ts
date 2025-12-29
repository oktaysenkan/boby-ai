import { queryOptions, useQuery } from "@tanstack/react-query";
import { rpcClient } from "@/lib/rpc-client";

export const chatQuery = (id: string) =>
	queryOptions({
		queryKey: ["chat", id],
		queryFn: async () => {
			const response = await rpcClient.chat[":id"].$get({ param: { id } });

			if (!response.ok) {
				throw new Error(response.statusText);
			}

			const data = await response.json();
			return data;
		},
	});

export const useChat = (id: string) => {
	return useQuery(chatQuery(id));
};
