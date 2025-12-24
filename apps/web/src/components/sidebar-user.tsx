"use client";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

export type SidebarUserProps = {
	session: typeof authClient.$Infer.Session;
};

export function SidebarUser({ session }: SidebarUserProps) {
	const router = useRouter();

	const fallbackAvatar = React.useMemo(() => {
		return session.user.name
			.split(" ")
			.slice(0, 2)
			.map((word) => word.charAt(0))
			.join("")
			.toUpperCase();
	}, [session.user.name]);

	const handleLogout = React.useCallback(() => {
		authClient.signOut({
			fetchOptions: {
				onSuccess: () => router.replace("/login"),
			},
		});
	}, [router.replace]);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								{session.user.image && (
									<AvatarImage
										src={session.user.image}
										alt={session.user.name}
									/>
								)}
								<AvatarFallback className="rounded-lg">
									{fallbackAvatar}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">
									{session.user.name ?? ""}
								</span>
								<span className="truncate text-xs">
									{session.user.email ?? ""}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={"top"}
					>
						<DropdownMenuGroup>
							<DropdownMenuItem onClick={handleLogout}>
								<LogOut />
								Log out
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
