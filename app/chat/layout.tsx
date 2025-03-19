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
      <main className="relative flex w-full flex-1 flex-col overflow-hidden transition-[width,height]">
        <div className="absolute bottom-0 top-0 w-full translate-y-3.5 overflow-hidden rounded-tl-xl border-l border-t border-chat-border bg-chat-background bg-fixed pb-[140px] transition-all ease-snappy">
          <div className="bg-noise absolute inset-0 -top-3.5 bg-fixed transition-transform ease-snappy [background-position:right_bottom]"></div>
        </div>
        <div className="absolute inset-x-3 top-0 z-10 box-content h-3.5 overflow-hidden border-b border-chat-border bg-gradient-noise-top backdrop-blur-md transition-[transform,border] ease-snappy">
          <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-gradient-noise-top to-transparent"></div>
          <div className="absolute right-24 top-0 h-full w-8 bg-gradient-to-l from-gradient-noise-top to-transparent"></div>
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-noise-top"></div>
        </div>
        <CustomTrigger />
        <Chat messages={messages} />
      </main>
    </SidebarProvider>
  );
}
