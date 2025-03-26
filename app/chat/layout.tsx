"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { CustomTrigger } from "@/components/CustomTrigger";
import { AppSidebar } from "@/components/app-sidebar";
import { db } from "@/lib/instant";
import { usePathname } from "next/navigation";
import Chat from "@/components/Chat";
import { Border } from "@/components/Border";
import { useEffect, useState } from "react";

export default function ChatLayout() {

  const [sessionId, setSessionId] = useState('');
  const pathname = usePathname();
  const pageChatId = pathname.split("/").pop() || "";

  useEffect(() => {
    const cookies = document.cookie.split(';');
    const userIdCookie = cookies.find(cookie => cookie.trim().startsWith('session='));
    const extractedUserId = userIdCookie ? userIdCookie.split('=')[1].trim() : '';
    setSessionId(extractedUserId);
  }, [])

  const chatsQuery = {
    chats: {
      $: {
        where: {
          sessionId: sessionId
        }
      },
      messages: {},
    },
  };

  const { isLoading, error, data } = db.useQuery(chatsQuery);
  if (isLoading) return <div></div>;
  if (error) return <div>Error fetching data: {error.message}</div>;

  const chat = data.chats.find((chat) => chat.id === pageChatId);
  if (!chat) { window.history.pushState({}, "", "/chat"); }
  const messages = chat ? chat.messages : [];

  return (
    <SidebarProvider>
      <div className="absolute inset-0 bg-sidebar !fixed z-0">
        <div className="absolute inset-0 opacity-40 background-gradient"></div>
        <div className="absolute inset-0 bg-noise"></div>
        <div className="absolute inset-0 dark:bg-black/40"></div>
      </div>
      <AppSidebar chats={data.chats} />
      <main className="relative flex w-full flex-1 flex-col overflow-hidden transition-[width,height]">
        <Border />
        <CustomTrigger />
        <Chat messages={messages} />
      </main>
    </SidebarProvider>
  );
}
