import "dotenv/config";
import { auth } from "@boby-ai/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

type HonoEnv = {
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null;
	};
};

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
	.get("/protected", (c) => {
		const user = c.get("user");

		if (!user) {
			return c.json(
				{
					message: "Unauthorized",
				},
				401,
			);
		}

		return c.json({
			message: "Protected route",
		});
	});

export type AppType = typeof router;

export default app;
