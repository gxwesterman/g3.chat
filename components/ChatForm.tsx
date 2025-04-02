'use client'

import { db } from '@/lib/instant';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import { id } from '@instantdb/react';
import { usePathname } from 'next/navigation';
import { ArrowUp } from 'lucide-react';

function addMessage(text: string, type: string, chatId: string) {
  db.transact(
    db.tx.messages[id()].update({
      chatId,
      text,
      type,
    }).link({ chats: chatId }),
  );
}

async function startChat(id: string, title: string) {
  const cookies = document.cookie.split(';');
  const userIdCookie = cookies.find(cookie => cookie.trim().startsWith('session='));
  const extractedUserId = userIdCookie ? userIdCookie.split('=')[1].trim() : '';
  const newChat = db.transact(
    db.tx.chats[id].update({
      sessionId: extractedUserId,
      title
    }),
  );
  return newChat;
}

export default function ChatForm({
  messages,
  output,
  setOutput,
  streamingId,
  setStreamingId
}: {
  messages: { [x: string]: string; id: string; }[],
  output: React.ReactNode[],
  setOutput: (output: React.ReactNode[]) => void,
  streamingId: string,
  setStreamingId: (streamingId: string) => void
}) {
  const pathname = usePathname();
  let pageChatId = (pathname.split('/').pop() || '');
  const [input, setInput] = useState('');
  const [text, setText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streamingDone, setStreamingDone] = useState(true);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const requestRef = useRef<number>(null);

  useEffect(() => {
    const streamText = () => {
      if (currentIndex < text.length) {
        const bufferLength = 7;
        let buffer = '';
        let i = 0;
        for (i; (i + currentIndex) < text.length && i < bufferLength; i++) {
          buffer += text[currentIndex + i];
        }
        setOutput([...output, <span key={`${Date.now()}`}>{buffer}</span>]);
        setCurrentIndex(currentIndex + i);
      }
    };

    if (text.length === 0) return;
    if (streamingDone && currentIndex === text.length) {
      addMessage(text, 'answer', streamingId);
      setOutput([]);
      setText('');
      setStreamingId('');
      setCurrentIndex(0);
    };

    const startStreaming = () => {
      requestRef.current = requestAnimationFrame(() => {
        streamText();
      });
    };

    startStreaming();

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [text, currentIndex, pageChatId, setOutput, streamingDone, output]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (
      ((e.key === 'Enter' || e.key === 'NumpadEnter') && !e.shiftKey)
    ) {
      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!streamingDone || input === '') {
      return;
    }
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
    }
    if (pageChatId === 'chat') {
        pageChatId = id();
        window.history.pushState({}, '', window.location.href + `/${pageChatId}`);
        startChat(pageChatId, input);
    }
    setStreamingId(pageChatId);
    addMessage(input, 'question', pageChatId);
    setInput('');
    setStreamingDone(false);
    try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: input,
            messages: messages,
            chatId: pageChatId,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to get AI response');
        }

        if (response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let done = false;
          let result = '';
            
          while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;
            result += decoder.decode(value, { stream: true });
            setText(result);
          }
          setStreamingDone(true);
        }

      } catch (error) {
        console.error('Error:', error);
      }
  }

  const handleChange = (input: string) => {
    setInput(input);
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }

  return (
    <div className="absolute bottom-0 w-full">
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col text-center">
        <div
          className="border-reflect border-reflect-form relative rounded-t-[20px] bg-white/40 p-2 pb-0 backdrop-blur-lg ![--c:295_100%_90%] dark:bg-[hsl(270,10%,20%)]/40 dark:![--c:289_23%_23%]"
        >
        <form
          className="relative flex w-full flex-col items-stretch gap-2 rounded-t-xl border border-b-0 border-white/70 bg-[#fbf0fb9c] px-3 py-3 text-secondary-foreground outline outline-8 outline-[hsl(300,87.8%,86.9%)]/40 dark:border-[hsl(0,0%,83%)]/[0.04] dark:bg-secondary/[0.045] dark:outline-background/40 sm:max-w-3xl"
          style={{boxShadow: "rgba(0, 0, 0, 0.1) 0px 80px 50px 0px, rgba(0, 0, 0, 0.07) 0px 50px 30px 0px, rgba(0, 0, 0, 0.06) 0px 30px 15px 0px, rgba(0, 0, 0, 0.04) 0px 15px 8px, rgba(0, 0, 0, 0.04) 0px 6px 4px, rgba(0, 0, 0, 0.02) 0px 2px 2px"}}
          onSubmit={handleSubmit}
        >
          <div className="flex flex-grow flex-row items-start">
            <Textarea
              ref={textAreaRef}
              name="message"
              className="font-semibold grow resize-none border-none outline-none text-base shadow-none focus-visible:ring-0 max-h-80"
              placeholder="Type your message here..."
              onKeyDown={handleKeyDown}
              value={input}
              onChange={(e) => handleChange(e.target.value)}
            />
            <Button
              className="transition-colors font-semibold bg-[rgb(162,59,103)] dark:bg-primary/20 dark:hover:bg-pink-800/70 shadow border-reflect button-reflect hover:bg-[#d56698] active:bg-[rgb(162,59,103)] dark:active:bg-pink-800/40 h-9 w-9 relative rounded-lg p-2 text-pink-50"
              type="submit"
            >
              <ArrowUp className="!size-5" />
            </Button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}