"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { CustomTrigger } from "@/components/CustomTrigger";
import { AppSidebar } from "@/components/app-sidebar";
import { db } from "@/lib/instant";
import { usePathname } from "next/navigation";
import Chat from "@/components/Chat";

export default function ChatLayout() {
  const pathname = usePathname();
  const pageChatId = pathname.split("/").pop() || "";

  const chatsQuery = {
    chats: {
      messages: {},
    },
  };

  const { isLoading, error, data } = db.useQuery(chatsQuery);
  if (isLoading) return <div></div>;
  if (error) return <div>Error fetching data: {error.message}</div>;

  const chat = data.chats.find((chat) => chat.id === pageChatId);
  const messages = chat ? chat.messages : [];

  return (
    <SidebarProvider>
      <AppSidebar chats={data.chats} />
      <main className="relative flex w-full flex-1 flex-col h-[100dvh]">
        <CustomTrigger />
        <Chat messages={messages} />
      </main>
    </SidebarProvider>
  );
}
