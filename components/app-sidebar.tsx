import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/instant";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Chat = {
  id: string;
  title: string;
  messages: {
    id: string;
    text: string;
    type: string;
    createdAt: Date;
  }[];
};

export function AppSidebar({ chats }: { chats: Chat[] }) {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const [activeChatId, setActiveChatId] = useState(
    pathname.split("/").pop() || ""
  );

  useEffect(() => {
    setActiveChatId(pathname.split("/").pop() || "");
  }, [pathname]);

  const deleteChat = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    chatId: string
  ) => {
    e.stopPropagation();
    db.transact(db.tx.chats[chatId].delete());
    const chat = chats.find((chat) => chat.id === chatId);
    if (chat) {
      db.transact(chat.messages.map((m) => db.tx.messages[m.id].delete()));
    }
    if (activeChatId === chatId) {
      window.history.pushState({}, "", "/chat");
    }
  };

  const handleClick = (chatId: string) => {
    if (chatId !== activeChatId) {
      setActiveChatId(chatId);
    }
    if (chatId) {
      window.history.pushState({}, "", `/chat/${chatId}`);
    } else {
      window.history.pushState({}, "", "/chat");
    }
  };

  return (
    <Sidebar className="border-none">
      {isMobile &&
        <div className="absolute inset-0 -z-50 bg-sidebar">
          <div className="absolute inset-0 opacity-40 background-gradient"></div>
          <div className="absolute inset-0 bg-noise"></div>
          <div className="absolute inset-0 dark:bg-black/40"></div>
        </div>
      }
      <SidebarContent className="px-1">
        <SidebarHeader className="flex items-center shrink-0 px-3 pt-3.5 pb-1 text-lg">
          <a
            className="hover:cursor-pointer font-semibold text-pink-700 dark:text-pink-200"
            onMouseDown={() => handleClick("")}
          >
            G3.chat
          </a>
        </SidebarHeader>
        <SidebarMenu className="px-3">
          <Button onClick={() =>window.history.pushState({}, "", "/chat")} className="font-bold rounded-lg text-background dark:text-pink-200 bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 p-2 shadow border-reflect button-reflect relative hover:bg-[#d56698] active:bg-[rgb(162,59,103)] dark:active:bg-pink-800/40">New Chat</Button>
          <div className="border-b border-border my-4"></div>
          {chats.map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <SidebarMenuButton
                isActive={activeChatId === chat.id}
                asChild
                className="py-[1.125rem] group/item relative rounded-lg"
              >
                <a
                  onMouseDown={() => handleClick(chat.id)}
                  key={chat.id}
                  className="hover:cursor-pointer hover:bg-sidebar-accent flex items-center justify-between"
                >
                  <div className="truncate max-w-[75%] font-semibold text-muted-foreground">{`${chat.title}`}</div>
                  <button
                    className="rounded-md p-1.5 hover:bg-pink-800/50 hover:text-destructive-foreground absolute right-[-2rem] transition-all group-hover/item:right-1"
                    onMouseDown={(e) => deleteChat(e, chat.id)}
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
