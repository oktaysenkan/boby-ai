"use client";

import { AlertTriangle } from "lucide-react";
import {
	Empty,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

const ErrorPage = ({ error }: { error: Error }) => {
	return (
		<div className="flex h-full items-center justify-center">
			<Empty className="mx-auto max-w-md border border-destructive/30 bg-destructive/5">
				<EmptyHeader>
					<EmptyMedia
						variant="icon"
						className="bg-destructive/10 text-destructive"
					>
						<AlertTriangle />
					</EmptyMedia>
					<EmptyTitle className="text-destructive">
						{error.message ?? "An error occurred"}
					</EmptyTitle>
				</EmptyHeader>
			</Empty>
		</div>
	);
};

export default ErrorPage;
