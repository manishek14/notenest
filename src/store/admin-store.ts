import { create } from 'zustand';
import {
  fetchNotes,
  createNote as apiCreateNote,
  updateNote as apiUpdateNote,
  deleteNote as apiDeleteNote,
} from '@/lib/api';
import type { Note } from '@/lib/api';

type ActiveTab = 'dashboard' | 'notes' | 'settings';

interface AdminState {
  activeTab: ActiveTab;
  notes: Note[];
  isLoading: boolean;
  searchQuery: string;
  selectedNote: Note | null;
  isEditDialogOpen: boolean;
  editingNote: Note | null;
  totalSmsSent: number;
  successRate: number;
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;

  loadNotes: () => Promise<void>;
  createNote: (data: { title: string; content: string; name: string; mobile: string }) => Promise<void>;
  patchNote: (id: number, data: Partial<{ title: string; content: string; name: string; mobile: string }>) => Promise<void>;
  deleteNote: (id: number) => Promise<void>;
  addNote: (note: Note) => void;
  updateNote: (id: number, data: Partial<Note>) => void;
  removeNote: (id: number) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setSearchQuery: (q: string) => void;
  setSelectedNote: (note: Note | null) => void;
  setIsEditDialogOpen: (v: boolean) => void;
  setEditingNote: (note: Note | null) => void;
  setSidebarOpen: (v: boolean) => void;
  setMobileSidebarOpen: (v: boolean) => void;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  activeTab: 'dashboard',
  notes: [],
  isLoading: false,
  searchQuery: '',
  selectedNote: null,
  isEditDialogOpen: false,
  editingNote: null,
  totalSmsSent: 156,
  successRate: 94.5,
  sidebarOpen: true,
  mobileSidebarOpen: false,

  loadNotes: async () => {
    set({ isLoading: true });
    try {
      const notes = await fetchNotes();
      set({ notes, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  createNote: async (data) => {
    const note = await apiCreateNote(data);
    get().addNote(note);
  },

  patchNote: async (id, data) => {
    const note = await apiUpdateNote(id, data);
    get().updateNote(id, note);
  },

  deleteNote: async (id) => {
    await apiDeleteNote(id);
    get().removeNote(id);
  },

  addNote: (note) => set((s) => ({ notes: [note, ...s.notes] })),
  updateNote: (id, data) =>
    set((s) => ({
      notes: s.notes.map((n) => (n.id === id ? { ...n, ...data } : n)),
    })),
  removeNote: (id) =>
    set((s) => ({ notes: s.notes.filter((n) => n.id !== id) })),

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSelectedNote: (note) => set({ selectedNote: note }),
  setIsEditDialogOpen: (v) => set({ isEditDialogOpen: v }),
  setEditingNote: (note) => set({ editingNote: note }),
  setSidebarOpen: (v) => set({ sidebarOpen: v }),
  setMobileSidebarOpen: (v) => set({ mobileSidebarOpen: v }),
}));
