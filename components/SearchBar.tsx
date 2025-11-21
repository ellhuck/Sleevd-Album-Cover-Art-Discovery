
import React, { useState } from 'react';
import { SearchType } from '../types';

interface SearchBarProps {
  onSearch: (query: string, type: SearchType) => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('song');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      onSearch(query, searchType);
    }
  };

  return (
    <div className="w-full max-w-2xl md:ml-40 mt-4 px-4 flex gap-4 items-end relative z-40">
      
      {/* Search Type Selector */}
      <div className="flex flex-col gap-1">
          <label className="text-xs font-mono text-retro-dim uppercase tracking-wider">Type</label>
          <div className="relative">
            <select 
                value={searchType} 
                onChange={(e) => setSearchType(e.target.value as SearchType)}
                className="appearance-none bg-transparent border-b-2 border-retro-dim dark:border-retro-darkDim py-4 pr-8 font-mono text-sm uppercase focus:border-retro-accent outline-none cursor-pointer rounded-none text-retro-text dark:text-retro-darkText"
            >
                <option value="song">Song</option>
                <option value="album">Album</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-retro-dim">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
      </div>

      {/* Input */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isLoading ? "Scanning archives..." : "Enter name & hit enter..."}
        disabled={isLoading}
        className="flex-grow bg-transparent border-b-2 border-retro-dim dark:border-retro-darkDim focus:border-retro-accent py-4 font-mono text-lg outline-none transition-colors duration-300 placeholder:text-retro-dim/50 rounded-none"
        autoComplete="off"
      />
    </div>
  );
};

export default SearchBar;