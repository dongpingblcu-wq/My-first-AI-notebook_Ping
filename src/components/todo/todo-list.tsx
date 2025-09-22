'use client';

import { useState } from 'react';
import { TodoTask, TodoFilter } from '@/types/todo';
import { TodoItem } from './todo-item';
import { TodoInput } from './todo-input';
import { TodoFilter as TodoFilterComponent } from './todo-filter';
import { CheckCircle2 } from 'lucide-react';

interface TodoListProps {
  tasks: TodoTask[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, content: string) => void;
  onAdd: (content: string) => void;
  filter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
}

export function TodoList({ 
  tasks, 
  onToggle, 
  onDelete, 
  onEdit, 
  onAdd,
  filter, 
  onFilterChange 
}: TodoListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">任务列表</h2>
          <TodoInput onAdd={onAdd} />
          <TodoFilterComponent filter={filter} onFilterChange={onFilterChange} />
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {tasks.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              {filter === 'all' 
                ? '暂无任务，开始添加您的第一个任务吧！'
                : filter === 'active' 
                ? '暂无未完成任务' 
                : '暂无已完成任务'
              }
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TodoItem
              key={task.id}
              task={task}
              isEditing={editingId === task.id}
              onToggle={() => onToggle(task.id)}
              onDelete={() => onDelete(task.id)}
              onEdit={(content) => {
                onEdit(task.id, content);
                setEditingId(null);
              }}
              onStartEdit={() => setEditingId(task.id)}
              onCancelEdit={() => setEditingId(null)}
            />
          ))
        )}
      </div>
    </div>
  );
}