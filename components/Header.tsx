
import React from 'react';
import { AccentColor } from '../types';

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  currentAccent: string;
  setAccent: (color: string) => void;
  palette: AccentColor[];
}

const Header: React.FC<HeaderProps> = ({ darkMode, toggleTheme, currentAccent, setAccent, palette }) => {
  return (
    <header className="w-full border-b border-retro-text dark:border-retro-darkText transition-colors duration-500 relative z-50 bg-retro-bg dark:bg-retro-darkBg">
      <div className="w-full max-w-[1800px] mx-auto p-4 md:px-8 md:py-6 flex flex-col md:flex-row gap-6 justify-between items-center">
        
        {/* Left Group: Logo */}
        <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-start">
            <div className="relative group cursor-pointer overflow-hidden" onClick={() => window.location.reload()}>
              <h1 className="text-3xl font-black tracking-tighter select-none group-hover:animate-twitch group-hover:italic transition-all">
                Sleevd.
              </h1>
              <div className="absolute bottom-0 left-0 w-full h-[3px] bg-retro-accent transform -translate-x-[101%] group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
            </div>
        </div>

        {/* Controls Container */}
        <div className="flex items-center gap-6">
          
          {/* Color Picker */}
          <div className="flex gap-2">
              {palette.map((c) => (
                  <button
                      key={c.value}
                      onClick={() => setAccent(c.value)}
                      title={c.name}
                      className={`w-6 h-6 rounded-full border border-retro-text dark:border-retro-darkText transition-transform hover:scale-110 ${currentAccent === c.value ? 'ring-2 ring-retro-text dark:ring-retro-darkText ring-offset-2 ring-offset-retro-bg dark:ring-offset-retro-darkBg' : ''}`}
                      style={{ backgroundColor: c.value }}
                  />
              ))}
          </div>

          {/* Theme Toggle */}
          <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center border border-retro-text dark:border-retro-darkText hover:bg-retro-text hover:text-retro-bg dark:hover:bg-retro-darkText dark:hover:text-retro-darkBg transition-all font-mono text-lg"
              aria-label="Toggle Theme"
          >
              {darkMode ? '☾' : '☀'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
