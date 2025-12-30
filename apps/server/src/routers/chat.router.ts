import { getAgentName, type UIMessage } from "@boby-ai/shared";
import { zValidator } from "@hono/zod-validator";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
} from "ai";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import * as services from "@/services";

const openrouter = createOpenRouter({
  apiKey: process.env.OPEN_ROUTER_API_KEY as string,
});

const chatModel = openrouter.chat("google/gemini-2.5-flash-preview-09-2025");

const chatRouter = new Hono()
  .post(
    "/",
    zValidator(
      "json",
      // TODO: ai sdk validation
      z.object({
        id: z.string(),
        messages: z.array(z.any()),
      }),
    ),
    async (c) => {
      const user = c.get("user");
      const body = c.req.valid("json");

      const agentSlug = body.messages.at(0)?.metadata?.agent;

      const agent = await services.agent.getAgentBySlug(agentSlug);

      const systemPrompt =
        agent?.systemPrompt ?? "You are a helpful assistant.";

      const chatTitle = agent?.name ?? getAgentName(agentSlug);

      if (!user) {
        const response = createUIMessageStreamResponse({
          stream: createUIMessageStream({
            execute(options) {
              options.writer.write({
                type: "error",
                errorText: "Authentication required",
              });
            },
          }),
        });

        return response;
      }

      const messages = await convertToModelMessages(body.messages);

      const result = streamText({
        system: systemPrompt,
        model: chatModel,
        messages,
      });

      return result.toUIMessageStreamResponse({
        originalMessages: body.messages,
        onFinish: async ({ messages }) => {
          await services.chat.createChat(body.id, user.id, chatTitle, messages);
        },
      });
    },
  )
  .get("/", async (c) => {
    const user = c.get("user");

    const chats = await services.chat.getChats(user.id);

    return c.json(chats);
  })
  .get("/:id", async (c) => {
    const { id } = c.req.param();

    const result = await services.chat.getChat(id);

    if (!result) throw new HTTPException(404, { message: "Chat not found" });

    return c.json({
      ...result,
      messages: result.messages as UIMessage[],
    });
  });

export default chatRouter;
