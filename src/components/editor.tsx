'use client';

import { useState, useEffect } from 'react';
import { Note } from '@/types/note';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wand2, Tag, Type } from 'lucide-react';

interface EditorProps {
  note: Note | null;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onCreateNote: (note: Note) => void;
}

export function Editor({ note, onUpdateNote, onCreateNote: _onCreateNote }: EditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags);
    } else {
      setTitle('');
      setContent('');
      setTags([]);
    }
  }, [note]);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (note) {
      onUpdateNote(note.id, { title: value });
    }
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    if (note) {
      onUpdateNote(note.id, { content: value });
    }
  };

  const handleAIAction = async (action: 'polish' | 'generate_title' | 'generate_tags') => {
    if (!note) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, text: content }),
      });

      if (!response.ok) throw new Error('AI request failed');

      const data = await response.json();
      
      switch (action) {
        case 'polish':
          setContent(data.result);
          onUpdateNote(note.id, { content: data.result });
          break;
        case 'generate_title':
          setTitle(data.result);
          onUpdateNote(note.id, { title: data.result });
          break;
        case 'generate_tags':
          setTags(data.result);
          onUpdateNote(note.id, { tags: data.result });
          break;
      }
    } catch (error) {
      console.error('AI action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            欢迎使用 AI 个人记事本
          </h2>
          <p className="text-gray-500 mb-6">
            点击左侧的&apos;创建新笔记&apos;开始写作
          </p>
          <div className="text-sm text-gray-400">
            支持智能润色、自动生成标题和标签
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="请输入标题..."
            className="text-2xl font-semibold border-none shadow-none p-0 focus:outline-none"
          />
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAIAction('generate_title')}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Type className="w-4 h-4" />
              生成标题
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAIAction('generate_tags')}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Tag className="w-4 h-4" />
              生成标签
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAIAction('polish')}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              智能润色
            </Button>
          </div>
        </div>
        
        {tags.length > 0 && (
          <div className="flex gap-2 mb-4">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex-1 p-4">
        <Textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="开始写作..."
          className="w-full h-full resize-none border-none focus:outline-none text-lg leading-relaxed"
        />
      </div>
      
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      )}
    </div>
  );
}