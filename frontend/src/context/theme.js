export const theme = {
  colors: {
    pageBackground: '#dbdbdb', // light grey outer background
    cardBackground: '#263238',
    organisationCardBackground: 'rgba(250, 254, 255, 0.2)',
    backgroundColor: '#E3E3E3', // dark panel
    cardBorder: '#4b5563',
    textPrimary: '#ffffff',
    textSecondary: '#d1d5db',
    heading: '#ffffff',
    inputBackground: '#374151',
    inputPlaceholder: '#9ca3af',
    inputText: '#f9fafb',
    divider: '#6b7280',
    buttonBackground: 'linear-gradient(90deg, #6b7280 0%, #9ca3af 100%)',
    buttonText: '#ffffff',
    link: '#60a5fa',
    linkHover: '#93c5fd',
    subtleText: '#9ca3af',
    error: '#f87171',
  },
  radius: {
    card: '12px',
    input: '6px',
    button: '15px',
  },
  spacing: (factor) => `${factor * 4}px`,
  font: {
    family: `'Poppins', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`,
    heading: `'Song Myung', 'Times New Roman', serif`,
    size: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '24px',
      display: '32px',
    },
    weight: {
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
    },
  },
  shadow: {
    card: '0 18px 40px rgba(15, 23, 42, 0.7)',
  },
  layout: {
    maxCardWidth: '420px',
  },
}

import React, { createContext, useContext } from 'react'

const ThemeContext = createContext(theme)

export const ThemeProvider = ({ children }) => {
  return React.createElement(ThemeContext.Provider, { value: theme }, children)
}

export const useTheme = () => useContext(ThemeContext)


