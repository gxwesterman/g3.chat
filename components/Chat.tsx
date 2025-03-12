'use client'

import { useState, useRef, useEffect } from "react";
import ChatForm from '@/components/ChatForm';
import { usePathname } from "next/navigation";
import { MemoizedMarkdown } from '@/components/memoized-markdown';

type Message = {
  id: string;
  chatId: string,
  text: string,
  type: string,
};

export default function Chat({ messages }: { messages: Message[] }) {

  const pathName = usePathname();
  const [output, setOutput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [pathName]);

  return (
    <div className="relative flex-1 overflow-hidden">
      <ChatForm messages={messages} output={output} setOutput={setOutput} />
      <div className="scrollbar scrollbar-w-2 scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600 h-[100dvh] overflow-y-auto pb-[140px]">
        <div className="mx-auto flex w-full max-w-3xl flex-col space-y-12 p-4 pb-8 text-foreground/80">
          {messages.map((message) => (
            <div key={message.id}>
                {
                    message.type === 'question' ?
                    (
                        <div className="flex justify-end">
                            <div className="group relative inline-block max-w-[80%] break-words rounded bg-background shadow-sm shadow-background p-4 text-left">
                                <div>{message.text}</div>
                            </div>
                        </div>
                    )
                :
                    (
                        <div className="flex justify-start chat-content">
                            <div className="group relative w-full max-w-full break-words">
                                <div className="space-y-4 prose prose-neutral prose-invert max-w-none prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0">
                                  <MemoizedMarkdown id={message.id} content={message.text} />
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
          ))}
          <div className="flex justify-start chat-content">
              <div className="group relative w-full max-w-full break-words">
                  <div className="space-y-4 prose prose-neutral prose-invert max-w-none prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0">
                    <MemoizedMarkdown id={`${Date.now()}`} content={output} />
                  </div>
              </div>
          </div>
          <div ref={endRef}></div>
        </div>
      </div>
    </div>
  );
}