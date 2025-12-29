"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import ChatPrompt, { type ChatPromptForm } from "@/components/chat-prompt";
import {
	ChatContainerContent,
	ChatContainerRoot,
} from "@/components/ui/chat-container";
import { cn } from "@/lib/utils";

export default function ChatBasic() {
	const { messages, sendMessage, status } = useChat({
		transport: new DefaultChatTransport({
			api: `${process.env.NEXT_PUBLIC_SERVER_URL}/chat`,
		}),
		onError: (error) => {
			console.log(error);
			toast.error(error.message);
		},
	});

	const isLoading = status === "submitted";

	const handleSubmit = (form: ChatPromptForm) => {
		sendMessage({
			text: form.prompt,
		});
	};

	return (
		<div className="flex h-screen w-full flex-col overflow-hidden">
			<ChatContainerRoot className="flex-1">
				<ChatContainerContent className="mx-auto max-w-5xl space-y-4 p-4">
					{messages.map((message) => (
						<React.Fragment key={message.id}>
							{message.parts.map((part) => {
								switch (part.type) {
									case "text":
										return (
											<div
												key={message.id}
												data-message-id={message.id}
												data-message-role={message.role}
												className={cn(
													message.role === "user"
														? "ml-auto w-fit self-end rounded-lg bg-muted px-4 py-2 text-right"
														: "p-4 text-left",
												)}
											>
												<Streamdown
													isAnimating={
														status === "streaming" &&
														message.role === "assistant"
													}
												>
													{part.text}
												</Streamdown>
											</div>
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
						disabledAgentSelection={!!messages.length}
						onSubmit={handleSubmit}
					/>
				</div>
			</ChatContainerRoot>
		</div>
	);
}
