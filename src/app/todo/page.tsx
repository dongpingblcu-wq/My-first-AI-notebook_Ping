'use client';

import { TodoList } from '@/components/todo/todo-list';
import { TodoStats } from '@/components/todo/todo-stats';
import { useTodos } from '@/hooks/useTodos';
import { AppLayout } from '@/components/app-layout';

export default function TodoPage() {
  const {
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    clearCompleted,
    filter,
    setFilter,
    filteredTasks,
    stats
  } = useTodos();

  return (
    <AppLayout>
      <div className="flex-1 p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">待办清单</h1>
          <p className="text-gray-600">高效管理您的日常任务</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <TodoList
              tasks={filteredTasks}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onAdd={addTask}
              onEdit={editTask}
              filter={filter}
              onFilterChange={setFilter}
            />
          </div>
          
          <div className="lg:col-span-1">
            <TodoStats 
              stats={stats}
              onClearCompleted={clearCompleted}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}