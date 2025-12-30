import { createContext, useEffect, useState, ReactNode } from 'react'
import { THEME_COLORS, ThemeColorKey } from '@app/constants/themeColors'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  primaryColor: ThemeColorKey
  setPrimaryColor: (color: ThemeColorKey) => void
  primaryColorHex: string 
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme | null
      return savedTheme || 'light'
    }
    return 'light'
  })

  const [primaryColor, setPrimaryColorState] = useState<ThemeColorKey>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('primary-color') as ThemeColorKey) || 'red'
    }
    return 'red'
  })

  const setTheme = (newTheme: Theme) => setThemeState(newTheme)
  
  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const setPrimaryColor = (color: ThemeColorKey) => {
    setPrimaryColorState(color)
  }

  useEffect(() => {
    const htmlTag = document.documentElement
    requestAnimationFrame(() => {
      htmlTag.classList.remove('dark', 'light')
      htmlTag.classList.add(theme)
      htmlTag.setAttribute('data-theme', theme)
      localStorage.setItem('theme', theme)
    })
  }, [theme])

  useEffect(() => {
    const root = document.documentElement;
    const hexColor = THEME_COLORS[primaryColor];
    
    localStorage.setItem('primary-color', primaryColor);
    root.style.setProperty('--accent-primary', hexColor);
  }, [primaryColor])

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      toggleTheme,
      primaryColor,
      setPrimaryColor,
      primaryColorHex: THEME_COLORS[primaryColor]
    }}>
      {children}
    </ThemeContext.Provider>
  )
}