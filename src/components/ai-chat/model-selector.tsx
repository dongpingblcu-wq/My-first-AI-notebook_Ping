'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Model {
  id: string;
  name: string;
  provider: string;
  description?: string;
  contextLength?: number;
  maxTokens?: number;
}

const MODELS: Model[] = [
  // 您指定的优先模型
  {
    id: 'deepseek/deepseek-chat-v3.1',
    name: 'DeepSeek Chat V3.1',
    provider: 'DeepSeek',
    description: '最新版DeepSeek聊天模型',
    contextLength: 32768,
    maxTokens: 8192
  },
  {
    id: 'openai/gpt-5-chat',
    name: 'GPT-5 Chat',
    provider: 'OpenAI',
    description: '最新的GPT-5聊天模型',
    contextLength: 128000,
    maxTokens: 8192
  },
  {
    id: 'x-ai/grok-4',
    name: 'Grok-4',
    provider: 'xAI',
    description: 'xAI的最新Grok模型',
    contextLength: 128000,
    maxTokens: 8192
  },
  {
    id: 'google/gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google',
    description: 'Google最新的Gemini Pro模型',
    contextLength: 1000000,
    maxTokens: 8192
  },
  {
    id: 'anthropic/claude-sonnet-4',
    name: 'Claude Sonnet 4',
    provider: 'Anthropic',
    description: '最新的Claude Sonnet模型',
    contextLength: 200000,
    maxTokens: 8192
  },
  // 保留一些常用的备用模型
  {
    id: 'openai/gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: '最新版GPT-4，更高性价比',
    contextLength: 128000,
    maxTokens: 4096
  },
  {
    id: 'anthropic/claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    description: '平衡性能和成本的Claude模型',
    contextLength: 200000,
    maxTokens: 4096
  },
  {
    id: 'google/gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Google的先进AI模型',
    contextLength: 32768,
    maxTokens: 8192
  }
];

interface ModelSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedModel = MODELS.find(m => m.id === value) || MODELS[0];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 min-w-[200px] justify-between"
        >
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">{selectedModel.name}</span>
            <span className="text-xs text-gray-500">{selectedModel.provider}</span>
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] max-h-[400px] overflow-y-auto">
        {MODELS.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onSelect={() => {
              onChange(model.id);
              setIsOpen(false);
            }}
            className="flex flex-col items-start py-3"
          >
            <div className="flex items-center justify-between w-full">
              <span className="font-medium">{model.name}</span>
              <span className="text-xs text-gray-500">{model.provider}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">{model.description}</p>
            <div className="text-xs text-gray-500 mt-1">
              上下文: {model.contextLength?.toLocaleString()} tokens
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}