
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import Visualizer from './components/Visualizer';
import TrackDetails from './components/TrackDetails';
import InfoPanel from './components/InfoPanel';
import Deck from './components/Deck';
import { Track, ViewMode, LinerNotes, SearchType, ACCENT_COLORS, AccentColor, AlbumDetails } from './types';
import { searchTracks, getAlbumDetails } from './services/musicService';
import { generateLinerNotes } from './services/geminiService';
import { extractPalette } from './utils/colorUtils';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0].value);
  const [palette, setPalette] = useState<AccentColor[]>(ACCENT_COLORS);

  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [history, setHistory] = useState<Track[]>([]);
  
  const [albumDetails, setAlbumDetails] = useState<AlbumDetails | null>(null);
  
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SLEEVE);
  const [isLoading, setIsLoading] = useState(false);
  const [isAlbumLoading, setIsAlbumLoading] = useState(false);
  const [linerNotes, setLinerNotes] = useState<LinerNotes | null>(null);
  const [isNotesLoading, setIsNotesLoading] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accentColor);
  }, [accentColor]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };

  // Shared logic to load side-effects for a track (Notes, Palette, Album)
  const loadTrackData = async (track: Track, isNewAlbum: boolean) => {
    // 1. Color Palette
    if (isNewAlbum || (currentTrack && track.highResArtwork !== currentTrack.highResArtwork)) {
        extractPalette(track.highResArtwork).then(newPalette => {
            if (newPalette.length > 0) {
                setPalette(newPalette);
                setAccentColor(newPalette[0].value);
            }
        });
    }

    // 2. Fetch Album Details
    if (isNewAlbum && track.collectionId) {
        setIsAlbumLoading(true);
        getAlbumDetails(track.collectionId).then(details => {
            setAlbumDetails(details);
            setIsAlbumLoading(false);
        });
    } else if (isNewAlbum) {
        setAlbumDetails(null);
        setIsAlbumLoading(false);
    }

    // 3. Fetch AI Notes
    setIsNotesLoading(true);
    setLinerNotes(null);
    try {
         const notes = await generateLinerNotes(track);
         setLinerNotes(notes);
    } catch (e) {
        console.error(e);
    } finally {
        setIsNotesLoading(false);
    }
  };

  const handleSearch = async (query: string, type: SearchType) => {
    setIsLoading(true);
    
    try {
      const track = await searchTracks(query, type);
      if (track) {
        setCurrentTrack(track);
        setIsLoading(false);

        // Update History: Filter dupes by collectionId
        setHistory(prev => {
            const filtered = prev.filter(t => t.collectionId !== track.collectionId);
            return [track, ...filtered].slice(0, 12);
        });

        await loadTrackData(track, true);
      } else {
        alert("No match found in archives.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleTrackSelect = (track: Track) => {
      if (track.trackName === currentTrack?.trackName) return;
      
      setCurrentTrack(track);
      if (!track.highResArtwork && currentTrack?.highResArtwork) {
          track.highResArtwork = currentTrack.highResArtwork;
      }
      loadTrackData(track, false);
  };

  const handleHistorySelect = (track: Track) => {
      setCurrentTrack(track);
      loadTrackData(track, true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        darkMode={darkMode} 
        toggleTheme={toggleTheme} 
        currentAccent={accentColor}
        setAccent={setAccentColor}
        palette={palette}
      />
      
      {/* Search & Navigation Area */}
      <div className="relative w-full max-w-[1800px] mx-auto px-4 md:px-8 z-40">
        {/* My Crate - Positioned absolute left within container, aligned near top */}
        <div className="absolute top-0 left-4 md:left-8 mt-4">
             <Deck history={history} onSelect={handleHistorySelect} />
        </div>
        
        <SearchBar onSearch={handleSearch} isLoading={isLoading} />
      </div>

      {/* Main Content Grid */}
      <main className="flex-grow w-full max-w-[1800px] mx-auto px-4 md:px-8 pt-4 grid grid-cols-1 lg:grid-cols-12 gap-2 items-start">
        
        {/* LEFT COLUMN (7 Cols) - Visualizer + Main Info 
            Shifted to items-start (Left) with padding to accommodate the Crate dropdown.
        */}
        <div className="lg:col-span-7 w-full flex flex-col items-center lg:items-start lg:pl-44 relative">
          
          {!currentTrack && !isLoading && (
            <div className="text-center lg:text-left w-full mt-12 opacity-0 animate-[fadeIn_1s_ease-out_forwards] delay-300 pr-2 lg:pr-0">
              <div className="font-mono text-retro-accent text-sm uppercase tracking-[0.3em] mb-4">
                System Idle
              </div>
              <p className="text-retro-dim dark:text-retro-darkDim max-w-md mx-auto lg:mx-0">
                Enter a query above to initialize the archive retrieval protocol.
              </p>
            </div>
          )}

          {/* Control Bar: Status Text aligned with visualizer (Left aligned) */}
          <div className="w-full max-w-[300px] md:max-w-[400px] xl:max-w-[500px] flex justify-start items-center mb-6 self-center lg:self-start min-h-[24px]">
              <div className={`font-mono text-xs uppercase tracking-widest transition-opacity duration-500 ${currentTrack ? 'opacity-100 text-retro-accent' : 'opacity-0'}`}>
                  {currentTrack ? 'Now Spinning' : ''}
              </div>
          </div>
          
          {currentTrack && (
            <>
              {/* Visualizer */}
              <div className="self-center lg:self-start animate-[fadeIn_0.5s_ease-out]">
                  <Visualizer track={currentTrack} mode={viewMode} />
              </div>
              
              <div className="mt-4 w-full flex justify-center lg:justify-start">
                  <TrackDetails 
                    track={currentTrack} 
                    mode={viewMode} 
                    setMode={setViewMode}
                    linerNotes={linerNotes}
                    isNotesLoading={isNotesLoading}
                    accentColor={accentColor}
                  />
              </div>
            </>
          )}
        </div>

        {/* RIGHT COLUMN (5 Cols) - Album Info Tab */}
        <div className="lg:col-span-5 w-full h-full min-h-[500px] lg:sticky lg:top-4">
            {currentTrack && (
                <InfoPanel 
                    albumDetails={albumDetails} 
                    currentTrack={currentTrack} 
                    isLoading={isAlbumLoading}
                    accentColor={accentColor}
                    onTrackSelect={handleTrackSelect}
                />
            )}
        </div>

      </main>

      <footer className="p-4 text-center font-mono text-xs text-retro-dim dark:text-retro-darkDim border-t border-retro-text/10 dark:border-retro-darkText/10">
            Sleevd. v2.8 • React • Gemini • iTunes
      </footer>
    </div>
  );
};

export default App;
