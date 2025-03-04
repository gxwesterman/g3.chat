'use client'

import { db } from '@/lib/instant';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import React, { useEffect, useRef, useState } from "react";
import { id } from '@instantdb/react';
import { usePathname } from 'next/navigation';
import { Send } from 'lucide-react';

function addMessage(text: string, type: string, chatId: string) {
  db.transact(
    db.tx.messages[id()].update({
      chatId,
      text,
      type,
      createdAt: new Date(),
    }).link({ chats: chatId }),
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

export default function ChatForm({
  messages,
  output,
  setOutput
}: {
  messages: { [x: string]: any; id: string; }[],
  output: string,
  setOutput: (output: string) => void
}) {
  const pathname = usePathname();
  var pageChatId = (pathname.split('/').pop() || '');
  const [input, setInput] = useState('');
  const [text, setText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streamingDone, setStreamingDone] = useState(false);

  const requestRef = useRef<number>(null);

  const streamText = () => {
    if (currentIndex < text.length) {
      const bufferLength = 7;
      let buffer = output;
      let i = 0;
      for (i; (i + currentIndex) < text.length && i < bufferLength; i++) {
        buffer += text[currentIndex + i];
      }
      setOutput(buffer);
      setCurrentIndex(currentIndex + i);
    } else {
      requestRef.current && cancelAnimationFrame(requestRef.current);
    }
  };

  useEffect(() => {
    if (text.length === 0) return;
    if (streamingDone && currentIndex === text.length) {
      setOutput('');
      setText('');
      setCurrentIndex(0);
      addMessage(text, 'answer', pageChatId);
    };

    const startStreaming = () => {
      requestRef.current = requestAnimationFrame(() => {
        streamText();
      });
    };

    startStreaming();

    return () => {
      requestRef.current && cancelAnimationFrame(requestRef.current);
    };
  }, [text, currentIndex]);

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
    if (pageChatId === 'chat') {
        pageChatId = id();
        startChat(pageChatId);
        window.history.pushState({}, '', window.location.href + `/${pageChatId}`);
    }
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

  return (
    <div className="absolute bottom-0 w-full pr-2">
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
            <Send />
          </Button>
        </form>
      </div>
    </div>
  );
}