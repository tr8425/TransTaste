/**
 * Compress and resize an image blob/base64 before sending to the API.
 * Target: max 1600px on longest side, JPEG quality 0.75 → typically < 300KB
 */

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.75;

/**
 * Compress a Blob (from camera/gallery) into a smaller base64 data URI.
 */
export async function compressBlob(blob: Blob): Promise<string> {
  const bitmap = await createImageBitmap(blob);
  const { width, height } = getScaledDimensions(bitmap.width, bitmap.height);

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const compressed = await canvas.convertToBlob({
    type: 'image/jpeg',
    quality: JPEG_QUALITY,
  });

  return blobToBase64(compressed);
}

/**
 * Compress an existing base64 data URI string into a smaller one.
 */
export async function compressBase64(dataUri: string): Promise<string> {
  const blob = await (await fetch(dataUri)).blob();
  return compressBlob(blob);
}

function getScaledDimensions(w: number, h: number): { width: number; height: number } {
  if (w <= MAX_DIMENSION && h <= MAX_DIMENSION) return { width: w, height: h };
  const ratio = Math.min(MAX_DIMENSION / w, MAX_DIMENSION / h);
  return {
    width: Math.round(w * ratio),
    height: Math.round(h * ratio),
  };
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
