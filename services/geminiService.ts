import { GoogleGenAI, Type } from "@google/genai";
import { LinerNotes, Track } from '../types';

const apiKey = process.env.API_KEY || ''; 
// Note: In a real production app, ensure API_KEY is handled securely.
// For this demo, we assume the environment provides it.

export const generateLinerNotes = async (track: Track): Promise<LinerNotes> => {
  if (!apiKey) {
    return {
      fact: "Configure your API Key to see AI insights.",
      mood: "Unknown",
      similarArtists: []
    };
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Analyze the song "${track.trackName}" by "${track.artistName}".
    Provide a short, cool, retro-style 'liner note' fun fact or trivia about the song/artist (max 2 sentences).
    Describe the mood in 2-3 words.
    List 3 similar artists.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fact: { type: Type.STRING },
            mood: { type: Type.STRING },
            similarArtists: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["fact", "mood", "similarArtists"]
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text) as LinerNotes;
    }
    throw new Error("No text response");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      fact: "Could not retrieve archival data.",
      mood: "Static",
      similarArtists: []
    };
  }
};