export const getAgentName = (slug: string | undefined) => {
	if (slug === "coding-guru") return "Coding Guru";
	if (slug === "health-advisor") return "Health Advisor";
	if (slug === "financial-advisor") return "Financial Advisor";
	if (slug === "travel-planner") return "Travel Planner";
	return "Agent";
};
