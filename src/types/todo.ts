export interface TodoTask {
  id: string;
  content: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
}

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  completionRate: number;
}

export type TodoFilter = 'all' | 'active' | 'completed';
export type TodoSortBy = 'created' | 'updated' | 'priority';

export interface TodoListState {
  tasks: TodoTask[];
  filter: TodoFilter;
  sortBy: TodoSortBy;
}