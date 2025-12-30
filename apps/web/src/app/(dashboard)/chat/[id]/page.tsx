import type { UIMessage } from "@boby-ai/shared";
import { getQueryClient } from "@/lib/query-client";
import ChatScreen from "@/screens/chat/chat.screen";
import { chatQuery } from "@/services/queries/chat.query";

type ChatPageProps = {
	params: Promise<{ id: string }>;
};

export default async function ChatPage({ params }: ChatPageProps) {
	const { id } = await params;

	const queryClient = getQueryClient();

	const chat = await queryClient.fetchQuery(chatQuery(id));

	return <ChatScreen id={id} messages={chat?.messages as UIMessage[]} />;
}
