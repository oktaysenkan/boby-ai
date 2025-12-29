import "dotenv/config";
import { auth } from "@boby-ai/auth";
import { and, db, desc, eq, schema } from "@boby-ai/db";
import { getAgentName } from "@boby-ai/shared";
import { zValidator } from "@hono/zod-validator";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
	convertToModelMessages,
	createUIMessageStream,
	createUIMessageStreamResponse,
	streamText,
	type UIMessage,
} from "ai";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import z from "zod";

type HonoEnv = {
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null;
	};
};

const openrouter = createOpenRouter({
	apiKey: process.env.OPEN_ROUTER_API_KEY as string,
});

const chatModel = openrouter.chat("google/gemini-2.5-flash-preview-09-2025");

const app = new Hono<HonoEnv>();

app.use(logger());

app.use(
	"/*",
	cors({
		origin: process.env.CORS_ORIGIN || "",
		allowMethods: ["GET", "POST", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.use("*", async (c, next) => {
	console.log(c.req.raw.headers);

	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session) {
		c.set("user", null);
		c.set("session", null);
		await next();
		return;
	}

	c.set("user", session.user);
	c.set("session", session.session);

	await next();
});

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

const router = app
	.get("/", (c) => {
		return c.json({ message: "OK" });
	})
	.post(
		"/chat",
		zValidator(
			"json",
			z.object({
				id: z.string(),
				messages: z.array(z.any()),
			}),
		),
		async (c) => {
			const user = c.get("user");
			const body = c.req.valid("json");

			const agentSlug = body.messages.at(0)?.metadata?.agent;

			const agentDetail = await db.query.agent.findFirst({
				where: eq(schema.agent.slug, agentSlug),
			});

			const systemPrompt =
				agentDetail?.systemPrompt ?? "You are a helpful assistant.";

			const chatTitle = getAgentName(agentSlug) ?? "Untitled Chat";

			if (!user) {
				const response = createUIMessageStreamResponse({
					stream: createUIMessageStream({
						execute(options) {
							options.writer.write({
								type: "error",
								errorText: "Unauthorized",
							});
						},
					}),
				});

				return response;
			}

			const messages = await convertToModelMessages(
				body.messages as UIMessage[],
			);

			const result = streamText({
				system: systemPrompt,
				model: chatModel,
				messages,
			});

			return result.toUIMessageStreamResponse({
				originalMessages: body.messages,
				onFinish: async ({ messages }) => {
					await db
						.insert(schema.chat)
						.values({
							id: body.id,
							userId: user.id,
							title: chatTitle,
							messages,
						})
						.onConflictDoUpdate({
							target: schema.chat.id,
							set: { messages },
						});
				},
			});
		},
	)
	.get("/chats", async (c) => {
		const user = c.get("user");

		if (!user) throw new HTTPException(401, { message: "Unauthorized" });

		const result = await db
			.select({
				id: schema.chat.id,
				title: schema.chat.title,
				createdAt: schema.chat.createdAt,
				updatedAt: schema.chat.updatedAt,
			})
			.from(schema.chat)
			.where(eq(schema.chat.userId, user.id))
			.orderBy(desc(schema.chat.createdAt))
			.limit(10);

		return c.json(result);
	})
	.get("/chat/:id", async (c) => {
		const { id } = c.req.param();

		const user = c.get("user");

		if (!user) throw new HTTPException(401, { message: "Unauthorized" });

		const result = await db.query.chat.findFirst({
			where: and(eq(schema.chat.id, id), eq(schema.chat.userId, user.id)),
		});

		if (!result) throw new HTTPException(404, { message: "Chat not found" });

		return c.json(result);
	})
	.get("/agents", async (c) => {
		const user = c.get("user");

		if (!user) throw new HTTPException(401, { message: "Unauthorized" });

		const result = await db
			.select({
				id: schema.agent.id,
				slug: schema.agent.slug,
				name: schema.agent.name,
				description: schema.agent.description,
			})
			.from(schema.agent);

		return c.json(result);
	})
	.get("/protected", (c) => {
		const user = c.get("user");

		if (!user) throw new HTTPException(401, { message: "Unauthorized" });

		return c.json({
			message: "Protected route",
		});
	});

app.onError(async (error, c) => {
	if (error instanceof HTTPException) {
		return c.json({ message: error.message }, error.status);
	}

	return c.json({ message: "Internal Server Error" }, 500);
});

export type AppType = typeof router;

export default app;
