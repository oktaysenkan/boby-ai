import { and, db, desc, eq, schema } from "@boby-ai/db";
import type { UIMessage } from "@boby-ai/shared";

export const getChat = async (id: string, userId: string) => {
  const chat = await db.query.chat.findFirst({
    where: and(eq(schema.chat.id, id), eq(schema.chat.userId, userId)),
  });

  return chat;
};

export const getChats = async (userId: string) => {
  const chats = await db
    .select({
      id: schema.chat.id,
      title: schema.chat.title,
      createdAt: schema.chat.createdAt,
      updatedAt: schema.chat.updatedAt,
    })
    .from(schema.chat)
    .where(eq(schema.chat.userId, userId))
    .orderBy(desc(schema.chat.createdAt))
    .limit(10);

  return chats;
};

export const createChat = async (
  chatId: string,
  userId: string,
  title: string,
  messages: UIMessage[],
) => {
  await db
    .insert(schema.chat)
    .values({
      id: chatId,
      userId,
      title,
      messages,
    })
    .onConflictDoUpdate({
      target: schema.chat.id,
      set: { messages },
    });
};
