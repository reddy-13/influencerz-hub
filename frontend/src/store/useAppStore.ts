import { create } from 'zustand';

interface AppState {
    theme: 'dark' | 'light';
    toggleTheme: () => void;
    sidebarOpen: boolean;
    toggleSidebar: () => void;
    user: { id: string; name: string; role?: string } | null;
    setUser: (user: { id: string; name: string; role?: string } | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
    theme: 'dark',
    toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
    sidebarOpen: true,
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    user: null,
    setUser: (user) => set({ user }),
}));
