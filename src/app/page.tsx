import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 md:py-24">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
          Azure OpenAI Chat
        </h1>
        <p className="max-w-[600px] text-center text-muted-foreground text-lg">
          Powerful chat interface powered by Azure OpenAI. Upload documents, generate images, and more.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <Link href="/signin">
            <Button size="lg">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline">
              Sign Up
            </Button>
          </Link>
          <Link href="/chat">
            <Button size="lg" variant="secondary">
              <MessageSquare className="mr-2 h-5 w-5" />
              Start Chatting
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}