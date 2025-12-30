import { formatError } from "@boby-ai/shared";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { rpcClient } from "@/lib/rpc-client";

export const chatQuery = (id: string) =>
  queryOptions({
    queryKey: ["chat", id],
    queryFn: async () => {
      const response = await rpcClient.chats[":id"].$get({ param: { id } });

      const data = await response.json();

      if (!response.ok) throw new Error(formatError(data));

      return data;
    },
  });

export const useChat = (id: string) => {
  return useQuery(chatQuery(id));
};
