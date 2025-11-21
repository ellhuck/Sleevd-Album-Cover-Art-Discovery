import React, { useState, useEffect, useRef } from 'react';
import { Track } from '../types';

interface DeckProps {
  history: Track[];
  onSelect: (track: Track) => void;
}

const Deck: React.FC<DeckProps> = ({ history, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      {/* Deck Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
            flex items-center gap-3 group transition-colors duration-300 px-2 py-2 rounded-sm
            ${isOpen ? 'text-retro-accent' : 'text-retro-dim hover:text-retro-text dark:hover:text-retro-darkText'}
        `}
        title="My Crate (History)"
      >
        {/* Thinner Box / Crate Icon (Stroke Width 1) */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square" strokeLinejoin="miter" className="transition-transform group-hover:-translate-y-0.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
        </svg>
        <span className="font-mono text-xs uppercase tracking-widest group-hover:tracking-[0.2em] transition-all">My Crate</span>
      </button>

      {/* Dropdown Panel - Left Side Vertical Column */}
      <div 
        className={`
            absolute top-full left-0 mt-2 w-[80px]
            flex flex-col gap-2
            transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top-left
            ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}
        `}
      >
        {history.length === 0 ? (
            <div className="bg-retro-bg/90 dark:bg-retro-darkBg/90 backdrop-blur border border-retro-dim/20 p-2 text-[8px] font-mono text-center w-[100px]">
                EMPTY
            </div>
        ) : (
            // Vertical Stack of images
            <div className="flex flex-col gap-4 p-2 pl-0">
                {history.map((track, idx) => (
                    <div 
                        key={`${track.collectionId}-${idx}`}
                        onClick={() => {
                            onSelect(track);
                            setIsOpen(false);
                        }}
                        className="group/item relative w-16 h-16 cursor-pointer transition-all duration-300 ease-out hover:translate-x-4 hover:scale-110 hover:-rotate-6 hover:z-50 hover:shadow-xl"
                        title={track.collectionName}
                        style={{ transitionDelay: `${idx * 50}ms` }} // Staggered entrance
                    >
                        {/* Album Art */}
                        <div className="absolute inset-0 border border-retro-dim/20 bg-retro-dim shadow-retro dark:shadow-retro-dark group-hover/item:shadow-2xl transition-all duration-300">
                            <img 
                                src={track.highResArtwork} 
                                alt={track.collectionName} 
                                className="w-full h-full object-cover opacity-90 group-hover/item:opacity-100 transition-opacity"
                            />
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Deck;