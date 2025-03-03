"use client";

import { useState } from "react";
import Image from "next/image";
import { Message } from "@/types/chat";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Code, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface MessageContentProps {
  message: Message;
}

export function MessageContent({ message }: MessageContentProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("preview");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Function to detect if content has code blocks
  const hasCodeBlock = (content: string) => {
    return content.includes("```");
  };

  // Extract code blocks from content
  const extractCodeBlocks = (content: string) => {
    const codeBlockRegex = /```(?:(\w+)\n)?([\s\S]*?)```/g;
    const codeBlocks = [];
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || "text";
      const code = match[2].trim();
      codeBlocks.push({ language, code });
    }

    return codeBlocks;
  };

  // Render attachments
  const renderAttachments = () => {
    if (!message.attachments || message.attachments.length === 0) return null;

    return (
      <div className="mt-2 space-y-2">
        {message.attachments.map((attachment) => {
          if (attachment.type === "image" && attachment.url) {
            return (
              <div key={attachment.id} className="relative rounded-md overflow-hidden">
                <Image
                  src={attachment.url}
                  alt={attachment.name}
                  width={300}
                  height={200}
                  className="object-contain"
                />
                <div className="text-xs mt-1">{attachment.name}</div>
              </div>
            );
          }

          return (
            <div key={attachment.id} className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <FileText className="h-4 w-4" />
              <span className="text-sm">{attachment.name}</span>
            </div>
          );
        })}
      </div>
    );
  };

  // If the message has code blocks, render with tabs
  if (hasCodeBlock(message.content)) {
    const codeBlocks = extractCodeBlocks(message.content);
    
    return (
      <div>
        <Tabs defaultValue="preview" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-2">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="source">Source</TabsTrigger>
            </TabsList>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(message.content)}
              className="h-8 px-2"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <TabsContent value="preview" className="mt-0">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <div className="relative">
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(String(children))}
                        className="absolute top-2 right-2 h-8 w-8 p-0"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </TabsContent>
          <TabsContent value="source" className="mt-0">
            <div className="relative">
              <SyntaxHighlighter
                style={vscDarkPlus}
                language="markdown"
                PreTag="div"
              >
                {message.content}
              </SyntaxHighlighter>
            </div>
          </TabsContent>
        </Tabs>
        {renderAttachments()}
      </div>
    );
  }

  // Regular message without code blocks
  return (
    <div>
      <ReactMarkdown>{message.content}</ReactMarkdown>
      {renderAttachments()}
    </div>
  );
}