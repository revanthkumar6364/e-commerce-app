/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect } from 'react';

export const ThemeContext = createContext({ theme: 'light', toggle: () => { } });

export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }, []);
  function toggle() { /* disabled */ }
  return <ThemeContext.Provider value={{ theme: 'light', toggle }}>{children}</ThemeContext.Provider>;
}
