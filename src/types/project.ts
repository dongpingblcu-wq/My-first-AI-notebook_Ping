export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string;
  endDate?: string;
  progress: number; // 0-100
  ownerId: string;
  memberIds: string[];
  tags: string[];
  milestones: ProjectMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  progress: number; // 0-100
  tags: string[];
  dependencies: string[]; // task IDs
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar?: string;
  joinedAt: string;
}

export interface ProjectMilestone {
  id: string;
  projectId: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed';
  completedAt?: string;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  overdueProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  totalHours: number;
  completionRate: number;
}

export type ProjectFilter = 'all' | 'active' | 'completed' | 'archived';
export type TaskFilter = 'all' | 'todo' | 'in-progress' | 'review' | 'done';
export type ProjectSortBy = 'name' | 'startDate' | 'endDate' | 'priority' | 'progress';
export type TaskSortBy = 'created' | 'updated' | 'priority' | 'dueDate' | 'progress';

export interface ProjectViewState {
  view: 'board' | 'list' | 'timeline' | 'calendar';
  projectFilter: ProjectFilter;
  taskFilter: TaskFilter;
  projectSortBy: ProjectSortBy;
  taskSortBy: TaskSortBy;
}

export interface KanbanColumn {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  taskIds: string[];
}

export interface TimelineEvent {
  id: string;
  type: 'task' | 'milestone' | 'deadline';
  title: string;
  date: string;
  endDate?: string;
  projectId: string;
}