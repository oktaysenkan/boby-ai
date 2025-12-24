"use client";
import type * as React from "react";
import { SidebarNavigation } from "@/components/sidebar-navigation";
import { SidebarUser } from "@/components/sidebar-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
} from "@/components/ui/sidebar";
import type { authClient } from "@/lib/auth-client";

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
	session: typeof authClient.$Infer.Session;
};

export function AppSidebar({ session, ...props }: AppSidebarProps) {
	return (
		<Sidebar variant="inset" {...props}>
			<SidebarContent>
				<SidebarNavigation />
			</SidebarContent>
			<SidebarFooter>
				<SidebarUser session={session} />
			</SidebarFooter>
		</Sidebar>
	);
}
