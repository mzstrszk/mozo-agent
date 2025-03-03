"use client";

import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Message } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import { Bot, User } from "lucide-react";
import { MessageContent } from "@/components/chat/message-content";

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <Bot className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">How can I help you today?</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Ask me anything, upload documents, or request image generation.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div className="flex gap-3 max-w-[80%]">
            {message.role !== "user" && (
              <Avatar className="h-8 w-8">
                <AvatarFallback>AI</AvatarFallback>
                <AvatarImage src="/bot-avatar.png" />
              </Avatar>
            )}
            <div className="flex flex-col gap-1">
              <Card
                className={`p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }`}
              >
                <MessageContent message={message} />
              </Card>
              <div
                className={`text-xs text-muted-foreground ${
                  message.role === "user" ? "text-right" : ""
                }`}
              >
                {formatDistanceToNow(message.timestamp, { addSuffix: true })}
              </div>
            </div>
            {message.role === "user" && (
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
                <AvatarImage src="/user-avatar.png" />
              </Avatar>
            )}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}