'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { TodoTask, TodoStats, TodoFilter } from '@/types/todo';

const STORAGE_KEY = 'ai-notebook-todos';

export function useTodos() {
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const isInitialized = useRef(false);

  // 从本地存储加载数据
  useEffect(() => {
    if (isInitialized.current) return;
    
    const loadTasks = () => {
      // 确保只在客户端运行
      if (typeof window === 'undefined') return;
      
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        
        if (stored) {
          const parsed = JSON.parse(stored);
          
          if (Array.isArray(parsed)) {
            setTasks(parsed);
          }
        }
        
        isInitialized.current = true;
      } catch (error) {
        console.error('Failed to load todos:', error);
        isInitialized.current = true;
      }
    };

    loadTasks();
  }, []);

  // 保存到本地存储
  useEffect(() => {
    // 只有在初始化完成后才保存
    if (!isInitialized.current) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save todos:', error);
    }
  }, [tasks]);

  // 添加任务
  const addTask = useCallback((content: string) => {
    const newTask: TodoTask = {
      id: Date.now().toString(),
      content: content.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority: 'medium',
    };

    setTasks(prev => [...prev, newTask]);
  }, []);

  // 切换任务完成状态
  const toggleTask = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
          : task
      )
    );
  }, []);

  // 删除任务
  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, []);

  // 编辑任务
  const editTask = useCallback((id: string, content: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, content: content.trim(), updatedAt: new Date().toISOString() }
          : task
      )
    );
  }, []);

  // 清除已完成任务
  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(task => !task.completed));
  }, []);

  // 过滤任务
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    switch (filter) {
      case 'active':
        filtered = filtered.filter(task => !task.completed);
        break;
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
    }

    return filtered.sort((a, b) => {
      // 按创建时间倒序排序
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks, filter]);

  // 统计信息
  const stats = useMemo<TodoStats>(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      active,
      completionRate,
    };
  }, [tasks]);

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    clearCompleted,
    filter,
    setFilter,
    filteredTasks,
    stats,
  };
}