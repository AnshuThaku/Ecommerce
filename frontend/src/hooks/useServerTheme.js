import { useEffect } from 'react';
import { festivalThemes } from '../ThemeConfig';
import axiosInstance from '../utils/axiosInstance';

export const useServerTheme = () => {
  useEffect(() => {
    const fetchCurrentTheme = async () => {
      try {
        const response = await axiosInstance.get('/theme/active');
        const data = response.data;
        
        let activeThemeKey = 'default';

        if (data && data.theme && festivalThemes[data.theme]) {
          activeThemeKey = data.theme;
        }

        const theme = festivalThemes[activeThemeKey];
        const root = document.documentElement;

        // ⚡ Injecting colors to CSS
        root.style.setProperty('--theme-bg-light', theme.bgLight);
        root.style.setProperty('--theme-bg-dark', theme.bgDark);
        root.style.setProperty('--theme-primary', theme.primary);
        root.style.setProperty('--theme-text-main', theme.textMain);
        root.style.setProperty('--theme-text-light', theme.textLight);
        root.style.setProperty('--theme-gradient', theme.heroGradient);

      } catch (error) {
        console.error("Theme Load Error:", error);
        // Fallback to default if API fails
        const defaultTheme = festivalThemes['default'];
        const root = document.documentElement;
        root.style.setProperty('--theme-bg-light', defaultTheme.bgLight);
        root.style.setProperty('--theme-bg-dark', defaultTheme.bgDark);
        root.style.setProperty('--theme-primary', defaultTheme.primary);
        root.style.setProperty('--theme-text-main', defaultTheme.textMain);
        root.style.setProperty('--theme-text-light', defaultTheme.textLight);
        root.style.setProperty('--theme-gradient', defaultTheme.heroGradient);
      }
    };

    fetchCurrentTheme();
  }, []);
};