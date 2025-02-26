import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { db } from '@/lib/instant';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useState } from "react";
 
export function AppSidebar() {

  const pathname = usePathname();
  const pageChatId = (pathname.split('/').pop() || '');
  const [activeChatId, setActiveChatId] = useState(pageChatId);

  const { isLoading, error, data } = db.useQuery({ chats: {} });
  if (isLoading) return <div></div>;
  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader className="pt-5 px-3">
          <Link href='/chat'>G3 Chat</Link>
        </SidebarHeader>
        <SidebarMenu className="px-3">
          {data.chats.map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <SidebarMenuButton isActive={activeChatId === chat.id} asChild className="py-5" onClick={() => setActiveChatId(chat.id)}>
                <Link href={`/chat/${chat.id}`} key={chat.id}>New Chat</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}