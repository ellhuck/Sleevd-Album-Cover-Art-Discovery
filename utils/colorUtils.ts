import { AccentColor } from '../types';

/**
 * Extracts a palette of 5 dominant/vibrant colors from an image URL.
 * Uses HTML5 Canvas to analyze pixel data.
 * Prioritizes High Saturation and Medium Luminance for best UI contrast.
 */
export const extractPalette = async (imageUrl: string): Promise<AccentColor[]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve([]);
        return;
      }

      // Downscale for performance (50x50 is enough for dominant colors)
      const size = 50;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      const imageData = ctx.getImageData(0, 0, size, size).data;
      const colorCounts: Record<string, { count: number, rgb: number[], hsl: number[] }> = {};

      // Helper: RGB to HSL
      const rgbToHsl = (r: number, g: number, b: number) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }
        return [h, s, l];
      };

      // Analyze pixels
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];
        const a = imageData[i + 3];

        // Skip transparent
        if (a < 128) continue;
        
        // Skip extreme darks/lights (hard filtering)
        if (r < 10 && g < 10 && b < 10) continue; 
        if (r > 250 && g > 250 && b > 250) continue;

        // Quantize colors to group similar shades (round to nearest 20)
        const step = 20;
        const rQ = Math.floor(r / step) * step;
        const gQ = Math.floor(g / step) * step;
        const bQ = Math.floor(b / step) * step;

        const key = `${rQ},${gQ},${bQ}`;

        if (!colorCounts[key]) {
          colorCounts[key] = { count: 0, rgb: [rQ, gQ, bQ], hsl: rgbToHsl(rQ, gQ, bQ) };
        }
        colorCounts[key].count++;
      }

      // Helper: Calculate a score based on frequency, saturation, and luminance suitability
      const scoreColor = (item: { count: number, hsl: number[] }) => {
          const [h, s, l] = item.hsl;
          
          // We want High Saturation (vibrant)
          // We want Medium Luminance (visible on both dark and light if possible, or at least not black/white)
          
          const saturationScore = s * 3; // Weight saturation heavily
          const luminanceScore = 1 - Math.abs(l - 0.5); // Prefer 0.5 luminance (middle gray brightness)
          const countScore = Math.log(item.count); // Logarithmic count to not let huge background areas dominate completely if they are dull

          return countScore + (saturationScore * 5) + (luminanceScore * 2);
      };

      // Convert to array and sort by our custom score
      const sortedColors = Object.values(colorCounts)
        .sort((a, b) => scoreColor(b) - scoreColor(a));

      // Select top distinct colors
      const palette: AccentColor[] = [];
      
      // Helper: RGB to Hex
      const toHex = (c: number) => {
        const hex = c.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      };

      for (const item of sortedColors) {
        if (palette.length >= 5) break;

        const [r, g, b] = item.rgb;
        const hex = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
        
        // Simple distance check to avoid adding effectively identical colors
        const isDistinct = palette.every(p => p.value !== hex);
        
        if (isDistinct) {
          palette.push({
            name: `Sampled ${palette.length + 1}`,
            value: hex
          });
        }
      }

      resolve(palette);
    };

    img.onerror = () => {
      console.warn("Could not load image for color extraction");
      resolve([]);
    };
  });
};