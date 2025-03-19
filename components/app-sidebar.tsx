import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { db } from "@/lib/instant";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Chat = {
  id: string;
  messages: {
    id: string;
    text: string;
    type: string;
    createdAt: Date;
  }[];
};

export function AppSidebar({ chats }: { chats: Chat[] }) {
  const pathname = usePathname();
  const [activeChatId, setActiveChatId] = useState(
    pathname.split("/").pop() || ""
  );

  useEffect(() => {
    setActiveChatId(pathname.split("/").pop() || "");
  }, [pathname]);

  const deleteChat = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    chatId: string
  ) => {
    e.stopPropagation();
    db.transact(db.tx.chats[chatId].delete());
    const chat = chats.find((chat) => chat.id === chatId);
    if (chat) {
      db.transact(chat.messages.map((m) => db.tx.messages[m.id].delete()));
    }
    if (activeChatId === chatId) {
      console.log(activeChatId);
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
      <SidebarContent>
        <SidebarHeader className="flex items-center shrink-0 px-3 pt-3.5 pb-4 text-lg">
          <a
            className="hover:cursor-pointer font-semibold text-pink-200"
            onMouseDown={() => handleClick("")}
          >
            G3.chat
          </a>
        </SidebarHeader>
        <SidebarMenu className="px-3">
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
                  <div className="truncate max-w-[75%] font-semibold text-muted-foreground">{`${chat.messages[0].text}`}</div>
                  <button className="rounded-md p-1.5 hover:bg-destructive/50 hover:text-destructive-foreground absolute right-[-2rem] transition-all group-hover/item:right-1">
                    <X
                      className="h-4 w-4 text-muted-foreground"
                      onMouseDown={(e) => deleteChat(e, chat.id)}
                    />
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
