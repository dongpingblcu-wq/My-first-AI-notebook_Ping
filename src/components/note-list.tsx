'use client';

import { Note } from '@/types/note';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SearchHighlight } from '@/components/search-highlight';
import { useEffect, useRef } from 'react';

interface NoteListProps {
  notes: Note[];
  activeNoteId?: string;
  onSelectNote: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function NoteList({ notes, activeNoteId, onSelectNote, searchTerm, onSearchChange }: NoteListProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  if (notes.length === 0) {
    return (
      <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">笔记列表</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">暂无笔记</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200">
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">笔记列表 ({notes.length})</h2>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="搜索笔记... (Ctrl+F)"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-8 w-full"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {searchTerm && (
          <p className="text-xs text-gray-500">
            找到 {notes.length} 个结果
          </p>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 && searchTerm ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <Search className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">未找到匹配的笔记</p>
            <p className="text-gray-400 text-xs mt-1">尝试其他关键词</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className={cn(
                "p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors",
                activeNoteId === note.id && "bg-blue-50 border-l-4 border-l-blue-600"
              )}
              onClick={() => onSelectNote(note.id)}
            >
              <h3 className="font-medium text-gray-900 truncate mb-1">
                <SearchHighlight 
                  text={note.title || '无标题笔记'} 
                  searchTerm={searchTerm}
                />
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                <SearchHighlight 
                  text={note.content || '暂无内容'} 
                  searchTerm={searchTerm}
                />
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{format(new Date(note.updatedAt), 'MM/dd HH:mm')}</span>
                
                {note.tags.length > 0 && (
                  <div className="flex gap-1">
                    {note.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded"
                      >
                        <SearchHighlight text={tag} searchTerm={searchTerm} />
                      </span>
                    ))}
                    {note.tags.length > 2 && (
                      <span className="text-xs text-gray-500">+{note.tags.length - 2}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}