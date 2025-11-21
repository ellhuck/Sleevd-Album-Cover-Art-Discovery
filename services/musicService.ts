import { Track, SearchType, AlbumDetails } from '../types';

const mapItunesResultToTrack = (raw: any): Track => {
    return {
        trackName: raw.trackName || raw.collectionName,
        artistName: raw.artistName,
        collectionName: raw.collectionName,
        collectionId: raw.collectionId,
        artworkUrl100: raw.artworkUrl100,
        highResArtwork: raw.artworkUrl100 ? raw.artworkUrl100.replace('100x100bb', '800x800bb') : '',
        previewUrl: raw.previewUrl,
        primaryGenreName: raw.primaryGenreName,
        releaseDate: raw.releaseDate,
        trackNumber: raw.trackNumber,
        discNumber: raw.discNumber,
    };
};

export const searchTracks = async (query: string, type: SearchType = 'song'): Promise<Track | null> => {
  if (!query) return null;
  
  try {
    const entity = type === 'song' ? 'song' : 'album';
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=${entity}&limit=1`);
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return mapItunesResultToTrack(data.results[0]);
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch track:", error);
    throw error;
  }
};

export const getAlbumDetails = async (collectionId: number): Promise<AlbumDetails | null> => {
    try {
        // Lookup entities by collection ID to get all songs in the album
        // Added limit=200 to ensure we get full tracklists for larger albums (compilations/deluxe)
        const response = await fetch(`https://itunes.apple.com/lookup?id=${collectionId}&entity=song&limit=200`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            // The first result is usually the Collection record, followed by tracks
            const collection = data.results[0];
            
            // Filter out the collection object from the rest to just get tracks
            const tracks = data.results
                .slice(1)
                .filter((item: any) => item.wrapperType === 'track')
                .map(mapItunesResultToTrack);

            // Sort tracks by Disc Number then Track Number
            tracks.sort((a: Track, b: Track) => {
                const discA = a.discNumber || 1;
                const discB = b.discNumber || 1;
                if (discA !== discB) return discA - discB;
                return (a.trackNumber || 0) - (b.trackNumber || 0);
            });

            return {
                copyright: collection.copyright || '',
                trackCount: collection.trackCount || tracks.length,
                tracks: tracks
            };
        }
        return null;
    } catch (error) {
        console.error("Failed to fetch album details:", error);
        return null;
    }
}