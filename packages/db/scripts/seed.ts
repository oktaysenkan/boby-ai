import { agent } from "@boby-ai/db/schema/public";
import { createId } from "@boby-ai/shared";
import { db } from "../src";

const main = async () => {
	console.log("Seeding database...");

	await db.insert(agent).values([
		{
			id: createId(),
			slug: "coding-guru",
			name: "Coding Guru",
			description: "A coding guru that can help you with your code.",
			systemPrompt: "You are a coding guru that can help you with your code.",
		},
		{
			id: createId(),
			slug: "health-advisor",
			name: "Health Advisor",
			description: "A health advisor that can help you with your health.",
			systemPrompt:
				"You are a health advisor that can help you with your health.",
		},
		{
			id: createId(),
			slug: "financial-advisor",
			name: "Financial Advisor",
			description: "A financial advisor that can help you with your finances.",
			systemPrompt:
				"You are a financial advisor that can help you with your finances.",
		},
		{
			id: createId(),
			slug: "travel-planner",
			name: "Travel Planner",
			description: "A travel planner that can help you with your travel.",
			systemPrompt:
				"You are a travel planner that can help you with your travel.",
		},
	]);

	console.log("Database seeded successfully");
};

main();
