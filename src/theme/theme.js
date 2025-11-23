import React, { createContext, useContext } from 'react';

const ThemeContext = createContext();

export const colors = {
  primaryBlack: '#000000',
  primaryWhite: '#FFFFFF',
  textPrimary: '#111111',
  textSecondary: '#6F6F6F',
  border: '#E6E6E6',
  card: '#F9F9F9',
};

export const spacing = [4, 8, 12, 16, 20, 24, 32];

export const radius = {
  sm: 6,
  md: 12,
  lg: 14,
  xl: 16,
};

export const typography = {
  title: {
    fontSize: 34,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  button: {
    fontSize: 16,
    fontWeight: '600',
  },
};

export const theme = {
  colors,
  spacing,
  radius,
  typography,
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

