import { auth } from "@boby-ai/auth";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

type URL = string | RegExp;

type IgnoredPath = {
  path: URL;
  methods: string[];
};

const PUBLIC_PATHS: URL[] = ["/", "/health"];

const IGNORED_PATHS: IgnoredPath[] = [
  // /chat POST request should be handled by stream response not json response
  {
    path: "/chats",
    methods: ["POST"],
  },
  // better-auth API should be ignored
  {
    path: /^\/api\/auth\/.+$/,
    methods: ["*"],
  },
];

const authMiddleware = createMiddleware(async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (session) {
    c.set("user", session?.user);
    c.set("session", session?.session);
  }

  const isPublicPath = PUBLIC_PATHS.some((path) =>
    typeof path === "string" ? path === c.req.path : path.test(c.req.path),
  );

  if (isPublicPath) return next();

  const isIgnoredPath = IGNORED_PATHS.some((path) => {
    const pathMatches =
      typeof path.path === "string"
        ? path.path === c.req.path
        : path.path.test(c.req.path);

    return (
      pathMatches &&
      (path.methods.includes(c.req.method) || path.methods.includes("*"))
    );
  });

  if (isIgnoredPath) return next();

  if (!session)
    throw new HTTPException(403, { message: "Authentication required" });

  await next();
});

export default authMiddleware;
