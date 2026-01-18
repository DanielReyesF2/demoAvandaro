import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled = false, placeholder = "Pregunta sobre tus datos..." }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-subtle p-4 bg-white">
      <div className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              "w-full px-4 py-2.5 pr-12 rounded-lg border border-subtle",
              "focus:outline-none focus:ring-2 focus:ring-accent-green/20 focus:border-accent-green",
              "resize-none max-h-32 overflow-y-auto",
              "text-sm text-gray-900 placeholder:text-gray-400",
              "bg-white disabled:bg-gray-100 disabled:text-gray-700 disabled:cursor-not-allowed",
              disabled && "cursor-not-allowed"
            )}
            style={{ 
              minHeight: '44px',
              maxHeight: '128px'
            }}
          />
        </div>
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          size="icon"
          className={cn(
            "h-11 w-11 rounded-lg shrink-0",
            "bg-accent-green hover:bg-accent-green/90 text-white",
            "disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed",
            "transition-all duration-200"
          )}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
