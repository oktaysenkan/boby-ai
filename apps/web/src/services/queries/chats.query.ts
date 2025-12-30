import { formatError } from "@boby-ai/shared";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { InferResponseType } from "hono/client";
import { rpcClient } from "@/lib/rpc-client";

const request = rpcClient.chats.$get;

export type ChatsResponse = InferResponseType<typeof request>;
export type Chat = ChatsResponse[number];

export const chatsQuery = queryOptions({
  queryKey: ["chats"],
  queryFn: async () => {
    const response = await rpcClient.chats.$get();

    const data = await response.json();

    if (!response.ok) throw new Error(formatError(data));

    return data;
  },
});

export const useChat = () => {
  return useQuery(chatsQuery);
};
