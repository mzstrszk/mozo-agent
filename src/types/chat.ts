export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  type: 'image' | 'pdf' | 'excel' | 'word' | 'powerpoint' | 'google-sheet' | 'google-doc' | 'google-slide';
  name: string;
  url?: string;
  content?: string;
  thumbnailUrl?: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  createdAt: number;
  updatedAt: number;
}
