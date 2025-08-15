// src/ui/utils/pngToPattern.ts
// PNG heightmap to pattern conversion utilities (Stage 1U)

export type HeightmapParams = {
  zDepth: number; // How much to extrude the heightmap
  threshold: number; // Minimum value to consider as "solid"
  invert: boolean; // Invert the heightmap
};

export type HeightmapResult = {
  size: { x: number; y: number; z: number };
  channel: Uint8Array;
  preview: ImageData; // For UI preview
};

/**
 * Convert a PNG image to a 3D voxel pattern
 */
export async function pngToPattern(
  file: File, 
  params: HeightmapParams
): Promise<HeightmapResult> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    const img = new Image();
    img.onload = () => {
      try {
        // Set canvas size to image dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image to canvas
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const { width, height, data } = imageData;
        
        // Convert to grayscale and create 3D pattern
        const channel = new Uint8Array(width * height * params.zDepth);
        let channelIndex = 0;
        
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const pixelIndex = (y * width + x) * 4;
            const r = data[pixelIndex];
            const g = data[pixelIndex + 1];
            const b = data[pixelIndex + 2];
            
            // Convert to grayscale (simple average)
            const gray = Math.round((r + g + b) / 3);
            
            // Apply threshold and invert if needed
            let heightValue = gray;
            if (params.invert) {
              heightValue = 255 - heightValue;
            }
            
            // Create 3D extrusion
            for (let z = 0; z < params.zDepth; z++) {
              const normalizedHeight = Math.floor((heightValue / 255) * params.zDepth);
              const isSolid = z < normalizedHeight && heightValue >= params.threshold;
              channel[channelIndex++] = isSolid ? 255 : 0;
            }
          }
        }
        
        resolve({
          size: { x: width, y: height, z: params.zDepth },
          channel,
          preview: imageData
        });
        
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Create a preview canvas from ImageData
 */
export function createPreviewCanvas(imageData: ImageData): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.putImageData(imageData, 0, 0);
  }
  
  return canvas;
}

/**
 * Validate PNG file
 */
export function validatePNGFile(file: File): boolean {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return false;
  }
  
  // Check file size (reasonable limit: 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return false;
  }
  
  return true;
}

/**
 * Get default heightmap parameters
 */
export function getDefaultHeightmapParams(): HeightmapParams {
  return {
    zDepth: 8,
    threshold: 128,
    invert: false
  };
}
