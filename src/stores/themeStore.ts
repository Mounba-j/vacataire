import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,

  initializeTheme: () => {
    const savedTheme = localStorage.getItem('vacataire_theme');
    let isDark = false;
    
    if (savedTheme) {
      isDark = savedTheme === 'dark';
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      isDark = true;
    }
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    set({ isDark });
  },

  toggleTheme: () => {
    set((state) => {
      const newIsDark = !state.isDark;
      
      if (newIsDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('vacataire_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('vacataire_theme', 'light');
      }
      
      return { isDark: newIsDark };
    });
  },
}));
