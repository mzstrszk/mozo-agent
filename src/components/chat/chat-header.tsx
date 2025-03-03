"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Settings, User } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/components/auth-provider";

export function ChatHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-4">
      <div className="flex items-center">
        <Link href="/" className="text-xl font-bold">
          Azure OpenAI Chat
        </Link>
      </div>
      <div className="flex items-center space-x-2">
        <ModeToggle />
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Link>
        </Button>
        <Button variant="ghost" size="icon" asChild>
          <Link href="/settings/account">
            <User className="h-5 w-5" />
            <span className="sr-only">Account</span>
          </Link>
        </Button>
        {user && (
          <Button variant="outline" onClick={() => signOut()}>
            Sign Out
          </Button>
        )}
      </div>
    </header>
  );
}