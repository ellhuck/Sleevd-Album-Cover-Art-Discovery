
import React, { useRef, useState, useEffect } from 'react';
import { Track, ViewMode, LinerNotes } from '../types';

interface TrackDetailsProps {
  track: Track;
  mode: ViewMode;
  setMode: (mode: ViewMode) => void;
  linerNotes: LinerNotes | null;
  isNotesLoading: boolean;
  accentColor: string;
}

// Helper to determine black or white text based on background luminance
const getContrastColor = (hexColor: string) => {
  if (!hexColor) return '#000000';
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq >= 128 ? '#000000' : '#ffffff';
};

const TrackDetails: React.FC<TrackDetailsProps> = ({ track, mode, setMode, linerNotes, isNotesLoading, accentColor }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Reset audio state when track changes
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current.load();
    }
    setIsPlaying(false);
  }, [track]);

  const togglePlay = () => {
    if (audioRef.current) {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.error("Playback failed", e));
        }
        setIsPlaying(!isPlaying);
    }
  };

  const handleEnded = () => setIsPlaying(false);

  const openSpotify = () => {
      const query = encodeURIComponent(`${track.trackName} ${track.artistName}`);
      window.open(`https://open.spotify.com/search/${query}`, '_blank');
  };

  const textColor = getContrastColor(accentColor);

  return (
    <div className="flex flex-col items-start text-left w-full max-w-3xl animate-[fadeIn_0.5s_ease-out]">
      
      {/* Header Row - Title Left, Player Right with significant gap for visual balance */}
      <div className="flex items-center flex-row w-full gap-16 mb-8">
        <div className="min-w-0 flex-shrink">
            <h2 className="text-4xl md:text-6xl font-bold leading-none mb-2 break-words tracking-tight">{track.trackName}</h2>
            <div className="font-mono text-retro-dim dark:text-retro-darkDim text-xl">
                {track.artistName}
            </div>
        </div>
        
        {/* Audio Player Control - Solid Filled Box */}
        {track.previewUrl && (
            <div className="flex-shrink-0">
                <audio ref={audioRef} src={track.previewUrl} onEnded={handleEnded} />
                
                <button 
                    onClick={togglePlay}
                    className="group relative w-24 h-24 flex flex-col items-center justify-center transition-all duration-300 hover:scale-105 shadow-xl"
                    style={{ backgroundColor: accentColor, color: textColor }}
                    title="Preview Track"
                >
                    <div className="mb-1 transform group-hover:scale-110 transition-transform">
                        {isPlaying ? (
                            // Square Pause
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="6" y="4" width="4" height="16" />
                                <rect x="14" y="4" width="4" height="16" />
                            </svg>
                        ) : (
                            // Sharp Play
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M5 3l14 9-14 9V3z" />
                            </svg>
                        )}
                    </div>
                    <div className={`text-[10px] font-mono uppercase tracking-wider ${isPlaying ? 'animate-pulse' : ''}`}>
                        {isPlaying ? 'Playing' : 'Preview'}
                    </div>
                </button>
            </div>
        )}
      </div>

      {/* Controls Row: View Modes + Spotify - Aligned Start */}
      <div className="flex flex-wrap items-center justify-start gap-6 mb-10 w-full pl-1">
        
        {/* Spotify Button */}
         <button 
            onClick={openSpotify}
            className="flex items-center gap-2 px-5 py-2 rounded-full border border-[#1DB954] text-[#1DB954] hover:bg-[#1DB954] hover:text-white transition-all duration-300 group"
        >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            <span className="font-mono text-[10px] uppercase tracking-wider font-bold">Open on Spotify</span>
        </button>

        <div className="h-6 w-px bg-retro-dim/20 mx-2 hidden md:block"></div>

        <div className="flex gap-0">
            <button
            onClick={() => setMode(ViewMode.SLEEVE)}
            className={`
                px-6 py-2 font-mono text-xs uppercase border border-r-0 transition-all
                ${mode === ViewMode.SLEEVE 
                ? 'bg-retro-accent text-black font-bold border-retro-accent' 
                : 'border-retro-dim text-retro-text/70 dark:text-retro-darkText/70 hover:text-retro-text dark:hover:text-retro-darkText hover:bg-retro-dim/10'}
            `}
            >
            Sleeve
            </button>
            <button
            onClick={() => setMode(ViewMode.VINYL)}
            className={`
                px-6 py-2 font-mono text-xs uppercase border transition-all
                ${mode === ViewMode.VINYL 
                ? 'bg-retro-accent text-black font-bold border-retro-accent' 
                : 'border-retro-dim text-retro-text/70 dark:text-retro-darkText/70 hover:text-retro-text dark:hover:text-retro-darkText hover:bg-retro-dim/10'}
            `}
            >
            Vinyl
            </button>
        </div>

      </div>

      {/* AI Liner Notes Section */}
      <div className="w-full border-t border-retro-dim/30 pt-6 mt-2">
        <div className="font-mono text-xs uppercase tracking-widest text-retro-accent mb-4 text-left">
          AI Generated Liner Notes
        </div>
        
        {isNotesLoading ? (
            <div className="animate-pulse flex flex-col gap-2 items-start">
                <div className="h-2 w-3/4 bg-retro-dim/20 rounded"></div>
                <div className="h-2 w-1/2 bg-retro-dim/20 rounded"></div>
            </div>
        ) : linerNotes ? (
            <div className="space-y-4">
                 <p className="font-serif italic text-xl text-retro-text/80 dark:text-retro-darkText/90 leading-relaxed">
                    "{linerNotes.fact}"
                </p>
                <div className="flex justify-start gap-4 text-sm font-mono text-retro-dim">
                    <span className="border px-2 py-1 border-retro-dim/20 rounded">Mood: {linerNotes.mood}</span>
                </div>
                <div className="text-xs font-mono text-retro-dim mt-4">
                    Listeners also liked: {linerNotes.similarArtists.join(', ')}
                </div>
            </div>
        ) : (
            <p className="font-mono text-sm text-retro-dim">No archival data found.</p>
        )}
      </div>

    </div>
  );
};

export default TrackDetails;
