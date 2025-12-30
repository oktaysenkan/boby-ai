import type { UIMessage } from "ai";
import Chat from "@/components/chat";
import { getQueryClient } from "@/lib/query-client";
import { chatQuery } from "@/services/queries/chat.query";

export default async function ChatPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	const queryClient = getQueryClient();

	const chat = await queryClient.fetchQuery(chatQuery(id));

	return <Chat id={id} messages={chat?.messages as unknown as UIMessage[]} />;
}
