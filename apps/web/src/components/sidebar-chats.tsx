"use client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { chatsQuery } from "@/services/queries/chats.query";

export function SidebarChats() {
	const { data: chats } = useQuery(chatsQuery);
	const pathname = usePathname();

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarGroupLabel>Your chats</SidebarGroupLabel>
			<SidebarMenu>
				{chats?.map((item) => (
					<SidebarMenuItem key={item.id}>
						<SidebarMenuButton
							asChild
							isActive={pathname === `/chat/${item.id}`}
						>
							<Link href={`/chat/${item.id}`}>
								<span>{item.title}</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
