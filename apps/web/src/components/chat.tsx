"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { InView } from "react-intersection-observer";
import { toast } from "sonner";
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

const createId = () =>
	Date.now().toString(36) + Math.random().toString(36).substring(2, 15);

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
	const [hidden, setHidden] = React.useState(true);

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

	React.useEffect(() => {
		setTimeout(() => setHidden(false), 300);
	}, []);

	const lastAssistantMessage = messages.findLast(
		(message) => message.role === "assistant",
	);

	const isLoading = status === "submitted";

	const handleSubmit = (form: ChatPromptForm) => {
		sendMessage({
			text: form.prompt,
		});

		const isAlreadyNavigated = window.location.href.includes("/chat/");

		if (isAlreadyNavigated) return;

		window.history.replaceState(null, "", `/chat/${id}`);

		queryClient.setQueryData(chatsQuery.queryKey, (prev) => [
			{
				id,
				messages,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				title: "Untitled Chat",
			},
			...(prev ?? []),
		]);
		router.prefetch(`/chat/${id}`);
	};

	return (
		<div className="flex h-screen w-full flex-col overflow-hidden">
			<ChatContainerRoot
				className="flex-1"
				initial={status === "streaming" ? "smooth" : "instant"}
				resize={status === "streaming" ? "smooth" : "instant"}
			>
				<ChatContainerContent
					className={cn(
						"mx-auto max-w-5xl space-y-4 p-4 transition-all duration-300",
						hidden ? "opacity-0" : "opacity-100",
					)}
				>
					{messages.map((message, index) => (
						<React.Fragment key={`${message.id}-${index}`}>
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
