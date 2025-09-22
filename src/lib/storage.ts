import { Note } from '@/types/note';

const STORAGE_KEY = 'ai-notebook-notes';

export const storage = {
  getNotes(): Note[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading notes from localStorage:', error);
      return [];
    }
  },

  saveNotes(notes: Note[]): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes to localStorage:', error);
    }
  },

  addNote(note: Note): void {
    const notes = this.getNotes();
    notes.unshift(note);
    this.saveNotes(notes);
  },

  updateNote(id: string, updates: Partial<Note>): void {
    const notes = this.getNotes();
    const index = notes.findIndex(note => note.id === id);
    if (index !== -1) {
      notes[index] = { ...notes[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveNotes(notes);
    }
  },

  deleteNote(id: string): void {
    const notes = this.getNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    this.saveNotes(filteredNotes);
  },

  getNoteById(id: string): Note | undefined {
    const notes = this.getNotes();
    return notes.find(note => note.id === id);
  }
};