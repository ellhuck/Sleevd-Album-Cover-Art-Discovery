
import React from 'react';
import { Track, ViewMode } from '../types';

interface VisualizerProps {
  track: Track | null;
  mode: ViewMode;
}

const Visualizer: React.FC<VisualizerProps> = ({ track, mode }) => {
  if (!track) return null;

  return (
    <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] xl:w-[500px] xl:h-[500px] flex justify-center items-center mb-8 perspective-1000">
      
      {/* Static Sleeve */}
      <div 
        className={`
          absolute w-full h-full bg-retro-dim shadow-retro dark:shadow-retro-dark overflow-hidden transition-all duration-500 ease-in-out
          ${mode === ViewMode.SLEEVE ? 'opacity-100 z-20 scale-100' : 'opacity-0 z-0 scale-90'}
        `}
      >
        <img 
          src={track.highResArtwork} 
          alt={track.collectionName} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Spinning Vinyl */}
      <div
        className={`
          absolute w-full h-full rounded-full vinyl-texture border-4 border-[#111] flex justify-center items-center shadow-2xl transition-all duration-500 ease-in-out
          ${mode === ViewMode.VINYL ? 'opacity-100 z-20 scale-100' : 'opacity-0 z-0 scale-75'}
        `}
      >
        <div className={`w-full h-full rounded-full flex justify-center items-center ${mode === ViewMode.VINYL ? 'animate-spin-slow' : ''}`}>
            {/* Label */}
            <div className="w-[40%] h-[40%] rounded-full bg-white overflow-hidden border-[4px] border-retro-accent relative">
                <img 
                src={track.highResArtwork} 
                alt="Label" 
                className="w-full h-full object-cover"
                />
            </div>
            {/* Spindle Hole */}
            <div className="absolute w-4 h-4 bg-retro-bg dark:bg-retro-darkBg rounded-full z-30 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>

    </div>
  );
};

export default Visualizer;
