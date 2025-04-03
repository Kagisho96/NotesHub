import api from "./api";

export interface Tag {
  id: string;
  name: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  userId: string;
  userName: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tags: Tag[];
  likes: number;
  dislikes: number;
  userReaction: 'like' | 'dislike' | null;
  comments: Comment[];
}

export interface CreateNoteData {
  title: string;
  content: string;
  isPublic?: boolean;
  tags?: string[];
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  isPublic?: boolean;
  tags?: string[];
}

const notesService = {
  getNotes: async (): Promise<Note[]> => {
    try {
      const response = await api.get<{ notes: Note[] }>('/notes');
      return response.data.notes;
    } catch (error) {
      throw error;
    }
  },
  
  getPublicNotes: async (): Promise<Note[]> => {
    try {
      const response = await api.get<{ notes: Note[] }>('/notes/public');
      return response.data.notes;
    } catch (error) {
      throw error;
    }
  },
  
  getNoteById: async (id: string): Promise<Note> => {
    try {
      const response = await api.get<{ note: Note }>(`/notes/${id}`);
      return response.data.note;
    } catch (error) {
      throw error;
    }
  },
  
  createNote: async (noteData: CreateNoteData): Promise<Note> => {
    try {
      const response = await api.post<{ note: Note, message: string }>('/notes', noteData);
      return response.data.note;
    } catch (error) {
      throw error;
    }
  },
  
  updateNote: async (id: string, noteData: UpdateNoteData): Promise<Note> => {
    try {
      const response = await api.put<{ note: Note, message: string }>(`/notes/${id}`, noteData);
      return response.data.note;
    } catch (error) {
      throw error;
    }
  },
  
  deleteNote: async (id: string): Promise<void> => {
    try {
      await api.delete(`/notes/${id}`);
    } catch (error) {
      throw error;
    }
  },

  likeNote: async (id: string): Promise<Note> => {
    try {
      const response = await api.post<{ note: Note }>(`/notes/${id}/like`);
      return response.data.note;
    } catch (error) {
      throw error;
    }
  },

  dislikeNote: async (id: string): Promise<Note> => {
    try {
      const response = await api.post<{ note: Note }>(`/notes/${id}/dislike`);
      return response.data.note;
    } catch (error) {
      throw error;
    }
  },

  addComment: async (id: string, text: string): Promise<Comment> => {
    try {
      const response = await api.post<{ comment: Comment }>(`/notes/${id}/comments`, { text });
      return response.data.comment;
    } catch (error) {
      throw error;
    }
  },

  getComments: async (id: string): Promise<Comment[]> => {
    try {
      const response = await api.get<{ comments: Comment[] }>(`/notes/${id}/comments`);
      return response.data.comments;
    } catch (error) {
      throw error;
    }
  }
};

export default notesService; 