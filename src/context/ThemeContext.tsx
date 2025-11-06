import React, { createContext, useContext } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme } from '../styles/theme';

type Theme = typeof lightTheme | typeof darkTheme;
type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  themePreference: ThemePreference;
  toggleTheme: (preference: ThemePreference) => void;
}

const THEME_STORAGE_KEY = '@ThemePreference';

const ThemeContext = createContext<ThemeContextType>({
  theme: darkTheme,
  themePreference: 'system',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreference] = React.useState<ThemePreference>('system');
  const [currentTheme, setCurrentTheme] = React.useState<Theme>(darkTheme);

  // 1. Carregar a preferência do usuário
  React.useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const storedPreference = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedPreference) {
          setThemePreference(storedPreference as ThemePreference);
        }
      } catch (e) {
        console.error('Failed to load theme preference from storage', e);
      }
    };
    loadThemePreference();
  }, []);

  // 2. Calcular o tema atual com base na preferência e no sistema
  React.useEffect(() => {
    let activeTheme: Theme;
    if (themePreference === 'system') {
      activeTheme = systemColorScheme === 'light' ? lightTheme : darkTheme;
    } else {
      activeTheme = themePreference === 'light' ? lightTheme : darkTheme;
    }
    setCurrentTheme(activeTheme);
  }, [themePreference, systemColorScheme]);

  // 3. Função para alternar e salvar a preferência
  const toggleTheme = async (preference: ThemePreference) => {
    try {
      setThemePreference(preference);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch (e) {
      console.error('Failed to save theme preference to storage', e);
    }
  };

  const contextValue = {
    theme: currentTheme,
    themePreference,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);