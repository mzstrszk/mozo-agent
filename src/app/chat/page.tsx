"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { Message } from "@/types/chat";
import { v4 as uuidv4 } from "uuid";

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;

    // Create user message
    const userMessage: Message = {
      id: uuidv4(),
      role: "user",
      content,
      timestamp: Date.now(),
      attachments: attachments
        ? await Promise.all(
            attachments.map(async (file) => {
              // In a real app, you would upload the file to a server
              // and get a URL back. For now, we'll just create a local URL.
              const url = URL.createObjectURL(file);
              return {
                id: uuidv4(),
                type: getFileType(file),
                name: file.name,
                url,
              };
            })
          )
        : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      // Send message to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          attachments: userMessage.attachments,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();

      // Add assistant response
      const assistantMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: data.response,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: uuidv4(),
        role: "assistant",
        content: "Sorry, there was an error processing your request. Please try again.",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const getFileType = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    
    if (file.type.startsWith("image/")) return "image";
    if (extension === "pdf") return "pdf";
    if (extension === "xlsx" || extension === "xls") return "excel";
    if (extension === "docx" || extension === "doc") return "word";
    if (extension === "pptx" || extension === "ppt") return "powerpoint";
    
    return "pdf"; // Default type
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <ChatSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <ChatHeader />
        <div className="flex-1 overflow-auto p-4">
          <div className="mx-auto max-w-[840px]">
            <ChatMessages messages={messages} />
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="border-t p-4">
          <div className="mx-auto max-w-[840px]">
            <ChatInput onSendMessage={handleSendMessage} isProcessing={isProcessing} />
          </div>
        </div>
      </div>
    </div>
  );
}