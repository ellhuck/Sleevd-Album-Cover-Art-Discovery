export interface Track {
  trackName: string;
  artistName: string;
  collectionName: string;
  collectionId: number; // Added for album lookup
  artworkUrl100: string;
  highResArtwork: string;
  previewUrl?: string;
  primaryGenreName?: string;
  releaseDate?: string;
  trackNumber?: number;
  discNumber?: number;
}

export interface AlbumDetails {
  copyright: string;
  trackCount: number;
  tracks: Track[];
}

export enum ViewMode {
  SLEEVE = 'SLEEVE',
  VINYL = 'VINYL'
}

export interface LinerNotes {
  fact: string;
  mood: string;
  similarArtists: string[];
}

export type SearchType = 'song' | 'album';

export interface AccentColor {
  name: string;
  value: string;
}

export const ACCENT_COLORS: AccentColor[] = [
  { name: 'Retro Orange', value: '#ff4d00' },
  { name: 'Cyber Green', value: '#00ff9d' },
  { name: 'Hot Pink', value: '#ff00cc' },
  { name: 'Electric Blue', value: '#00d4ff' },
  { name: 'Voltage Yellow', value: '#ffd500' },
];