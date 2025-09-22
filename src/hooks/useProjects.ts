'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Project, 
  ProjectTask, 
  ProjectMember, 
  ProjectStats, 
  ProjectFilter, 
  ProjectSortBy,
  ProjectViewState 
} from '@/types/project';

const PROJECT_STORAGE_KEY = 'ai-notebook-projects';
const PROJECT_TASKS_STORAGE_KEY = 'ai-notebook-project-tasks';
const PROJECT_MEMBERS_STORAGE_KEY = 'ai-notebook-project-members';

// 模拟当前用户
const CURRENT_USER: ProjectMember = {
  id: 'current-user',
  name: '当前用户',
  email: 'user@example.com',
  role: 'owner',
  joinedAt: new Date().toISOString()
};

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<ProjectFilter>('all');
  const [sortBy, setSortBy] = useState<ProjectSortBy>('startDate');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  
  // 避免hydration错误 - 在客户端设置当前时间
  useEffect(() => {
    setCurrentTime(new Date());
  }, []);

  // 加载项目数据
  const loadProjects = useCallback(() => {
    // 确保只在客户端运行
    if (typeof window === 'undefined') return;
    
    console.log('useProjects: Loading projects from localStorage...');
    try {
      const stored = localStorage.getItem(PROJECT_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          console.log('useProjects: Found projects in localStorage:', parsed.length);
          setProjects(parsed);
        } else {
          console.log('useProjects: Invalid data format in localStorage');
        }
      } else {
        console.log('useProjects: No projects found in localStorage, initializing sample data');
        // 初始化示例数据
        const sampleProjects: Project[] = [
          {
            id: 'sample-1',
            name: '示例项目 1',
            description: '这是一个示例项目，用于演示项目管理功能',
            status: 'active',
            priority: 'high',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 65,
            ownerId: CURRENT_USER.id,
            memberIds: [CURRENT_USER.id],
            tags: ['开发', '前端'],
            milestones: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        setProjects(sampleProjects);
        localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(sampleProjects));
      }
    } catch (error) {
      console.error('useProjects: Failed to load projects:', error);
    }
  }, []);

  // 初始加载 - 移除页面可见性监听器
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // 保存项目数据
  useEffect(() => {
    if (projects.length > 0) {
      console.log('useProjects: Saving projects to localStorage...', projects);
      try {
        localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(projects));
        console.log('useProjects: Projects saved successfully to localStorage');
        
        // 验证保存是否成功
        const saved = localStorage.getItem(PROJECT_STORAGE_KEY);
        console.log('useProjects: Verification - saved data:', saved);
      } catch (error) {
        console.error('useProjects: Failed to save projects:', error);
      }
    }
  }, [projects, currentTime]);

  // 创建项目
  const createProject = useCallback(() => {
    console.log('Creating new project...');
    const newProject: Project = {
      id: Date.now().toString(),
      name: '新项目',
      description: '项目描述',
      status: 'planning',
      priority: 'medium',
      startDate: new Date().toISOString(),
      progress: 0,
      ownerId: CURRENT_USER.id,
      memberIds: [CURRENT_USER.id],
      tags: [],
      milestones: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('New project created:', newProject);
    setProjects(prev => {
      console.log('Previous projects:', prev);
      const updated = [...prev, newProject];
      console.log('Updated projects:', updated);
      return updated;
    });
    return newProject;
  }, []);

  // 更新项目
  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    console.log('Updating project:', id, updates);
    try {
      setProjects(prev => {
        const updated = prev.map(project => 
          project.id === id 
            ? { ...project, ...updates, updatedAt: new Date().toISOString() }
            : project
        );
        console.log('Projects after update:', updated);
        return updated;
      });
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  }, []);

  // 删除项目
  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    // 同时删除相关的任务
    const storedTasks = localStorage.getItem(PROJECT_TASKS_STORAGE_KEY);
    if (storedTasks) {
      const tasks: ProjectTask[] = JSON.parse(storedTasks);
      const filteredTasks = tasks.filter(task => task.projectId !== id);
      localStorage.setItem(PROJECT_TASKS_STORAGE_KEY, JSON.stringify(filteredTasks));
    }
  }, []);

  // 过滤项目
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // 应用状态过滤
    if (filter !== 'all') {
      filtered = filtered.filter(project => project.status === filter);
    }

    // 应用排序
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'startDate':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case 'endDate':
          if (!a.endDate || !b.endDate) return 0;
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'progress':
          return b.progress - a.progress;
        default:
          return 0;
      }
    });

    return filtered;
  }, [projects, filter, sortBy]);

  // 计算统计信息
  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'active').length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const overdue = currentTime ? projects.filter(p => 
      p.status === 'active' && p.endDate && new Date(p.endDate) < currentTime
    ).length : 0;

    return {
      totalProjects: total,
      activeProjects: active,
      completedProjects: completed,
      overdueProjects: overdue,
      totalTasks: 0, // 将在useProjectDetail中计算
      completedTasks: 0,
      overdueTasks: 0,
      totalHours: 0,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [projects]);

  return {
    projects,
    filteredProjects,
    stats,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    view,
    setView,
    createProject,
    updateProject,
    deleteProject,
    loadProjects // 暴露刷新函数
  };
}