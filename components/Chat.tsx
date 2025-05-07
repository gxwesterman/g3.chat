"use client";

import React, { useRef, useEffect } from "react";
import ChatForm from "@/components/ChatForm";
import { usePathname } from "next/navigation";
import { Message } from "@/lib/types";
import ReactMarkdown from "react-markdown";

export default function Chat({ messages }: { messages: Message[] }) {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);

  const renderMarkdown = (content: string) => {
    return <ReactMarkdown>{content}</ReactMarkdown>;
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scroll({
        top: scrollRef.current.scrollHeight,
        behavior: "instant"
      })
    }
  }, [pathname]);

  return (
    <div className="absolute bottom-0 top-0 w-full">
      <ChatForm
        messages={messages}
      />
      <div
        ref={scrollRef}
        key={pathname}
        className="scrollbar scrollbar-w-2 scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600 absolute inset-0 overflow-y-scroll pt-3.5 pb-[144px]"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col space-y-12 p-4 pb-8">
          {messages.map((message) => {
            return (
              <div key={message.id}>
                {message.type === "question" ? (
                  <div className="flex justify-end">
                    <div className="group relative inline-block max-w-[80%] break-words rounded-2xl border border-secondary/50 bg-secondary/50 p-4 text-left">
                      <div className="prose prose-pink prose-invert max-w-none prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0">
                        {renderMarkdown(message.text)}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start chat-content">
                    <div className="group relative w-full max-w-full break-words">
                      <div className="space-y-4 prose prose-pink prose-invert max-w-none prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0">
                        {renderMarkdown(message.text)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}