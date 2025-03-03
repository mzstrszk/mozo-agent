"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Palette, Settings } from "lucide-react";

export function SettingsHeader() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-4">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/chat">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to chat</span>
          </Link>
        </Button>
        <h1 className="ml-4 text-xl font-bold">Settings</h1>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" />
            General
          </Link>
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/settings/account">
            <User className="mr-2 h-4 w-4" />
            Account
          </Link>
        </Button>
      </div>
    </header>
  );
}