import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { db } from '@/lib/instant';
import Link from 'next/link';
 
export function AppSidebar() {

  const { isLoading, error, data } = db.useQuery({ chats: {} });
  if (isLoading) return <div></div>;
  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarHeader>
          <Link href='/chat'>G3 Chat</Link>
        </SidebarHeader>
        <SidebarMenu>
          {data.chats.map((chat) => (
            <SidebarMenuItem key={chat.id}>
              <SidebarMenuButton>
                <Link href={`/chat/${chat.id}`} key={chat.id}>New Chat</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}