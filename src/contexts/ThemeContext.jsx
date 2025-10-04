import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage for saved theme, default to 'light'
    const savedTheme = localStorage.getItem('admin-theme');
    return savedTheme || 'light';
  });

  const [isDark, setIsDark] = useState(theme === 'dark');

  useEffect(() => {
    // Update isDark state when theme changes
    setIsDark(theme === 'dark');
    
    // Save theme to localStorage
    localStorage.setItem('admin-theme', theme);
    
    // Apply theme to document root for global CSS variables if needed
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const setThemeMode = (newTheme) => {
    setTheme(newTheme);
  };

  // Theme-aware class helper
  const getThemeClasses = (lightClasses, darkClasses) => {
    return isDark ? darkClasses : lightClasses;
  };

  // Common theme classes
  const themeClasses = {
    // Backgrounds
    bg: isDark ? 'bg-gray-900' : 'bg-white',
    bgSecondary: isDark ? 'bg-gray-800' : 'bg-gray-50',
    bgCard: isDark ? 'bg-gray-800' : 'bg-white',
    bgHover: isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    
    // Text colors
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
    
    // Borders
    border: isDark ? 'border-gray-700' : 'border-gray-200',
    borderHover: isDark ? 'hover:border-gray-600' : 'hover:border-gray-300',
    
    // Shadows
    shadow: isDark ? 'shadow-gray-900/20' : 'shadow-gray-200',
    
    // Input styles
    input: isDark ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500',
    
    // Button styles
    buttonPrimary: isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white',
    buttonSecondary: isDark ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900',
    buttonGhost: isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600',
  };

  const value = {
    theme,
    isDark,
    toggleTheme,
    setThemeMode,
    getThemeClasses,
    themeClasses,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

