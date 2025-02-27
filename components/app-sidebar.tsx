import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { db } from '@/lib/instant';
import Link from 'next/link';
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from 'lucide-react';
 
export function AppSidebar() {

  const pathname = usePathname();
  const [activeChatId, setActiveChatId] = useState(pathname.split('/').pop() || '');

  useEffect(() => {
    setActiveChatId(pathname.split('/').pop() || '');
  }, [pathname]);

  const { isLoading, error, data } = db.useQuery({ chats: {}, messages: {} });
  if (isLoading) return <div></div>;
  if (error) return <div>Error fetching data: {error.message}</div>;

  const deleteChat = (e: React.MouseEvent<SVGSVGElement, MouseEvent>, chatId: string) => {
    e.preventDefault();
    db.transact(db.tx.chats[chatId].delete());
    db.transact(data.messages.filter((message) => message.chatId === chatId).map((m) => db.tx.messages[m.id].delete()));
    if (activeChatId === chatId) {
      window.history.pushState({}, '', '/chat');
    }
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader className="pt-5 px-3">
          <Link href='/chat' onClick={() => setActiveChatId('')}>G3 Chat</Link>
        </SidebarHeader>
        <SidebarMenu className="px-3">
          {data.chats.map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <SidebarMenuButton isActive={activeChatId === chat.id} asChild className="py-5" onClick={() => setActiveChatId(chat.id)}>
                <Link href={`/chat/${chat.id}`} key={chat.id} className="flex items-center justify-between">
                  <div>New Chat</div>
                  <X onClick={(e) => deleteChat(e, chat.id)} />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}