'use client'

import { db } from '@/lib/instant';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { id } from '@instantdb/react';

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

export default function ChatForm({ pageChatId, home }: { pageChatId: string, home?: boolean }) {

    const [input, setInput] = useState('');

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
        if (home) {
            startChat(pageChatId);
            window.history.pushState({}, '', window.location.href + `/${pageChatId}`);
        }
        addMessage(input, pageChatId);
        setInput('');
    }

  return (
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
  );
}