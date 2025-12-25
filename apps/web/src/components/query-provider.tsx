import { QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { getQueryClient } from "@/lib/query-client";

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<QueryClientProvider client={getQueryClient()}>
			{children}
		</QueryClientProvider>
	);
};

export default QueryProvider;
