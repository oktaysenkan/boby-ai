"use client";

import QueryProvider from "./query-provider";
import ThemeProvider from "./theme-provider";
import { Toaster } from "./ui/sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<QueryProvider>{children}</QueryProvider>
			<Toaster richColors />
		</ThemeProvider>
	);
}
