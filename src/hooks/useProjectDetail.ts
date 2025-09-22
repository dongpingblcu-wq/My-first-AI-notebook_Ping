'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Project, ProjectTask, ProjectMember } from '@/types/project';

const PROJECT_STORAGE_KEY = 'ai-notebook-projects';
const PROJECT_TASKS_STORAGE_KEY = 'ai-notebook-project-tasks';
const PROJECT_MEMBERS_STORAGE_KEY = 'ai-notebook-project-members';

export function useProjectDetail(projectId: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  
  // 避免hydration错误 - 在客户端设置当前时间
  useEffect(() => {
    setCurrentTime(new Date());
  }, []);

  // 加载项目详情数据
  useEffect(() => {
    const loadProjectData = async () => {
      // 确保只在客户端运行
      if (typeof window === 'undefined') return;
      
      setLoading(true);
      try {
        // 加载项目信息
        const projectsStr = localStorage.getItem(PROJECT_STORAGE_KEY);
        if (projectsStr) {
          const projects: Project[] = JSON.parse(projectsStr);
          const foundProject = projects.find(p => p.id === projectId);
          if (foundProject) {
            setProject(foundProject);
          }
        }

        // 加载任务数据
        const tasksStr = localStorage.getItem(PROJECT_TASKS_STORAGE_KEY);
        if (tasksStr) {
          const allTasks: ProjectTask[] = JSON.parse(tasksStr);
          const projectTasks = allTasks.filter(task => task.projectId === projectId);
          setTasks(projectTasks);
        } else {
          // 初始化示例任务
          const sampleTasks: ProjectTask[] = [
            {
              id: 'task-1',
              projectId: projectId,
              title: '需求分析',
              description: '分析项目需求并制定开发计划',
              status: 'done',
              priority: 'high',
              progress: 100,
              tags: ['planning'],
              dependencies: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              completedAt: new Date().toISOString()
            },
            {
              id: 'task-2',
              projectId: projectId,
              title: 'UI设计',
              description: '设计用户界面和交互流程',
              status: 'in-progress',
              priority: 'medium',
              progress: 60,
              tags: ['design'],
              dependencies: ['task-1'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            },
            {
              id: 'task-3',
              projectId: projectId,
              title: '前端开发',
              description: '实现前端界面和交互功能',
              status: 'todo',
              priority: 'high',
              progress: 0,
              tags: ['frontend'],
              dependencies: ['task-2'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ];
          setTasks(sampleTasks);
          localStorage.setItem(PROJECT_TASKS_STORAGE_KEY, JSON.stringify(sampleTasks));
        }

        // 加载成员数据
        const membersStr = localStorage.getItem(PROJECT_MEMBERS_STORAGE_KEY);
        if (membersStr) {
          const allMembers: ProjectMember[] = JSON.parse(membersStr);
          setMembers(allMembers);
        } else {
          // 初始化当前用户
          const currentUser: ProjectMember = {
            id: 'current-user',
            name: '当前用户',
            email: 'user@example.com',
            role: 'owner',
            joinedAt: new Date().toISOString()
          };
          setMembers([currentUser]);
          localStorage.setItem(PROJECT_MEMBERS_STORAGE_KEY, JSON.stringify([currentUser]));
        }
      } catch (error) {
        console.error('Failed to load project data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  // 保存任务数据
  const saveTasks = useCallback((updatedTasks: ProjectTask[]) => {
    try {
      // 获取所有任务
      const allTasksStr = localStorage.getItem(PROJECT_TASKS_STORAGE_KEY);
      let allTasks: ProjectTask[] = [];
      if (allTasksStr) {
        allTasks = JSON.parse(allTasksStr);
      }

      // 移除当前项目的旧任务
      const otherTasks = allTasks.filter(task => task.projectId !== projectId);
      
      // 添加更新后的任务
      const newAllTasks = [...otherTasks, ...updatedTasks];
      
      localStorage.setItem(PROJECT_TASKS_STORAGE_KEY, JSON.stringify(newAllTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Failed to save tasks:', error);
    }
  }, [projectId]);

  // 更新项目
  const updateProject = useCallback((updates: Partial<Project>) => {
    console.log('useProjectDetail: Updating project with:', updates);
    if (!project) {
      console.log('useProjectDetail: No project found, skipping update');
      return;
    }

    try {
      const updatedProject = { ...project, ...updates, updatedAt: new Date().toISOString() };
      console.log('useProjectDetail: Updated project data:', updatedProject);
      setProject(updatedProject);

      // 更新项目列表
      const projectsStr = localStorage.getItem(PROJECT_STORAGE_KEY);
      console.log('useProjectDetail: Current projects from localStorage:', projectsStr);
      
      if (projectsStr) {
        const projects: Project[] = JSON.parse(projectsStr);
        const updatedProjects = projects.map(p => 
          p.id === projectId ? updatedProject : p
        );
        console.log('useProjectDetail: Saving to localStorage:', updatedProjects);
        localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(updatedProjects));
        
        // 验证保存是否成功
        const saved = localStorage.getItem(PROJECT_STORAGE_KEY);
        console.log('useProjectDetail: Verification - saved data:', saved);
        
        console.log('useProjectDetail: localStorage updated successfully');
      } else {
        console.log('useProjectDetail: No projects found in localStorage');
      }
    } catch (error) {
      console.error('useProjectDetail: Failed to update project:', error);
      throw error;
    }
  }, [project, projectId]);

  // 添加任务
  const addTask = useCallback((task: Omit<ProjectTask, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: ProjectTask = {
      ...task,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedTasks = [...tasks, newTask];
    saveTasks(updatedTasks);
    return newTask;
  }, [tasks, saveTasks]);

  // 更新任务
  const updateTask = useCallback((taskId: string, updates: Partial<ProjectTask>) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updatedTask = { 
          ...task, 
          ...updates, 
          updatedAt: new Date().toISOString()
        };
        
        // 如果标记为完成，设置完成时间
        if (updates.status === 'done' && task.status !== 'done') {
          updatedTask.completedAt = new Date().toISOString();
          updatedTask.progress = 100;
        }
        
        return updatedTask;
      }
      return task;
    });

    saveTasks(updatedTasks);
  }, [tasks, saveTasks]);

  // 删除任务
  const deleteTask = useCallback((taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    saveTasks(updatedTasks);
  }, [tasks, saveTasks]);

  // 添加成员
  const addMember = useCallback((member: Omit<ProjectMember, 'id' | 'joinedAt'>) => {
    const newMember: ProjectMember = {
      ...member,
      id: `member-${Date.now()}`,
      joinedAt: new Date().toISOString()
    };

    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    
    // 更新项目成员列表
    updateProject({ 
      memberIds: [...(project?.memberIds || []), newMember.id] 
    });

    localStorage.setItem(PROJECT_MEMBERS_STORAGE_KEY, JSON.stringify(updatedMembers));
  }, [members, project?.memberIds, updateProject]);

  // 移除成员
  const removeMember = useCallback((memberId: string) => {
    const updatedMembers = members.filter(m => m.id !== memberId);
    setMembers(updatedMembers);
    
    // 更新项目成员列表
    updateProject({ 
      memberIds: (project?.memberIds || []).filter(id => id !== memberId) 
    });

    localStorage.setItem(PROJECT_MEMBERS_STORAGE_KEY, JSON.stringify(updatedMembers));
  }, [members, project?.memberIds, updateProject]);

  // 计算统计信息
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const overdue = currentTime ? tasks.filter(t => 
      t.dueDate && t.status !== 'done' && new Date(t.dueDate) < currentTime
    ).length : 0;
    const totalHours = tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);

    return {
      totalTasks: total,
      completedTasks: completed,
      inProgressTasks: inProgress,
      overdueTasks: overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      totalHours,
      estimatedHours: tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0)
    };
  }, [tasks, currentTime]);

  return {
    project,
    tasks,
    members,
    stats,
    loading,
    updateProject,
    addTask,
    updateTask,
    deleteTask,
    addMember,
    removeMember
  };
}