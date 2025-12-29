import { json, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const chat = pgTable("chat", {
	id: text("id").primaryKey().notNull(),
	title: text("title").notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	messages: json("messages").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

export const agent = pgTable("agent", {
	id: text("id").primaryKey().notNull(),
	slug: text("slug").notNull().unique(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	systemPrompt: text("system_prompt").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});
