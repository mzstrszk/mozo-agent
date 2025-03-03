"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, MessageSquare } from "lucide-react";

export function ChatSidebar() {
  const [chats, setChats] = useState<{ id: string; title: string }[]>([
    { id: "1", title: "New Chat" },
  ]);

  const createNewChat = () => {
    const newChat = {
      id: Math.random().toString(36).substring(7),
      title: "New Chat",
    };
    setChats([newChat, ...chats]);
  };

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:border-r">
      <div className="flex h-14 items-center border-b px-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={createNewChat}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {chats.map((chat) => (
            <Button
              key={chat.id}
              variant="ghost"
              className="w-full justify-start"
              asChild
            >
              <Link href={`/chat/${chat.id}`}>
                <MessageSquare className="mr-2 h-4 w-4" />
                {chat.title}
              </Link>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}