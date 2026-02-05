import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function ThemeToggle(){
  const { theme, toggle } = useContext(ThemeContext);
  return (
    <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">{theme === 'light' ? '🌞' : '🌙'}</button>
  );
}
