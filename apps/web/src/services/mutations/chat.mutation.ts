import { mutationOptions, useMutation } from "@tanstack/react-query";
import type { InferRequestType, InferResponseType } from "hono/client";
import { rpcClient } from "@/lib/rpc-client";

const request = rpcClient.chat.$post;

export type ChatMutationDto = InferRequestType<typeof request>;
export type ChatMutationResponse = InferResponseType<typeof request>;

export const chatMutation = mutationOptions({
	mutationFn: async (dto: ChatMutationDto) => {
		const response = await rpcClient.chat.$post(dto);
		return response.json();
	},
});

export const useChatMutation = () => {
	return useMutation(chatMutation);
};
