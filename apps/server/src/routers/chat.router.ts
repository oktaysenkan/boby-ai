import { getAgentName, type UIMessage } from "@boby-ai/shared";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, safeValidateUIMessages, streamText } from "ai";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import * as services from "~/services";
import type { HonoEnv } from "~/types/hono";
import { buildStreamingErrorResponse } from "~/utils/streaming";

const openRouterClient = createOpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY as string,
});

const chatModel = openRouterClient.chat(
  "google/gemini-2.5-flash-preview-09-2025",
);

const chatRouter = new Hono<HonoEnv>()
  .post("/", async (c) => {
    const user = c.get("user");
    const body = await c.req.json();

    const messagesValidationResult = await safeValidateUIMessages<UIMessage>({
      messages: body.messages,
    });

    if (!messagesValidationResult.success)
      return buildStreamingErrorResponse(messagesValidationResult.error);

    const validatedMessages = messagesValidationResult.data;

    const agentSlug = validatedMessages.at(0)?.metadata?.agent;

    const agent = agentSlug
      ? await services.agent.getAgentBySlug(agentSlug)
      : undefined;

    const systemPrompt = agent?.systemPrompt ?? "You are a helpful assistant.";

    const chatTitle = agent?.name ?? getAgentName(agentSlug);

    if (!user) return buildStreamingErrorResponse("Authentication required");

    const modelMessages =
      await convertToModelMessages<UIMessage>(validatedMessages);

    const result = streamText({
      system: systemPrompt,
      model: chatModel,
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse<UIMessage>({
      originalMessages: body.messages,
      onFinish: async ({ messages }) =>
        await services.chat.createChat(body.id, user.id, chatTitle, messages),
    });
  })
  .get("/:id", async (c) => {
    const user = c.get("user");

    const { id } = c.req.param();

    const result = await services.chat.getChat(id, user.id);

    if (!result) throw new HTTPException(404, { message: "Chat not found" });

    return c.json({
      ...result,
      messages: result.messages as UIMessage[],
    });
  })
  .get("/", async (c) => {
    const user = c.get("user");

    const chats = await services.chat.getChats(user.id);

    return c.json(chats);
  });

export default chatRouter;
