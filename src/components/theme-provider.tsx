import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light'  // Modified to only allow light theme

type ThemeProviderProps = {
    children: React.ReactNode
    storageKey?: string
}

type ThemeProviderState = {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
    theme: 'light',
    setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
    children,
    storageKey = 'vite-ui-theme',
    ...props
}: ThemeProviderProps) {
    const [theme] = useState<Theme>('light')

    useEffect(() => {
        const root = window.document.documentElement
        root.classList.remove('dark')
        root.classList.add('light')
    }, [])

    const value = {
        theme,
        setTheme: () => {}, // Empty function since we don't allow theme changes
    }

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext)

    if (context === undefined)
        throw new Error('useTheme must be used within a ThemeProvider')

    return context
}
