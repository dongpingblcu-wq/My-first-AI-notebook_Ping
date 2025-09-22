'use client';

import { useState, useCallback, useEffect } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  model?: string;
}

interface UseAIChatReturn {
  messages: Message[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  loadHistory: () => void;
}

export function useAIChat(model: string): UseAIChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadHistory = useCallback(() => {
    // 确保只在客户端运行
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem(`ai-chat-history-${model}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setMessages(parsed.map((msg: { content: string; role: string; timestamp: string; model?: string }) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    }
  }, [model]);

  const saveHistory = useCallback((newMessages: Message[]) => {
    // 确保只在客户端运行
    if (typeof window === 'undefined') return;
    
    localStorage.setItem(`ai-chat-history-${model}`, JSON.stringify(newMessages));
  }, [model]);

  const sendMessage = useCallback(async (content: string) => {
    setIsLoading(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
      if (!apiKey) {
        throw new Error('OpenRouter API key not configured');
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : '',
          'X-Title': 'AI Personal Assistant',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            ...newMessages.map(msg => ({
              role: msg.role,
              content: msg.content
            }))
          ],
          max_tokens: 4000,
          temperature: 0.7,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiContent = data.choices[0]?.message?.content || '抱歉，我没有收到回复';

      const aiMessage: Message = {
        id: Date.now().toString(),
        content: aiContent,
        role: 'assistant',
        timestamp: new Date(),
        model: model,
      };

      const finalMessages = [...newMessages, aiMessage];
      setMessages(finalMessages);
      saveHistory(finalMessages);

    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: `抱歉，发送消息时出现了错误：${error instanceof Error ? error.message : '未知错误'}`,
        role: 'assistant',
        timestamp: new Date(),
        model: model,
      };

      const finalMessages = [...newMessages, errorMessage];
      setMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  }, [messages, model, saveHistory]);

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(`ai-chat-history-${model}`);
  }, [model]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    loadHistory,
  };
}