import "dotenv/config";
import { auth } from "@boby-ai/auth";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
	convertToModelMessages,
	createUIMessageStream,
	createUIMessageStreamResponse,
	streamText,
} from "ai";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

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
	.post("/chat", async (c) => {
		const user = c.get("user");

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

		const body = await c.req.raw.json();

		const messages = await convertToModelMessages(body.messages);

		const result = streamText({
			model: chatModel,
			messages,
		});

		return result.toUIMessageStreamResponse();
	})
	.get("/protected", (c) => {
		const user = c.get("user");

		if (!user) return c.json({ message: "Unauthorized" }, 401);

		return c.json({
			message: "Protected route",
		});
	});

export type AppType = typeof router;

export default app;
