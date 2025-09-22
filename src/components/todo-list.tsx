'use client';

import { useState } from 'react';
import { Plus, Check, Trash2, Edit2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TodoTask } from '@/types/todo';

interface TodoListProps {
  todos: TodoTask[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (content: string) => void;
  onUpdate: (id: string, content: string) => void;
  filter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
}

export function TodoList({
  todos,
  onToggle,
  onDelete,
  onAdd,
  onUpdate,
  filter,
  onFilterChange
}: TodoListProps) {
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      onAdd(newTodo.trim());
      setNewTodo('');
    }
  };

  const startEditing = (todo: TodoTask) => {
    setEditingId(todo.id);
    setEditingContent(todo.content);
  };

  const saveEdit = () => {
    if (editingContent.trim() && editingId) {
      onUpdate(editingId, editingContent.trim());
      setEditingId(null);
      setEditingContent('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingContent('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return '中';
    }
  };

  return (
    <div className="space-y-6">
      {/* 添加新任务 */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="添加新任务..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </form>

      {/* 筛选按钮 */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('all')}
        >
          全部
        </Button>
        <Button
          variant={filter === 'active' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('active')}
        >
          未完成
        </Button>
        <Button
          variant={filter === 'completed' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onFilterChange('completed')}
        >
          已完成
        </Button>
      </div>

      {/* 任务列表 */}
      <div className="space-y-2">
        {todos.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">
            暂无任务
          </Card>
        ) : (
          todos.map((todo) => (
            <Card key={todo.id} className="p-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggle(todo.id)}
                  className={todo.completed ? 'text-green-600' : 'text-gray-400'}
                >
                  <Check className="h-4 w-4" />
                </Button>

                <div className="flex-1">
                  {editingId === todo.id ? (
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="flex-1"
                      />
                      <Button size="icon" onClick={saveEdit}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="outline" onClick={cancelEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}
                      >
                        {todo.content}
                      </span>
                      <Badge className={getPriorityColor(todo.priority)}>
                        {getPriorityText(todo.priority)}
                      </Badge>
                    </div>
                  )}
                </div>

                {editingId !== todo.id && (
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditing(todo)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(todo.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}