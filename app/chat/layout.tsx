"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { CustomTrigger } from "@/components/CustomTrigger";
import { AppSidebar } from "@/components/app-sidebar";
import { db } from "@/lib/instant";
import { usePathname } from "next/navigation";
import Chat from "@/components/Chat";
import { Border } from "@/components/Border";

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
      <div className="absolute inset-0 dark:bg-sidebar !fixed z-0">
        <div className="absolute inset-0 opacity-40" style={{backgroundImage: "radial-gradient(closest-corner at 120px 36px, rgba(255, 1, 111, 0.19), rgba(255, 1, 111, 0.08)), linear-gradient(rgb(63, 51, 69) 15%, rgb(7, 3, 9))"}}></div>
        <div className="absolute inset-0 bg-noise"></div>
        <div className="absolute inset-0 bg-black/40"></div>
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
