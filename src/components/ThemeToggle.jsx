import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      className={`theme-toggle ${className}`}
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      <div className="theme-toggle-slider">
        <div className={`theme-toggle-thumb ${isDark ? 'dark' : 'light'}`}>
          {isDark ? <FaMoon /> : <FaSun />}
        </div>
      </div>
      <span className="theme-toggle-text">{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
};

export default ThemeToggle;
