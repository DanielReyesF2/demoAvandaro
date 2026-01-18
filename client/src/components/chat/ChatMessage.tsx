import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

// Función para parsear markdown básico y renderizar con estilos
function parseMarkdown(content: string): React.ReactNode {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  
  lines.forEach((line, lineIndex) => {
    const trimmedLine = line.trim();
    
    // Línea vacía = separador de párrafo
    if (trimmedLine === '') {
      elements.push(<div key={`space-${lineIndex}`} className="h-2" />);
      return;
    }
    
    // Parsear negritas **texto** en la línea
    const parseLineWithBold = (text: string): React.ReactNode[] => {
      const parts: React.ReactNode[] = [];
      const boldRegex = /\*\*(.+?)\*\*/g;
      let lastIndex = 0;
      let match;
      let matchIndex = 0;
      
      while ((match = boldRegex.exec(text)) !== null) {
        // Texto antes de la negrita
        if (match.index > lastIndex) {
          parts.push(text.substring(lastIndex, match.index));
        }
        // Texto en negrita
        parts.push(
          <strong key={`bold-${lineIndex}-${matchIndex++}`} className="font-bold text-gray-900">
            {match[1]}
          </strong>
        );
        lastIndex = match.index + match[0].length;
      }
      
      // Texto después de la última negrita
      if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
      }
      
      // Si no hay negritas, retornar texto completo
      return parts.length > 0 ? parts : [text];
    };
    
    // Detectar si es una lista (empieza con •, -)
    // Los emojis se mostrarán naturalmente en el texto
    const isListItem = /^[•\-]\s/.test(trimmedLine);
    
    if (isListItem) {
      elements.push(
        <div key={`list-${lineIndex}`} className="flex items-start gap-2 mb-1.5">
          <span className="flex-shrink-0">{parseLineWithBold(line)}</span>
        </div>
      );
    } else {
      // Párrafo normal
      elements.push(
        <div key={`para-${lineIndex}`} className="mb-1.5 last:mb-0">
          {parseLineWithBold(line)}
        </div>
      );
    }
  });
  
  return <div className="space-y-1">{elements}</div>;
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';
  const parsedContent = isUser ? content : parseMarkdown(content);

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
          "text-sm leading-relaxed whitespace-pre-wrap",
          isUser ? "text-gray-900" : "text-gray-700"
        )}>
          {parsedContent}
        </div>
      </div>
    </div>
  );
}
