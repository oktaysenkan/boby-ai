import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getQueryClient } from "@/lib/query-client";
import { protectedQuery } from "@/services/queries/protected.query";
import Client from "./client";

export default async function Home() {
	const queryClient = getQueryClient();
	const data = await queryClient.fetchQuery(protectedQuery);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className="flex flex-col gap-4 p-4">
				<Card>
					<CardHeader>
						<CardTitle>SERVER RESPONSE</CardTitle>
					</CardHeader>
					<CardContent>
						<pre>{JSON.stringify(data, null, 2)}</pre>
					</CardContent>
				</Card>
				<Client />
			</div>
		</HydrationBoundary>
	);
}
