import { useState, useRef, useEffect } from 'react';
import { X, Bot, Sparkles } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { sendMessageToAI, MAX_QUESTIONS } from '@/lib/econovaAI';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function EconovaAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (message: string) => {
    if (questionCount >= MAX_QUESTIONS) {
      return;
    }

    const userMessage: Message = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setQuestionCount(prev => prev + 1);
    setIsLoading(true);

    try {
      const response = await sendMessageToAI([...messages, userMessage], questionCount);
      const assistantMessage: Message = { role: 'assistant', content: response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Lo siento, hubo un error procesando tu pregunta. Por favor intenta de nuevo.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleReset = () => {
    setMessages([]);
    setQuestionCount(0);
  };

  const remainingQuestions = MAX_QUESTIONS - questionCount;
  const isLimitReached = questionCount >= MAX_QUESTIONS;

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "w-14 h-14 rounded-full",
            "bg-gradient-to-br from-accent-purple to-accent-teal",
            "text-white shadow-premium-lg hover:shadow-premium-xl",
            "flex items-center justify-center",
            "transition-all duration-200 animate-scale-in",
            "hover:scale-110 active:scale-95"
          )}
          aria-label="Abrir Econova AI"
        >
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-green rounded-full flex items-center justify-center text-xs font-semibold border-2 border-white">
            {remainingQuestions}
          </span>
        </button>
      )}

      {/* Panel del chat */}
      {isOpen && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50",
            "w-96 h-[600px] rounded-2xl",
            "bg-white border border-subtle shadow-premium-xl",
            "flex flex-col overflow-hidden",
            "animate-scale-in"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-subtle bg-gradient-to-r from-accent-purple/5 to-accent-teal/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-teal flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Econova AI</h3>
                <p className="text-xs text-gray-500">
                  {remainingQuestions > 0 
                    ? `${remainingQuestions} pregunta${remainingQuestions > 1 ? 's' : ''} restante${remainingQuestions > 1 ? 's' : ''}`
                    : 'Límite alcanzado'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {questionCount > 0 && (
                <button
                  onClick={handleReset}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
                >
                  Reiniciar
                </button>
              )}
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto bg-gray-50"
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-4 text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-purple/20 to-accent-teal/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-accent-purple" />
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  ¡Hola! Soy Econova AI
                </h4>
                <p className="text-xs text-gray-600 max-w-xs">
                  Tu asistente de gestión ambiental. Puedo ayudarte a entender tus datos de residuos, agua y energía.
                </p>
                <p className="text-xs text-gray-500 mt-4">
                  Tienes <span className="font-semibold text-accent-green">{remainingQuestions} preguntas</span> disponibles
                </p>
              </div>
            ) : (
              <div className="py-2">
                {messages.map((message, index) => (
                  <ChatMessage key={index} {...message} />
                ))}
                {isLoading && (
                  <div className="flex gap-3 px-4 py-3 bg-gray-50 animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-teal flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500 font-medium">Pensando, revisando base de datos...</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          {isLimitReached && messages.length > 0 ? (
            <div className="border-t border-subtle p-4 bg-gradient-to-r from-yellow-50 to-orange-50">
              <p className="text-xs text-center text-gray-600">
                Has alcanzado el límite de {MAX_QUESTIONS} preguntas. 
                <button
                  onClick={handleReset}
                  className="ml-1 text-accent-green hover:underline font-medium"
                >
                  Reiniciar conversación
                </button>
              </p>
            </div>
          ) : (
            <ChatInput
              onSend={handleSend}
              disabled={isLoading || isLimitReached}
              placeholder={isLimitReached ? "Límite alcanzado" : "Pregunta sobre tus datos..."}
            />
          )}
        </div>
      )}
    </>
  );
}
