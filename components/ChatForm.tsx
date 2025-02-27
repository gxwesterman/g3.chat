'use client'

import { db } from '@/lib/instant';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
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

export default function ChatForm({ setOutput } : { setOutput: (output: string) => void }) {

  const pathname = usePathname();
  var pageChatId = (pathname.split('/').pop() || '');
  const [input, setInput] = useState('');

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
    try {
        // First, make the API call
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: input,
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
            
          // Continuously read from the stream
          while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;
            
            // Decode the chunk into a string and append to the result
            result += decoder.decode(value, { stream: true });
            
            // Optionally, you can update the UI to display the partial result here
            setOutput(result);
            console.log(result);  // For debugging purposes (can replace with your state update)
          }
  
          // At this point, 'result' contains the full response
          setOutput('');
          addMessage(result, 'answer', pageChatId);
        }

      } catch (error) {
        console.error('Error:', error);
        // Handle error appropriately
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