import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

	const session = await authClient.getSession({
		fetchOptions: {
			headers: await headers(),
			throw: true,
		},
	});

	if (!session?.user) {
		throw redirect("/login");
	}

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<AppSidebar session={session} />
			<SidebarInset className="h-screen overflow-x-hidden">
				<header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b-[0.5px] bg-background">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 overflow-y-hidden">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
};

export default DashboardLayout;
