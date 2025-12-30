"use client";
import Link from "next/link";
import type * as React from "react";
import Logo from "@/components/icons/logo";
import { SidebarChats } from "@/components/sidebar/sidebar-chats";
import { SidebarNavigation } from "@/components/sidebar/sidebar-navigation";
import { SidebarUser } from "@/components/sidebar/sidebar-user";
import ThemeSwitcher from "@/components/sidebar/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import type { authClient } from "@/lib/auth-client";

export type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  session: typeof authClient.$Infer.Session;
};

export function AppSidebar({ session, ...props }: AppSidebarProps) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="flex w-full flex-row items-center justify-between">
        <Button variant="link" size="icon" asChild>
          <Link href="/">
            <Logo className="size-8" />
          </Link>
        </Button>
        <ThemeSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation />
        <SidebarChats />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser session={session} />
      </SidebarFooter>
    </Sidebar>
  );
}
