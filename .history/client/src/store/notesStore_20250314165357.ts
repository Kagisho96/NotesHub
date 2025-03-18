import notesService, { CreateNoteData, Note, UpdateNoteData } from "../services/notes";
import { create } from "zustand";

interface NotesState {
  notes: Note[];
  publicNotes: Note[];
  currentNote: Note | null;
  isLoading: boolean;
  error: string | null;
  fetchNotes: () => Promise<void>;
  fetchPublicNotes: () => Promise<void>;
  fetchNoteById: (id: string) => Promise<void>;
  createNote: (noteData: CreateNoteData) => Promise<void>;
  updateNote: (id: string, noteData: UpdateNoteData) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  clearCurrentNote: () => void;
  clearError: () => void;
}

const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  publicNotes: [],
  currentNote: null,
  isLoading: false,
  error: null,
  
  fetchNotes: async () => {
    try {
      set({ isLoading: true, error: null });
      const notes = await notesService.getNotes();
      set({ notes, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch notes',
        isLoading: false 
      });
    }
  },
  
  fetchPublicNotes: async () => {
    try {
      set({ isLoading: true, error: null });
      const publicNotes = await notesService.getPublicNotes();
      set({ publicNotes, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch public notes',
        isLoading: false 
      });
    }
  },
  
  fetchNoteById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const note = await notesService.getNoteById(id);
      set({ currentNote: note, isLoading: false });
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to fetch note',
        isLoading: false 
      });
    }
  },
  
  createNote: async (noteData: CreateNoteData) => {
    try {
      set({ isLoading: true, error: null });
      const newNote = await notesService.createNote(noteData);
      set(state => ({ 
        notes: [newNote, ...state.notes],
        isLoading: false 
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to create note',
        isLoading: false 
      });
    }
  },
  
  updateNote: async (id: string, noteData: UpdateNoteData) => {
    try {
      set({ isLoading: true, error: null });
      const updatedNote = await notesService.updateNote(id, noteData);
      set(state => ({
        notes: state.notes.map(note => 
          note.id === id ? updatedNote : note
        ),
        currentNote: updatedNote,
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to update note',
        isLoading: false 
      });
    }
  },
  
  deleteNote: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await notesService.deleteNote(id);
      set(state => ({
        notes: state.notes.filter(note => note.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || 'Failed to delete note',
        isLoading: false 
      });
    }
  },
  
  clearCurrentNote: () => set({ currentNote: null }),
  
  clearError: () => set({ error: null })
}));

export default useNotesStore; 