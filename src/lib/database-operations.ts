import { supabase, supabaseAdmin } from './supabase'
import { Note, Todo, Project, ChatMessage, PomodoroSession } from './supabase-types'

// Notes operations
export const notesAPI = {
  async getNotes(userId: string) {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .eq('is_deleted', false)
      .order('updated_at', { ascending: false })

    if (error) throw error
    return data as Note[]
  },

  async createNote(note: Omit<Note, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('notes')
      .insert([note])
      .select()
      .single()

    if (error) throw error
    return data as Note
  },

  async updateNote(id: string, updates: Partial<Note>) {
    const { data, error } = await supabase
      .from('notes')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Note
  },

  async deleteNote(id: string) {
    const { error } = await supabase
      .from('notes')
      .update({ is_deleted: true, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
  }
}

// Todos operations
export const todosAPI = {
  async getTodos(userId: string) {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Todo[]
  },

  async createTodo(todo: Omit<Todo, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('todos')
      .insert([todo])
      .select()
      .single()

    if (error) throw error
    return data as Todo
  },

  async updateTodo(id: string, updates: Partial<Todo>) {
    const { data, error } = await supabase
      .from('todos')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Todo
  },

  async deleteTodo(id: string) {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Projects operations
export const projectsAPI = {
  async getProjects(userId: string) {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Project[]
  },

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single()

    if (error) throw error
    return data as Project
  },

  async updateProject(id: string, updates: Partial<Project>) {
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Project
  },

  async deleteProject(id: string) {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}

// Chat operations
export const chatAPI = {
  async getChatMessages(userId: string, conversationId: string) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', userId)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data as ChatMessage[]
  },

  async createChatMessage(message: Omit<ChatMessage, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert([message])
      .select()
      .single()

    if (error) throw error
    return data as ChatMessage
  }
}

// Pomodoro operations
export const pomodoroAPI = {
  async getSessions(userId: string) {
    const { data, error } = await supabase
      .from('pomodoro_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    return data as PomodoroSession[]
  },

  async createSession(session: Omit<PomodoroSession, 'id' | 'created_at' | 'completed_at'>) {
    const { data, error } = await supabase
      .from('pomodoro_sessions')
      .insert([session])
      .select()
      .single()

    if (error) throw error
    return data as PomodoroSession
  },

  async completeSession(id: string) {
    const { data, error } = await supabase
      .from('pomodoro_sessions')
      .update({ completed: true, completed_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as PomodoroSession
  }
}