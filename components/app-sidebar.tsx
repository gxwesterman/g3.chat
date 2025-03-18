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
    <Sidebar className="border-r border-neutral-700">
      <SidebarContent className="bg-background">
        <SidebarHeader className="flex shrink-0 px-3 pt-4 text-lg">
          <a
            className="hover:cursor-pointer font-light text-neutral-200"
            onMouseDown={() => handleClick("")}
          >
            G3 Chat
          </a>
        </SidebarHeader>
        <SidebarMenu className="px-3">
          {chats.map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <SidebarMenuButton
                isActive={activeChatId === chat.id}
                asChild
                className="py-5 group/item relative"
              >
                <a
                  onMouseDown={() => handleClick(chat.id)}
                  key={chat.id}
                  className="hover:cursor-default hover:bg-sidebar-accent/40 flex items-center justify-between"
                >
                  <div className="truncate max-w-[75%]">{`${chat.messages[0].text}`}</div>
                  <X
                    className="hover:cursor-pointer absolute right-[-1rem] transition-all group-hover/item:right-2"
                    onClick={(e) => deleteChat(e, chat.id)}
                  />
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
