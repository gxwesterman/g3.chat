'use client'

import { useState, useRef, useEffect, JSX } from "react";
import ChatForm from '@/components/ChatForm';
import { usePathname } from "next/navigation";
import { MemoizedMarkdown } from '@/components/memoized-markdown';
import { Message } from '@/lib/types';
import ReactMarkdown from 'react-markdown';

export default function Chat({ messages, oldMessages, setOldMessages }: { messages: Message[] , oldMessages: Message[], setOldMessages: (oldMessages: Message[]) => void}) {

  const pathname = usePathname();
  const [output, setOutput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const [streamingId, setStreamingId] = useState('');
  const test = useRef<{ [key: string]: JSX.Element }>({});

  const renderMarkdown = (content: string) => {
    return <ReactMarkdown>{content}</ReactMarkdown>
  }
  
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'instant' });
    }
    setOldMessages(messages.slice(0, messages.length - 10));
  }, [pathname]);

  return (
    <div className="relative flex-1 overflow-hidden">
      <ChatForm messages={messages} output={output} setOutput={setOutput} streamingId={streamingId} setStreamingId={setStreamingId} />
      <div key={pathname} className="scrollbar scrollbar-w-2 scrollbar-thumb-gray-700 scrollbar-track-transparent hover:scrollbar-thumb-gray-600 h-[100dvh] overflow-y-auto overflow-x-hidden pb-[140px]">
        <div className="mx-auto flex w-full max-w-3xl flex-col space-y-12 p-4 pb-8 text-foreground/80">
          {messages.map((message) => {
            if (message.type === 'answer' && !test.current[message.id]) {
              test.current[message.id] = renderMarkdown(message.text);
            }
            return (
            <div key={message.id}>
                {
                    message.type === 'question' ?
                    (
                        <div className="flex justify-end">
                            <div className="group relative inline-block max-w-[80%] break-words rounded-2xl bg-secondary p-4 text-left">
                                <div className="prose prose-neutral prose-invert max-w-none prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0">
                                  <p>{message.text}</p>
                                </div>
                            </div>
                        </div>
                    )
                :
                    (
                        <div className="flex justify-start chat-content">
                            <div className="group relative w-full max-w-full break-words">
                                <div className="space-y-4 prose prose-neutral prose-invert max-w-none prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0">
                                  {test.current[message.id]}
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
          )})}
          {streamingId === pathname.split('/').pop() && (
            <div className="flex justify-start chat-content">
                <div className="group relative w-full max-w-full break-words">
                    <div className="space-y-4 prose prose-neutral prose-invert max-w-none prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0">
                      <MemoizedMarkdown id={`${Date.now()}`} content={output} />
                    </div>
                </div>
            </div>
          )}
          <div ref={endRef}></div>
        </div>
      </div>
    </div>
  );
}