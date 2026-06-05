import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();
const THEMES = ['light'];

export const ThemeProvider = ({ children }) => {
    const [theme, setThemeState] = useState('light');

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('dark', 'theme-light');
        root.classList.add('theme-light');
        localStorage.setItem('theme', 'light');
    }, [theme]);

    const setTheme = () => setThemeState('light');
    const cycleTheme = () => setThemeState('light');

    // Preserve compatibility for components already using toggleTheme.
    const toggleTheme = cycleTheme;

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, cycleTheme, themes: THEMES }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
