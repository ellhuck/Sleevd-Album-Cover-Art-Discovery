import React, { useState } from 'react';
import { AlbumDetails, Track } from '../types';

interface InfoPanelProps {
  albumDetails: AlbumDetails | null;
  currentTrack: Track | null;
  isLoading: boolean;
  accentColor: string;
  onTrackSelect: (track: Track) => void;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ albumDetails, currentTrack, isLoading, accentColor, onTrackSelect }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!currentTrack) return null;

  const year = currentTrack.releaseDate ? new Date(currentTrack.releaseDate).getFullYear() : 'Unknown';

  const handleAlbumClick = () => {
      if (albumDetails && albumDetails.tracks.length > 0) {
          // Find the first track (usually trackNumber 1)
          const firstTrack = albumDetails.tracks.find(t => t.trackNumber === 1) || albumDetails.tracks[0];
          onTrackSelect(firstTrack);
      }
  };

  return (
    <div 
      className={`
        relative w-full h-full flex flex-col 
        bg-retro-bg/50 dark:bg-retro-darkBg/50 
        backdrop-blur-xl border-l border-retro-dim/20
        transition-all duration-700 ease-out overflow-hidden
        ${isLoading ? 'opacity-50' : 'opacity-100'}
      `}
    >
      {/* Dynamic Ambient Background Blur */}
      <div 
        className="absolute top-[-20%] left-[-20%] w-[80%] h-[50%] rounded-full opacity-20 pointer-events-none blur-[80px] transition-colors duration-1000"
        style={{ backgroundColor: accentColor }}
      ></div>

      {/* Header Section */}
      <div className="relative z-10 p-6 border-b border-retro-dim/10">
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-retro-dim mb-2">Album Info</h3>
        <div className="flex justify-between items-end">
            <div 
                onClick={handleAlbumClick}
                className="cursor-pointer group"
                title="Load Album"
            >
                <h2 className="text-xl font-bold leading-none mb-1 line-clamp-2 group-hover:text-retro-accent transition-colors duration-300">
                    {currentTrack.collectionName}
                </h2>
                <p className="text-sm font-mono text-retro-dim group-hover:text-retro-text dark:group-hover:text-retro-darkText transition-colors">
                    {currentTrack.artistName}
                </p>
            </div>
            <div className="text-right font-mono text-xs text-retro-dim flex-shrink-0 ml-4">
                <div>{year}</div>
                <div>{albumDetails?.trackCount || 1} Tracks</div>
            </div>
        </div>
      </div>

      {/* Scrollable Tracklist */}
      <div className="relative z-10 flex-grow overflow-y-auto p-0 scrollbar-thin">
        <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full text-left px-6 py-3 bg-retro-dim/5 hover:bg-retro-dim/10 flex justify-between items-center font-mono text-xs uppercase tracking-wider border-b border-retro-dim/10 transition-colors"
        >
            <span>Tracklist</span>
            <span>{isExpanded ? '−' : '+'}</span>
        </button>

        <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            {isLoading ? (
                 <div className="p-6 space-y-3">
                    {[1,2,3,4].map(i => <div key={i} className="h-4 bg-retro-dim/10 rounded w-full animate-pulse"></div>)}
                 </div>
            ) : albumDetails?.tracks && albumDetails.tracks.length > 0 ? (
                <ul className="py-2">
                    {albumDetails.tracks.map((track, idx) => (
                        <li 
                            key={idx} 
                            onClick={() => onTrackSelect(track)}
                            className={`
                                px-6 py-3 flex items-baseline gap-4 text-sm border-b border-dashed border-retro-dim/10 transition-all cursor-pointer group relative overflow-hidden
                                ${track.trackName === currentTrack.trackName 
                                    ? 'bg-retro-accent/10 text-retro-accent font-bold pl-8' 
                                    : 'text-retro-text/80 dark:text-retro-darkText/80 hover:bg-retro-accent/5 hover:pl-8'}
                            `}
                        >
                            {/* Active indicator dot */}
                            {track.trackName === currentTrack.trackName && (
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-retro-accent"></div>
                            )}
                            
                            <span className={`font-mono text-xs w-6 text-right transition-colors ${track.trackName === currentTrack.trackName ? 'text-retro-accent' : 'text-retro-dim group-hover:text-retro-accent'}`}>
                                {track.trackNumber || idx + 1}
                            </span>
                            <span className="truncate">{track.trackName}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="p-6 text-center font-mono text-xs text-retro-dim">
                    Tracklist unavailable.
                </div>
            )}
        </div>

        {/* Copyright / Extra Info */}
        <div className="p-6 mt-auto">
             {albumDetails?.copyright && (
                 <p className="text-[10px] text-retro-dim font-mono leading-relaxed">
                     {albumDetails.copyright}
                 </p>
             )}
             <p className="text-[10px] text-retro-dim font-mono mt-2">
                Genre: <span className="text-retro-accent">{currentTrack.primaryGenreName}</span>
             </p>
        </div>
      </div>

    </div>
  );
};

export default InfoPanel;