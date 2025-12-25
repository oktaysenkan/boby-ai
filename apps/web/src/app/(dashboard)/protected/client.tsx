"use client";

import { Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getQueryClient } from "@/lib/query-client";
import { useProtected } from "@/services/queries/protected.query";

const Client = () => {
	const { data, isFetching } = useProtected();
	const queryClient = getQueryClient();

	const handleUpdate = () => {
		queryClient.invalidateQueries({ queryKey: ["protected"] });
	};

	const handleOptimisticUpdate = () => {
		queryClient.setQueryData(["protected"], (oldData: any) => {
			return {
				...oldData,
				message: "Optimistic update",
			};
		});
	};

	return (
		<Card>
			<CardHeader className="relative">
				<CardTitle>CLIENT RESPONSE</CardTitle>
				{isFetching && (
					<Loader className="absolute top-0 right-4 size-4 animate-spin" />
				)}
			</CardHeader>
			<CardContent>
				<pre>{JSON.stringify(data, null, 2)}</pre>
			</CardContent>
			<CardFooter className="flex justify-end gap-2">
				<Button size="sm" onClick={handleUpdate}>
					Update
				</Button>
				<Button size="sm" onClick={handleOptimisticUpdate}>
					Optimistic Update
				</Button>
			</CardFooter>
		</Card>
	);
};

export default Client;
