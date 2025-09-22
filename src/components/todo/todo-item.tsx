'use client';

import { useState } from 'react';
import { TodoTask } from '@/types/todo';
import { Check, Trash2, Edit3, X, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  task: TodoTask;
  isEditing: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (content: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
}

export function TodoItem({
  task,
  isEditing,
  onToggle,
  onDelete,
  onEdit,
  onStartEdit,
  onCancelEdit,
}: TodoItemProps) {
  const [editContent, setEditContent] = useState(task.content);

  const handleSave = () => {
    if (editContent.trim()) {
      onEdit(editContent.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancelEdit();
    }
  };

  return (
    <div
      className={cn(
        'group flex items-center p-4 transition-colors',
        task.completed ? 'bg-gray-50' : 'bg-white',
        'hover:bg-gray-50'
      )}
    >
      <div className="flex items-center flex-1 min-w-0">
        <button
          onClick={onToggle}
          className={cn(
            'flex-shrink-0 w-5 h-5 rounded border-2 mr-3 transition-colors',
            task.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-400'
          )}
          aria-label={task.completed ? '标记为未完成' : '标记为已完成'}
        >
          {task.completed && <Check className="w-3 h-3" />}
        </button>

        {isEditing ? (
          <input
            type="text"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <span
            className={cn(
              'flex-1 text-sm',
              task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
            )}
          >
            {task.content}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2 ml-3">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="p-1 text-green-600 hover:text-green-700 transition-colors"
              aria-label="保存"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={onCancelEdit}
              className="p-1 text-gray-600 hover:text-gray-700 transition-colors"
              aria-label="取消"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onStartEdit}
              className="p-1 text-blue-600 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-all"
              aria-label="编辑"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-red-600 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-all"
              aria-label="删除"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}