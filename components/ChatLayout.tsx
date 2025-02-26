'use client'

import ChatForm from '@/components/ChatForm';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="relative flex w-full flex-1 flex-col h-[100dvh]">
        <SidebarTrigger />
        <ChatForm />
        {children}
      </main>
    </SidebarProvider>
  );
}