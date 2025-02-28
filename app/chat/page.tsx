'use client'

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { db } from '@/lib/instant';
import ChatForm from '@/components/ChatForm';
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm";

export default function Page() {

  const pathname = usePathname();
  const pageChatId = pathname.split('/').pop() || '';
  const lauremIpsom = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
  const [output, setOutput] = useState('');

  const messagesQuery = {
    $: {
      where: {
        chatId: pageChatId
      }
    }
  };

  const { isLoading, error, data } = db.useQuery({ messages: messagesQuery });
  if (isLoading) return <div></div>;
  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <div className="relative flex-1 overflow-hidden">
      <ChatForm setOutput={setOutput} />
      <div className="scrollbar scrollbar-w-2 scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600 h-[100dvh] overflow-y-auto pb-[140px]">
        <div className="mx-auto flex w-full max-w-3xl flex-col space-y-12 p-4 pb-8">
          {data.messages.map((message) => (
              <div key={message.id} className="chat-content">
                  {
                      message.type === 'question' ? 
                      (
                          <div className="flex justify-end">
                              <div className="group relative inline-block max-w-[80%] break-words rounded bg-secondary p-4 text-left">
                                  <div>{message.text}</div>
                              </div>
                          </div>
                      )
                  :
                      (
                          <div className="flex justify-start">
                              <div className="group relative w-full max-w-full break-words">
                                  <div className="space-y-4 prose prose-neutral prose-invert max-w-none prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.text}</ReactMarkdown>
                                  </div>
                              </div>
                          </div>
                      )
                  }
              </div>
          ))}
          <div className="flex justify-start">
              <div className="group relative w-full max-w-full break-words">
                  <div className="prose prose-neutral prose-invert max-w-none prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
