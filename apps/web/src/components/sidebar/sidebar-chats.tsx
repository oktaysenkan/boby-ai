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
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { chatsQuery } from "@/services/queries/chats.query";

export function SidebarChats() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const { data: chats } = useQuery(chatsQuery);

  const displayedChats = chats?.slice(0, 10);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Your chats</SidebarGroupLabel>
      <SidebarMenu>
        {displayedChats?.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              asChild
              isActive={pathname === `/chat/${item.id}`}
              onClick={() => isMobile && setOpenMobile(false)}
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
