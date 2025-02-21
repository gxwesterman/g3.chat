'use client'

import { db } from '@/lib/instant';
import Link from 'next/link';

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { isLoading, error, data } = db.useQuery({ chats: {} });
  if (isLoading) return <div>Fetching data...</div>;
  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <main className="relative flex w-full flex-1 flex-col ">
      <div className="absolute left-0">
        <div className="relative z-20 flex flex-col">
          <Link href='/chat'>Home</Link>
          {data.chats.map((chat) => (
            <Link href={`/chat/${chat.id}`} key={chat.id}>New Chat</Link>
          ))}
        </div>
      </div>
      {children}
    </main>
  );
}