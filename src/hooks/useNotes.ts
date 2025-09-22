import { useState, useEffect, useMemo } from 'react';
import { Note } from '@/types/note';
import { storage } from '@/lib/storage';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadedNotes = storage.getNotes();
    setNotes(loadedNotes);
    
    if (loadedNotes.length > 0 && !activeNoteId) {
      setActiveNoteId(loadedNotes[0].id);
    }
  }, []);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: '',
      content: '',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    storage.addNote(newNote);
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    return newNote;
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    storage.updateNote(id, updates);
    setNotes(prev => 
      prev.map(note => 
        note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
      )
    );
  };

  const deleteNote = (id: string) => {
    storage.deleteNote(id);
    setNotes(prev => prev.filter(note => note.id !== id));
    
    if (activeNoteId === id) {
      const remainingNotes = notes.filter(note => note.id !== id);
      setActiveNoteId(remainingNotes.length > 0 ? remainingNotes[0].id : null);
    }
  };

  const filteredNotes = useMemo(() => {
    if (!searchTerm.trim()) {
      return notes;
    }
    
    const term = searchTerm.toLowerCase().trim();
    return notes.filter(note => 
      note.title.toLowerCase().includes(term) || 
      note.content.toLowerCase().includes(term) ||
      note.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }, [notes, searchTerm]);

  const activeNote = notes.find(note => note.id === activeNoteId) || null;

  return {
    notes: filteredNotes,
    allNotes: notes,
    activeNote,
    activeNoteId,
    createNote,
    updateNote,
    deleteNote,
    setActiveNoteId,
    searchTerm,
    setSearchTerm,
  };
}