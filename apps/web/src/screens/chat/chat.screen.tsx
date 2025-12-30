"use client";

import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "@boby-ai/shared";
import { createId, getAgentName } from "@boby-ai/shared";
import { DefaultChatTransport } from "ai";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";
import { z } from "zod";
import { MessageList } from "@/components/ai-elements/message";
import ChatPrompt, { type ChatPromptForm } from "@/components/chat/chat-prompt";
import {
	ChatContainerContent,
	ChatContainerRoot,
} from "@/components/ui/chat-container";
import { getQueryClient } from "@/lib/query-client";
import { cn } from "@/lib/utils";
import {
	type Chat as ChatType,
	chatsQuery,
} from "@/services/queries/chats.query";

export type ChatProps = {
	id?: string;
	messages?: UIMessage[];
};

export default function ChatScreen({
	id: initialId,
	messages: initialMessages,
}: ChatProps) {
	const router = useRouter();
	const queryClient = getQueryClient();

	const { id, messages, status, sendMessage, stop } = useChat<UIMessage>({
		id: initialId ?? createId(),
		messages: initialMessages ?? [],
		messageMetadataSchema: z.object({
			agent: z.string(),
		}),
		transport: new DefaultChatTransport({
			api: `${process.env.NEXT_PUBLIC_SERVER_URL}/chat`,
			credentials: "include",
		}),
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const agentSlug = messages.at(0)?.metadata?.agent;

	const [messagesLoading, setMessagesLoading] = React.useState(true);

	const handleScroll = useDebounceCallback(() => {
		setMessagesLoading(false);
	}, 100);

	React.useEffect(() => {
		new ResizeObserver(handleScroll).observe(
			document.getElementById("chat-container-root") as Element,
		);
	}, [handleScroll]);

	const waitingLLMResponse = status === "submitted";

	const handleSubmit = (form: ChatPromptForm) => {
		sendMessage({
			text: form.prompt,
			metadata: {
				agent: form.agent?.slug,
			},
		});

		const isAlreadyNavigated = window.location.href.includes("/chat/");

		if (isAlreadyNavigated) return;

		// We don't want to use nextjs router.push
		// because user should be same chat page because of stream response
		// ChatGPT does this too
		window.history.replaceState(null, "", `/chat/${id}`);

		const chatTitle = getAgentName(form.agent?.slug);

		queryClient.setQueryData<ChatType[]>(chatsQuery.queryKey, (prev) => [
			{
				id,
				messages,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				title: chatTitle,
			},
			...(prev ?? []),
		]);

		router.prefetch(`/chat/${id}`);
	};

	return (
		<div className="flex h-screen w-full flex-col overflow-hidden">
			<ChatContainerRoot
				className="flex-1"
				id="chat-container-root"
				initial={messagesLoading ? "instant" : "smooth"}
				resize={messagesLoading ? "instant" : "smooth"}
			>
				<ChatContainerContent
					id="chat-container-content"
					className={cn(
						"mx-auto max-w-5xl space-y-4 p-4 transition-all duration-300",
						messagesLoading ? "opacity-0" : "opacity-100",
					)}
					onScroll={handleScroll}
				>
					<MessageList
						agentSlug={agentSlug}
						messages={messages}
						messagesLoading={messagesLoading}
						waitingLLMResponse={waitingLLMResponse}
					/>
				</ChatContainerContent>
				<div className="absolute right-4 bottom-4 left-4">
					<ChatPrompt
						isLoading={waitingLLMResponse || status === "streaming"}
						disabledAgentSelection={!!messages.length}
						onSubmit={handleSubmit}
						onStop={stop}
					/>
				</div>
			</ChatContainerRoot>
		</div>
	);
}
