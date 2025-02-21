'use client'

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { init, id } from '@instantdb/react';
import { usePathname } from "next/navigation";
import Link from 'next/link'

const db = init({
  appId: "7ac1af9c-32c3-4106-a98b-8cdc64a8c4bf",
});

function addMessage(text: string, chatId: string) {
  db.transact(
    db.tx.messages[id()].update({
      chatId,
      text,
      createdAt: new Date(),
    }),
  );
}

function startChat(id: string) {
  const newChat = db.transact(
    db.tx.chats[id].update({
      createdAt: new Date(),
    }),
  );
  return newChat;
}

export default function HomePage() {

  const pathname = usePathname();
  const [pageChatId] = useState(pathname.split('/').pop() || id());
  const [input, setInput] = useState('');
  const lauremIpsom = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      ((e.key === 'Enter' || e.key === 'NumpadEnter') && !e.shiftKey)
    ) {
      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pathname === '/') {
      startChat(pageChatId);
      window.history.pushState({}, '', window.location.href + `chat/${pageChatId}`);
    }
    addMessage(input, pageChatId);
    setInput('');
  }

  const messagesQuery = {
    $: {
      where: {
        chatId: pageChatId
      }
    }
  };

  const { isLoading, error, data } = db.useQuery({ chats: {}, messages: messagesQuery });
  if (isLoading) return <div>Fetching data...</div>;
  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <main className="relative flex w-full flex-1 flex-col ">
      <div className="absolute left-0">
        <div className="relative z-20 flex flex-col">
          {pageChatId}
          {data.chats.map((chat) => (
            <Link href={`/chat/${chat.id}`} key={chat.id}>New Chat</Link>
          ))}
        </div>
      </div>
      <div className="absolute bottom-10 w-full pr-2">
        <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col text-center">
          <form
            className="flex items-center gap-2 bg-secondary rounded"
            onSubmit={handleSubmit}
          >
            <Textarea
              name="message"
              className="grow resize-none border-none outline-none text-base shadow-none focus-visible:ring-0"
              placeholder="Type your message here..."
              onKeyDown={handleKeyDown}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              className="mr-3"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </div>
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="scrollbar scrollbar-w-2 scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600 h-[100dvh] overflow-y-auto pb-[140px]">
          <div className="mx-auto flex w-full max-w-3xl flex-col space-y-12 p-4 pb-8">
            <div className="flex justify-end">
              <div className="group relative inline-block max-w-[80%] break-words rounded bg-secondary p-4 text-left">
                {data.messages.map((message) => (
                  <div key={message.id}>{message.text}</div>
                ))}
              </div>
            </div>
            <div className="flex justify-start">
              <div className="group relative w-full max-w-full break-words">
                <div className="prose prose-neutral prose-invert max-w-none prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </main>
  );
}
