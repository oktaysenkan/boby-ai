import { db, eq, schema } from "@boby-ai/db";

export const getAgents = async () => {
  const result = await db
    .select({
      id: schema.agent.id,
      slug: schema.agent.slug,
      name: schema.agent.name,
      description: schema.agent.description,
    })
    .from(schema.agent);

  return result;
};

export const getAgentBySlug = async (slug: string) => {
  const agent = await db.query.agent.findFirst({
    where: eq(schema.agent.slug, slug),
  });

  return agent;
};
