"use client"

import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { db } from '@/lib/instant';
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from 'lucide-react';
 
export function AppSidebar() {

  const pathname = usePathname();
  const [activeChatId, setActiveChatId] = useState(pathname.split('/').pop() || '');

  useEffect(() => {
    setActiveChatId(pathname.split('/').pop() || '');
  }, [pathname]);

  const chatsQuery = {
    chats: {
      messages: {}
    },
  };

  const { isLoading, error, data } = db.useQuery(chatsQuery);
  if (isLoading) return <div></div>;
  if (error) return <div>Error fetching data: {error.message}</div>;

  const deleteChat = (e: React.MouseEvent<SVGSVGElement, MouseEvent>, chatId: string) => {
    e.stopPropagation();
    db.transact(db.tx.chats[chatId].delete());
    const chat = data.chats.find(chat => chat.id === chatId);
    chat && db.transact(chat.messages.map((m) => db.tx.messages[m.id].delete()));
    if (activeChatId === chatId) {
      window.history.pushState({}, '', '/chat');
    }
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader className="pt-5 px-3">
          <a className="hover:cursor-pointer" onClick={() => window.history.pushState({}, '', '/chat')}>G3 Chat</a>
        </SidebarHeader>
        <SidebarMenu className="px-3">
          {data.chats.map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <SidebarMenuButton isActive={activeChatId === chat.id} asChild className="py-5 group/item">
                <a onClick={() => window.history.pushState({}, '', `/chat/${chat.id}`)} key={chat.id} className="hover:cursor-pointer flex items-center justify-between">
                  <div>New Chat</div>
                  <X className="opacity-0 group-hover/item:opacity-100" onClick={(e) => deleteChat(e, chat.id)} />
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}