import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div className={cn(
      "flex gap-3 px-4 py-3 animate-fade-in",
      isUser ? "bg-white" : "bg-gray-50"
    )}>
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isUser 
          ? "bg-accent-green text-white" 
          : "bg-gradient-to-br from-accent-purple to-accent-teal text-white"
      )}>
        {isUser ? (
          <User className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className={cn(
          "text-sm leading-relaxed",
          isUser ? "text-gray-900" : "text-gray-700"
        )}>
          {content}
        </div>
      </div>
    </div>
  );
}
