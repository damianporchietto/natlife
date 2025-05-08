import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
    >
      {isDarkMode ? (
        <>
          <span role="img" aria-label="Light Mode">🌞</span>
          <span>Light</span>
        </>
      ) : (
        <>
          <span role="img" aria-label="Dark Mode">🌙</span>
          <span>Dark</span>
        </>
      )}
    </button>
  );
} 