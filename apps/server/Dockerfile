FROM oven/bun:alpine AS base

FROM base AS builder

RUN apk add --no-cache gcompat
WORKDIR /app

COPY . .

RUN ls -al

RUN bun install --frozen-lockfile

WORKDIR /app/apps/server
RUN bun run build

FROM base AS runner

RUN apk add --no-cache gcompat
WORKDIR /app

COPY --from=builder /app/apps/server ./apps/server
COPY --from=builder /app/node_modules ./node_modules
COPY package.json bun.lock bunfig.toml ./

WORKDIR /app/apps/server

RUN ls

EXPOSE 3000

CMD ["bun", "run", "start"]
