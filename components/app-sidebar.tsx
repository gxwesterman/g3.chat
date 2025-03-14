import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { db } from '@/lib/instant';
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from 'lucide-react';
import { Message } from '@/lib/types';

type Chat =  {
    id: string;
    messages: {
      id: string;
      text: string;
      type: string;
      createdAt: Date;
    }[];
};
 
export function AppSidebar({ chats, setOldMessages }: { chats: Chat[], setOldMessages: (oldMessages: Message[]) => void }) {

  const pathname = usePathname();
  const [activeChatId, setActiveChatId] = useState(pathname.split('/').pop() || '');

  useEffect(() => {
    setActiveChatId(pathname.split('/').pop() || '');
  }, [pathname]);

  const deleteChat = (e: React.MouseEvent<SVGSVGElement, MouseEvent>, chatId: string) => {
    e.stopPropagation();
    db.transact(db.tx.chats[chatId].delete());
    const chat = chats.find(chat => chat.id === chatId);
    if (chat) {
      db.transact(chat.messages.map((m) => db.tx.messages[m.id].delete()));
    }
    if (activeChatId === chatId) {
      window.history.pushState({}, '', '/chat');
    }
  }

  const handleClick = (chatId: string) => {
    setActiveChatId(chatId);
    if (chatId !== activeChatId) {
      setOldMessages([]);
    }
    if (chatId) {
      window.history.pushState({}, '', `/chat/${chatId}`);
    } else {
      window.history.pushState({}, '', '/chat');
    }
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader className="pt-5 px-3">
          <a className="hover:cursor-pointer" onMouseDown={() => handleClick('')}>G3 Chat</a>
        </SidebarHeader>
        <SidebarMenu className="px-3">
          {chats.map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <SidebarMenuButton isActive={activeChatId === chat.id} asChild className="py-5 group/item">
                <a onMouseDown={() => handleClick(chat.id)} key={chat.id} className="hover:cursor-pointer hover:bg-sidebar-accent/40 flex items-center justify-between">
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