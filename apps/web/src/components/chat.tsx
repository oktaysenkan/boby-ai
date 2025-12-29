"use client";

import { useChat } from "@ai-sdk/react";
import { createId, getAgentName } from "@boby-ai/shared";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { useDebounceCallback } from "usehooks-ts";
import {
	Message,
	MessageContent,
	MessageResponse,
} from "@/components/ai-elements/message";
import ChatPrompt, { type ChatPromptForm } from "@/components/chat-prompt";
import {
	ChatContainerContent,
	ChatContainerRoot,
} from "@/components/ui/chat-container";
import { getQueryClient } from "@/lib/query-client";
import { cn } from "@/lib/utils";
import { chatsQuery } from "@/services/queries/chats.query";

export type ChatProps = {
	id?: string;
	messages?: UIMessage[];
};

export default function Chat({
	id: initialId,
	messages: initialMessages,
}: ChatProps) {
	const router = useRouter();
	const queryClient = getQueryClient();

	const { id, messages, status, sendMessage, stop } = useChat({
		id: initialId ?? createId(),
		messages: initialMessages ?? [],
		transport: new DefaultChatTransport({
			api: `${process.env.NEXT_PUBLIC_SERVER_URL}/chat`,
			credentials: "include",
		}),
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const [messagesLoading, setMessagesLoading] = React.useState(true);

	const handleScroll = useDebounceCallback(() => {
		setMessagesLoading(false);
	}, 100);

	React.useEffect(() => {
		new ResizeObserver(handleScroll).observe(
			document.getElementById("chat-container-root") as Element,
		);
	}, [handleScroll]);

	const lastAssistantMessage = messages.findLast(
		(message) => message.role === "assistant",
	);

	const isLoading = status === "submitted";

	const handleSubmit = (form: ChatPromptForm) => {
		console.log(form);

		sendMessage({
			text: form.prompt,
			metadata: {
				agent: form.agent?.slug,
			},
		});

		const isAlreadyNavigated = window.location.href.includes("/chat/");

		if (isAlreadyNavigated) return;

		window.history.replaceState(null, "", `/chat/${id}`);

		const chatTitle = getAgentName(form.agent?.slug);

		queryClient.setQueryData(chatsQuery.queryKey, (prev) => [
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
					{messages.map((message, messageIndex) => (
						<React.Fragment key={`${message.id}-${messageIndex}`}>
							{message.parts.map((part, partIndex) => {
								switch (part.type) {
									case "text":
										return (
											<Message
												key={`${message.id}-${partIndex}`}
												from={message.role}
											>
												<MessageContent>
													<MessageResponse
														mode={
															lastAssistantMessage?.id === message.id
																? "static"
																: "streaming"
														}
														isAnimating={
															lastAssistantMessage?.id === message.id &&
															status === "streaming"
														}
													>
														{part.text}
													</MessageResponse>
												</MessageContent>
											</Message>
										);
									default:
										return null;
								}
							})}
						</React.Fragment>
					))}
					<div className={cn("hidden p-4", isLoading && "block")}>
						<Loader2 className="animate-spin" />
					</div>
					<div className="h-40" />
				</ChatContainerContent>
				<div className="absolute right-4 bottom-4 left-4">
					<ChatPrompt
						isLoading={isLoading || status === "streaming"}
						disabledAgentSelection={!!messages.length}
						onSubmit={handleSubmit}
						onStop={stop}
					/>
				</div>
			</ChatContainerRoot>
		</div>
	);
}
