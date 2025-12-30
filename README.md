# Boby AI

This project is a modern TypeScript stack that combines Next.js, Hono, and more.

## Features

- **Turborepo** - Optimized monorepo build system
- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework (App Router)
- **Vercel AI SDK** - AI SDK for building chat interfaces and AI-powered features
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **shadcn/ui** - Reusable UI components built on Radix UI
- **Hono** - Lightweight, performant server framework
- **Hono RPC** - End-to-end type-safe API client for type-safe server-client communication
- **TanStack Query** - Powerful data synchronization for React (server state management)
- **Bun** - Runtime environment and package manager
- **Drizzle ORM** - TypeScript-first ORM with PostgreSQL
- **PostgreSQL** - Database engine (via Supabase)
- **Better-Auth** - Modern authentication library with OAuth support
- **Biome** - Fast linting and formatting

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/server/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:

```bash
bun run db:push
```

4. Seed the database with initial data:

```bash
bun run db:seed
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the web application.
The API is running at [http://localhost:3000](http://localhost:3000).

## Project Structure

This is a monorepo managed by Turborepo and Bun workspaces.

```
boby-ai/
├── apps/
│   ├── web/         # Frontend application (Next.js)
│   └── server/      # Backend API (Hono)
└── packages/
    ├── auth/        # Better-Auth configuration & logic
    ├── config/      # Shared TypeScript configuration
    ├── db/          # Drizzle schema & database setup
    └── shared/      # Shared utilities and types
```

### Apps

#### `apps/web` - Frontend Application

- **Framework**: Next.js 16 with App Router
- **UI Library**: shadcn/ui components built on Radix UI
- **AI Integration**: Vercel AI SDK (`@ai-sdk/react`) for chat interfaces
- **State Management**: TanStack Query for server state management
- **API Client**: Hono RPC client for end-to-end type-safe API calls
- **Styling**: TailwindCSS v4
- **Authentication**: Better-Auth client integration
- Runs on port **3001**

#### `apps/server` - Backend API

- **Framework**: Hono (lightweight web framework)
- **RPC**: Exports `AppType` for type-safe RPC client generation
- **Runtime**: Bun
- **AI Integration**: Vercel AI SDK with OpenRouter provider
- **Authentication**: Better-Auth server integration
- **API Routes**: `/health`, `/chats`, `/agents`, `/api/auth/*`
- Runs on port **3000**

### Packages

#### `packages/auth` - Authentication Package

- **Library**: Better-Auth
- **Features**:
  - Email/Password authentication
  - OAuth providers (Google, GitHub)
  - Drizzle adapter for PostgreSQL
- **Location**: `packages/auth/src/index.ts`

#### `packages/db` - Database Package

- **ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Schema**:
  - Auth schemas (users, sessions, accounts)
  - Public schemas (chats, messages, agents)
- **Scripts**: Database migrations, seeding, studio access
- **Location**: `packages/db/src/`

#### `packages/shared` - Shared Utilities

- Shared types and utilities used across apps
- AI-related types (UIMessage, metadata)
- Agent utilities and error handling
- Unique ID generation
- **Exports**: Types and utilities available to both web and server apps

#### `packages/config` - Shared Configuration

- Base TypeScript configuration (`tsconfig.base.json`)
- Shared compiler options used across all packages
- Ensures consistent TypeScript settings throughout the monorepo

## Available Scripts

### Development

- `bun run dev` - Start all applications in development mode (web + server via Turborepo)
- `bun run dev:web` - Start only the Next.js web application (port 3001)
- `bun run dev:server` - Start only the Hono server (port 3000)

### Build & Type Checking

- `bun run build` - Build all applications (uses Turborepo for parallel builds)
- `bun run check-types` - Check TypeScript types across all apps and packages

### Database

- `bun run db:push` - Push Drizzle schema changes directly to PostgreSQL (development)
- `bun run db:generate` - Generate Drizzle migration files from schema changes
- `bun run db:migrate` - Run database migrations
- `bun run db:studio` - Open Drizzle Studio (database GUI at http://localhost:4983)
- `bun run db:seed` - Seed the database with initial data

### Code Quality

- `bun run check` - Run Biome formatter and linter (checks and fixes code)

## Deployment

### Build the Docker Image

Build the Docker image for the server application:

```sh
docker build \
  --platform linux/amd64 \
  -t boby-ai-api:v1 \
  -f apps/server/Dockerfile \
  --load \
  .
```

### Tag the Image for Google Artifact Registry

Tag the locally built image with the full registry path:

```sh
docker tag boby-ai-api:v1 \
europe-central2-docker.pkg.dev/dev-test-397700/boby-ai-api/boby-ai-api:v1
```

### Push the Image to the Registry

Push the tagged image to Google Artifact Registry:

```sh
docker push \
europe-central2-docker.pkg.dev/dev-test-397700/boby-ai-api/boby-ai-api:v1
```

### Alternative: Build and Push in One Command

You can combine the build and push steps into a single command:

```sh
docker build \
  --platform linux/amd64 \
  -t europe-central2-docker.pkg.dev/dev-test-397700/boby-ai-api/boby-ai-api:v1 \
  -f apps/server/Dockerfile \
  --push \
  .
```

### Deploy to Google Cloud Run

Deploy the containerized application to Google Cloud Run:

```sh
gcloud run deploy boby-ai-api \
  --image europe-central2-docker.pkg.dev/dev-test-397700/boby-ai-api/boby-ai-api:v1 \
  --region europe-central2 \
  --platform managed \
  --allow-unauthenticated
```
