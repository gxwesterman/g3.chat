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
    }).link({ chats: chatId }),
  );
}

function startChat(id: string) {
  const newChat = db.transact(
    db.tx.chats[id].update({}),
  );
  return newChat;
}

export default function ChatForm({
  messages,
  output,
  setOutput
}: {
  messages: { [x: string]: string; id: string; }[],
  output: string,
  setOutput: (output: string) => void
}) {
  const pathname = usePathname();
  let pageChatId = (pathname.split('/').pop() || '');
  const [input, setInput] = useState('');
  const [text, setText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streamingDone, setStreamingDone] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const requestRef = useRef<number>(null);

  useEffect(() => {
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
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      }
    };

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
        <form
          className="flex items-center flex-col bg-background shadow-[0px_0px_5px_2px] shadow-secondary rounded py-2"
          onSubmit={handleSubmit}
        >
          <Textarea
            ref={textAreaRef}
            name="message"
            className="grow resize-none border-none outline-none text-base shadow-none focus-visible:ring-0 max-h-80"
            placeholder="Type your message here..."
            onKeyDown={handleKeyDown}
            value={input}
            onChange={(e) => handleChange(e.target.value)}
          />
          <div className="w-full flex justify-end">
            <Button
              className="mr-3"
              type="submit"
            >
              <Send />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}