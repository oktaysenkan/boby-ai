import { QueryClientProvider } from "@tanstack/react-query";
import type React from "react";
import { getQueryClient } from "@/lib/query-client";

const QueryProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
