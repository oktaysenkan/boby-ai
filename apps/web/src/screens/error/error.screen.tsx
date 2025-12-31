"use client";

import { formatError } from "@boby-ai/shared";
import { AlertTriangle } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export type ErrorScreenProps = {
  error: Error | string;
};

const ErrorScreen = ({ error }: ErrorScreenProps) => {
  return (
    <div className="flex h-dvh items-center justify-center p-4">
      <Empty className="mx-auto max-w-md border border-destructive/30 bg-destructive/5">
        <EmptyHeader>
          <EmptyMedia
            variant="icon"
            className="bg-destructive/10 text-destructive"
          >
            <AlertTriangle />
          </EmptyMedia>
          <EmptyTitle className="text-destructive">
            {formatError(error)}
          </EmptyTitle>
        </EmptyHeader>
      </Empty>
    </div>
  );
};

export default ErrorScreen;
