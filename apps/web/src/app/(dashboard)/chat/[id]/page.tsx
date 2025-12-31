import type { UIMessage } from "@boby-ai/shared";
import { safe } from "fuuu";
import { notFound } from "next/navigation";
import { getQueryClient } from "@/lib/query-client";
import ChatScreen from "@/screens/chat/chat.screen";
import ErrorScreen from "@/screens/error/error.screen";
import { chatQuery } from "@/services/queries/chat.query";

type ChatPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  const queryClient = getQueryClient();

  const chat = await safe(() => queryClient.fetchQuery(chatQuery(id)));

  if (chat.error) return <ErrorScreen error={chat.error.message} />;

  return <ChatScreen id={id} messages={chat.data?.messages as UIMessage[]} />;
}
