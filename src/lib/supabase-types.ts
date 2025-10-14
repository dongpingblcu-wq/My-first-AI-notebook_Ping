export interface Note {
  id: string
  title: string
  content: string
  user_id: string
  created_at: string
  updated_at: string
  tags?: string[]
  is_deleted?: boolean
}

export interface Todo {
  id: string
  title: string
  description?: string
  completed: boolean
  user_id: string
  created_at: string
  updated_at: string
  due_date?: string
  priority: 'low' | 'medium' | 'high'
  tags?: string[]
}

export interface Project {
  id: string
  title: string
  description?: string
  status: 'active' | 'completed' | 'archived'
  user_id: string
  created_at: string
  updated_at: string
  due_date?: string
  priority: 'low' | 'medium' | 'high'
}

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  user_id: string
  created_at: string
  conversation_id: string
}

export interface PomodoroSession {
  id: string
  user_id: string
  duration: number // 分钟
  completed: boolean
  created_at: string
  completed_at?: string
  type: 'work' | 'break'
}